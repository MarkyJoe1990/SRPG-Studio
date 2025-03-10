/*
    Enemy is encouraged to occupy tiles that are
    in range of as few player units as possible
*/

( function () {
    AIScorer.PlayerRange = defineObject(BaseAIScorer, {
        getScore: function(unit, combination) {

            var posIndex = combination.posIndex;
            var prevX = unit.getMapX();
            var prevY = unit.getMapY();
            var x = CurrentMap.getX(posIndex);
            var y = CurrentMap.getY(posIndex);

            unit.setMapX(x);
            unit.setMapY(y);

            var switchArray = this._generateSwitchArray(FilterControl.getReverseFilter(unit.getUnitType()));

            unit.setMapX(prevX);
            unit.setMapY(prevY);

            return AIValue.MAX_MOVE - (switchArray[combination.posIndex] * 10);
        },

        _generateSwitchArray: function(unitFilter) {
            var mapSize = CurrentMap.getSize();
            var switchArray = Array(mapSize);
            for (var i = 0; i < mapSize; i++) {
                switchArray[i] = 0;
            }
            
            var simulator = root.getCurrentSession().createMapSimulator();
            var listArray = FilterControl.getListArray(unitFilter);
            var i, list, count = listArray.length;
            var j, unit, attackRange, count2;
            var k, count3, moveIndexArray, weaponIndexArray;
            for (i = 0; i < count; i++) {
                list = listArray[i];
                count2 = list.getCount();
                for (j = 0; j < count2; j++) {
                    unit = list.getData(j);
                    attackRange = UnitRangePanel.getUnitAttackRange(unit);
    
                    simulator.startSimulationWeapon(unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
    
                    moveIndexArray = simulator.getSimulationIndexArray();
                    count3 = moveIndexArray.length;
                    for (k = 0; k < count3; k++) {
                        switchArray[moveIndexArray[k]]++;
                    }
                    
                    weaponIndexArray = simulator.getSimulationWeaponIndexArray();
                    count3 = weaponIndexArray.length;
                    for (k = 0; k < count3; k++) {
                        switchArray[weaponIndexArray[k]]++;
                    }
                }
            }

            return switchArray;
        }
    });

    var alias1 = CombinationSelector._configureScorerSecond;
	CombinationSelector._configureScorerSecond = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.PlayerRange);
	}
}) ();