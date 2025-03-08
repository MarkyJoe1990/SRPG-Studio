/*
    Defensive Approach AI
    v1.0 by MarkyJoe1990

    Enemy will try to stand at the edge of the
    target's attack range until the target
    steps into their own attack range. Then
    they will attack.

    Known Issues:
    - If the unit's chosen target is in range,
    the player's attack range is not considered
    even if the chosen action is not an attack.

    - Unit will always prefer to walk as short
    a distance as possible towards the edge
    of the player's range, even if there is
    an available position that better closes
    the gap between the unit and their target.
*/

( function () {
    var alias1 = AutoActionBuilder.buildCustomAction;
    AutoActionBuilder.buildCustomAction = function(unit, autoActionArray, keyword) {
        if (keyword === "Defensive Approach") {
            this._buildDefensiveApproachAction(unit, autoActionArray);
        }

        return alias1.call(this, unit, autoActionArray, keyword);
    }

    AutoActionBuilder._buildDefensiveApproachAction = function(unit, autoActionArray) {
        var combination = CombinationManager.getApproachCombination(unit, true);
        if (combination === null) {
            // Can't attack player. Initiate defensive approach.
            // Get player range
            var simulator = root.getCurrentSession().createMapSimulator();

            // Can't use startSimulationWeaponAll because
            // it doesn't work with disableMapUnit
            // Have to calculate ranges individually
            var indexArray = this._generateOpponentIndexArray(simulator, FilterControl.getReverseFilter(unit.getUnitType()));

            // Unit needs to step out of the player's range.
            // Find the safe spots. The outer edges of the player attack range.
            var safeIndexArray = [];
            var i, count = indexArray.length;
            var pos, relativePos = createPos(0, 0), relativeIndex, index, j, count2 = XPoint.length, potentialUnit;
            simulator.resetSimulationMark();

            // Mark all player tiles
            for (i = 0; i < count; i++) {
                simulator.setSimulationMark(indexArray[i], true);
            }

            for (i = 0; i < count; i++) {
                index = indexArray[i];
                pos = createPos(CurrentMap.getX(index), CurrentMap.getY(index));

                // Check every tile adjacent to the
                // current player attack tile.
                for (j = 0; j < count2; j++) {
                    relativePos.x = pos.x + XPoint[j];
                    relativePos.y = pos.y + YPoint[j];
                    relativeIndex = CurrentMap.getIndex(relativePos.x, relativePos.y);
                    if (relativeIndex === -1) {
                        continue;
                    }

                    // Skip if this tile has already been checked
                    if (simulator.isSimulationMark(relativeIndex) === true) {
                        continue;
                    }

                    // Skip if there is a unit occupying this space
                    potentialUnit = PosChecker.getUnitFromPos(relativePos.x, relativePos.y);
                    if (potentialUnit != null && potentialUnit != unit) {
                        continue;
                    }

                    simulator.setSimulationMark(relativeIndex, true);
                    safeIndexArray.push(relativeIndex);
                }
            }

            // You now have an array of all the tiles that
            // are just outside of the player's range.
            // Now, you need to narrow down which tiles
            // should be stepped to.
            // Specify where the unit ideally wants to be.
            combination = CombinationManager.getEstimateCombination(unit);
            if (combination === null) {
                // Can't reach player at all. Cancel.
                return this._buildEmptyAction();
            } else {
                // If nowhere is safe, approach normally.
                if (safeIndexArray.length === 0) {
                    this._pushMove(unit, autoActionArray, combination);
                    this._pushWait(unit, autoActionArray, combination);
                    return true;
                }
            }

            // Combination created. Already has a course set
            // Need to replace this with a different course
            // that pulls the unit out of the player's range.
            // Find available tile that is closest to the desired
            // end point...?
            var goalIndex = combination.posIndex;
            var simulator2 = root.getCurrentSession().createMapSimulator();
            simulator2.startSimulation(unit, CurrentMap.getWidth() * CurrentMap.getHeight());

            safeIndexArray.sort(function(a, b) {
                var result = simulator2.getSimulationMovePoint(a) - simulator2.getSimulationMovePoint(b);
                if (result === 0) {
                    var aX = CurrentMap.getX(a);
                    var aY = CurrentMap.getY(a);
    
                    var bX = CurrentMap.getX(b);
                    var bY = CurrentMap.getY(b);
    
                    var goalX = CurrentMap.getX(goalIndex);
                    var goalY = CurrentMap.getY(goalIndex);
    
                    var distAX = Math.abs(aX - goalX);
                    var distAY = Math.abs(aY - goalY);
    
                    var distBX = Math.abs(bX - goalX);
                    var distBY = Math.abs(bY - goalY);
    
                    return (distAX + distAY) - (distBX + distBY);
                }

                return result;
            });

            combination.cource = CourceBuilder.createExtendCource(unit, safeIndexArray[0], simulator2);
            this._pushMove(unit, autoActionArray, combination);
            this._pushWait(unit, autoActionArray, combination);
        } else {
			this._pushGeneral(unit, autoActionArray, combination);
		}

        return true;
    }

    AutoActionBuilder._generateOpponentIndexArray = function(simulator, unitFilter) {
        var indexArray = [];
        var listArray = FilterControl.getListArray(unitFilter);
        var i, list, count = listArray.length;
        var j, unit, attackRange, count2;

        simulator.resetSimulationMark();
        var k, count3, moveIndexArray, weaponIndexArray, moveIndex, weaponIndex;
        for (i = 0; i < count; i++) {
            list = listArray[i];
            count2 = list.getCount();
            for (j = 0; j < count2; j++) {
                unit = list.getData(j);
                attackRange = UnitRangePanel.getUnitAttackRange(unit);

                simulator.disableMapUnit();
                simulator.startSimulationWeapon(unit, attackRange.mov, attackRange.startRange, attackRange.endRange);

                moveIndexArray = simulator.getSimulationIndexArray();
                count3 = moveIndexArray.length;
                for (k = 0; k < count3; k++) {
                    moveIndex = moveIndexArray[k];
                    if (simulator.isSimulationMark(moveIndex) === false) {
                        simulator.setSimulationMark(moveIndex, true);
                        indexArray.push(moveIndex);
                    }
                }
                
                weaponIndexArray = simulator.getSimulationWeaponIndexArray();
                count3 = weaponIndexArray.length;
                for (k = 0; k < count3; k++) {
                    weaponIndex = weaponIndexArray[k];
                    if (simulator.isSimulationMark(weaponIndex) === false) {
                        simulator.setSimulationMark(weaponIndex, true);
                        indexArray.push(weaponIndex);
                    }
                }
            }
        }

        return indexArray;
    }
}) ();