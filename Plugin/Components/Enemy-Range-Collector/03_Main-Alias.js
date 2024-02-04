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
        result = alias10.call(this);

        if (result === MapSequenceAreaResult.COMPLETE) {
            this._parentTurnObject._enemyRangeCollector.saveState(); // Abandon if save states don't work well.
            this._parentTurnObject._enemyRangeCollector.reset();
        }

        return result;
    }

    var alias11 = MapSequenceCommand._moveCommand;
    MapSequenceCommand._moveCommand = function() {
        var result = alias11.call(this);

        if (result === MapSequenceCommandResult.CANCEL) {
            this._parentTurnObject._enemyRangeCollector.loadState();
            // in case the load state system doesn't work properly
            // this._parentTurnObject._enemyRangeCollector.reset()
        }

        return result;
    }

    var alias9 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function() {
        alias9.call(this);

        if (ENABLE_ENEMY_RANGE_DEBUG === true) {
            var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
            enemyRangeCollector != null && enemyRangeCollector.drawDebug();
        }
    }
}) ();