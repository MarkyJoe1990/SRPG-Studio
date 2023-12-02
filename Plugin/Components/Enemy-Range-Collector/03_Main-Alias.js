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

    var alias9 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function() {
        alias9.call(this);

        if (ENABLE_ENEMY_RANGE_DEBUG === true) {
            var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
            enemyRangeCollector != null && enemyRangeCollector.drawDebug();
        }
    }
}) ();