( function () {
    // Aliases
    var alias1 = BattleSetupScene._pushFlowAfterEntries;
    BattleSetupScene._pushFlowAfterEntries = function(straightFlow) {
        alias1.call(this, straightFlow);
        straightFlow.pushFlowEntry(EnemyRangeCollectorFlowEntry);
    };

    BattleSetupScene._timePassed = 0;
    var alias5 = BattleSetupScene._prepareSceneMemberData;
    BattleSetupScene._prepareSceneMemberData = function() {
        this._timePassed = 0;
        alias5.call(this);
    }

    // Set up EnemyRangeCollector after opening event.
    var alias7 = BattleSetupScene._pushFlowBeforeEntries;
    BattleSetupScene._pushFlowBeforeEntries = function(straightFlow) {
        alias7.call(this, straightFlow);
        straightFlow.pushFlowEntry(EnemyRangeSetUpFlowEntry);
    }

    var alias3 = BattleSetupScene.moveSceneCycle;
    BattleSetupScene.moveSceneCycle = function() {
        if (CurrentMap.isEnemyRangeCollectorActive() === true && this._timePassed % 2 == 0) {
            CurrentMap.getEnemyRangeCollector().checkNextUnit();
        }

        this._timePassed++;
        return alias3.call(this);
    }

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

        alias8.call(this);
    }

    var alias9 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function() {
        alias9.call(this);

        if (ENABLE_ENEMY_RANGE_DEBUG === true) {
            var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
            enemyRangeCollector != null && enemyRangeCollector.drawDebug();
        }
    }

    MarkingPanel._getWeaponColor = function() {
        return this._getColor();
    }

    var alias4 = MarkingPanel.drawMarkingPanel;
    MarkingPanel.drawMarkingPanel = function() {
		if (!this.isMarkingEnabled()) {
			return;
		}
        
        var combinedIndexArray = CurrentMap.getEnemyRangeCollector().getCombinedIndexArray();
		root.drawFadeLight(combinedIndexArray.indexArray, this._getColor(), this._getAlpha());
		root.drawFadeLight(combinedIndexArray.weaponIndexArray, this._getWeaponColor(), this._getAlpha());
	}
	
    // Disable MarkingPanel's unit range calculation functions
    MarkingPanel.updateMarkingPanel = function() {}
    MarkingPanel.updateMarkingPanelFromUnit = function(unit) {}

    // Additional CurrentMap Methods
    CurrentMap._enemyRangeCollector = null;
    var alias2 = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function() {
        alias2.call(this);
        this._enemyRangeCollector = null;
    };

    CurrentMap.getEnemyRangeCollector = function() {
        return this._enemyRangeCollector;
    }

    CurrentMap.resetEnemyRangeCollector = function() {
        this._enemyRangeCollector = createObject(EnemyRangeCollector);
    }

    CurrentMap.isEnemyRangeCollectorActive = function() {
        return this._enemyRangeCollector != null;
    }
}) ();