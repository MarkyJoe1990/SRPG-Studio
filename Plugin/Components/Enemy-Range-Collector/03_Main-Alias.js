var ENEMY_RANGE_IMAGE_SET;

( function () {
    var alias6 = UnitRangePanel._setRangeData;
    UnitRangePanel._setRangeData = function() {
        // Check if unit already has range in enemyRangeCollector
        var unit = this._unit;
        var unitType = unit.getUnitType();

        if (unitType === UnitType.ENEMY) {
            var rangeData = CurrentMap.getEnemyRangeCollector().getUnitRangeData(unit);
            if (rangeData != null) {
                var isWeapon = rangeData.weaponIndexArray.length > 0;
                this._mapChipLight.setLightType(MapLightType.MOVE);
                this._mapChipLight.setIndexArray(rangeData.indexArray);
                if (isWeapon) {
                    this._mapChipLightWeapon.setLightType(MapLightType.RANGE);
                    this._mapChipLightWeapon.setIndexArray(rangeData.weaponIndexArray);
                }
                else {
                    this._mapChipLightWeapon.endLight();
                }
                return;
            }
        }

        alias6.call(this);
    }

    // FIXES SAVE ISSUES
    // You will need to save all enemy range collection data to
    // a save file to prevent lag on load.
    var alias8 = PlayerTurn._prepareTurnMemberData;
    PlayerTurn._prepareTurnMemberData = function() {
        if (CurrentMap.isEnemyRangeCollectorActive() === false) {
            CurrentMap.resetEnemyRangeCollector();
        }

        this._enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        alias8.call(this);
    }

    var alias1 = PlayerTurn.moveTurnCycle;
	PlayerTurn.moveTurnCycle = function() {
        this._enemyRangeCollector.moveEnemyRangeCollector();
		return alias1.call(this);
	}

    var alias5 = PlayerTurn._doEventEndAction;
	PlayerTurn._doEventEndAction = function() {
		alias5.call(this);
		if (InputControl.isCancelAction() === false) {
			this._enemyRangeCollector.reset();
		}
	}

    var alias10 = MapSequenceArea._moveMoving;
    MapSequenceArea._moveMoving = function() {
        var result = alias10.call(this);

        if (result === MapSequenceAreaResult.COMPLETE && ENEMY_RANGE_COLLECTOR_CONFIG.disableUpdateOnUnitMove !== true) {
            // Either the parent turn object is PlayerTurn or it's RepeatMoveFlowEntry
            // PlayerTurn doesn't have this._playerTurn but RepeatMoveFlowEntry does.
            var turnObject = this._parentTurnObject._playerTurn || this._parentTurnObject;
            turnObject._enemyRangeCollector.saveState(); // Abandon if save states don't work well.

            // Sorting stuff
            var unit = turnObject._targetUnit;
            var enemyRangeCollector = turnObject._enemyRangeCollector;
            enemyRangeCollector.reset(enemyRangeCollector.createSortByDistance(unit));
        }

        return result;
    }

    var alias11 = MapSequenceCommand._moveCommand;
    MapSequenceCommand._moveCommand = function() {
        var result = alias11.call(this);

        if (result === MapSequenceCommandResult.CANCEL && ENEMY_RANGE_COLLECTOR_CONFIG.disableUpdateOnUnitMove !== true) {
            this._parentTurnObject._enemyRangeCollector.loadState();
            // in case the load state system doesn't work properly
            // this._parentTurnObject._enemyRangeCollector.reset();
        }

        return result;
    }

    var alias9 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function() {
        alias9.call(this);

        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        if (enemyRangeCollector != null) {
            ENABLE_ENEMY_RANGE_DEBUG && enemyRangeCollector.drawDebug();
        }
    }

    var alias13 = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function() {
        alias13.call(this);
        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        if (enemyRangeCollector != null) {
            enemyRangeCollector.drawFlagMark();
        }
    }

    var alias17 = MapLayer.moveMapLayer;
    MapLayer.moveMapLayer = function() {
        var result = alias17.call(this);

        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        if (enemyRangeCollector != null) {
            enemyRangeCollector.moveFlagMark();
        }

        return result;
    }

    var alias12 = MapEdit._selectAction;
    MapEdit._selectAction = function(unit) {
        var result = alias12.call(this, unit);

        if (unit == null) {
            return result;
        }

        if (unit.getUnitType() === UnitType.PLAYER) {
            return result;
        }

        if (ENEMY_RANGE_COLLECTOR_CONFIG.disableIndividualRangeMarking == true) {
            return result;
        }

        if (result === MapEditResult.UNITSELECT) {
            result = MapEditResult.NONE;

            var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
            var rangeData = enemyRangeCollector.getUnitRangeData(unit);

            if (rangeData != null) {
                rangeData.isMarked = rangeData.isMarked !== true;

                if (rangeData.isMarked === true) {
                    enemyRangeCollector.addToIndividualIndexArray(rangeData);
                } else {
                    enemyRangeCollector.removeFromIndividualIndexArray(rangeData);
                }

                enemyRangeCollector.updateVisuals();
            }

            MediaControl.soundDirect("commandselect");
        }

        return result;
    }

    var alias14 = EnemyTurn._createAutoAction;
	EnemyTurn._createAutoAction = function() {
		var result = alias14.call(this);

		var unit = this._orderUnit;
		var autoActionArray = this._autoActionArray;
		
		AutoActionBuilder._pushRangeUpdate(unit, autoActionArray);
		
		return result;
	}

    AutoActionBuilder._pushRangeUpdate = function(unit, autoActionArray) {
        var autoAction = createObject(RangeUpdateAutoAction);
	
        autoAction.setAutoActionInfo(unit);
        autoActionArray.push(autoAction);
    }

    var alias15 = MoveAutoAction.enterAutoAction;
    MoveAutoAction.enterAutoAction = function() {
        var isSkipMode = this.isSkipMode();
        var unit = this._unit;
		
		if (isSkipMode === true && unit.getUnitType() === UnitType.ENEMY) {
            this._rangeUpdate();
        }

        return alias15.call(this);
    }

    var alias16 = MoveAutoAction.moveAutoAction;
    MoveAutoAction.moveAutoAction = function() {
        var result = alias16.call(this);
        var unit = this._unit;
		
		if (result !== MoveResult.CONTINUE && unit.getUnitType() === UnitType.ENEMY) {
            this._rangeUpdate();
        }

        return result;
    }

    MoveAutoAction._rangeUpdate = function() {
        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        var unit = this._unit;
        var rangeData = enemyRangeCollector.getUnitRangeData(unit);
        if (rangeData != null) {
            enemyRangeCollector.removeFromCombinedIndexArray(rangeData);
            enemyRangeCollector.updateRangeData(rangeData);
            enemyRangeCollector.addToCombinedIndexArray(rangeData);
            enemyRangeCollector.updateVisuals();
        }
    }

    var alias18 = SetupControl.setup;
    SetupControl.setup = function() {
        alias18.call(this);
        ENEMY_RANGE_IMAGE_SET = root.getMaterialManager().createImage("enemy-range-edges", ENEMY_RANGE_COLLECTOR_CONFIG.customRangeDisplayImage);
    }
}) ();