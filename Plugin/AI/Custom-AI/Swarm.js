/*
    Swarm AI
    v1.0 by MarkyJoe1990

    Enemy will attack targets if they are within
    attack range of X of allies within group Y.

    Simply set the AI to custom, with the Keyword
    "Swarm X Y" with X being the amount of enemies
    from group Y that the target needs to be in range
    of to get the enemy to attack.

    Y is NOT an integer, but a binary number. This is
    so you can have enemies as part of multiple groups
    using just a single number. Basically, all it means
    is you'll need to open windows calc -> programmer ->
    set to binary, and make sure the 1s correspond to
    the groups you want to use... If you're not sure,
    then you can set units in distinct groups with the
    following values:
    1, 2, 4, 8, 16, 32, 64, etc.

    Now then, let's say we want the enemy to not
    approach unless the target is in range of 2 ally
    units in group 1. The keyword would be:

    Swarm 2 1

    But if we want a unit to be part of group 1 and 2,
    that would be

    Swarm 2 3

    Because 3 ix 0x0011 in binary, which means there is
    a 1 in the same positions as both 2 and 1 in binary.
*/

( function () {
    var alias1 = AutoActionBuilder.buildCustomAction;
    AutoActionBuilder.buildCustomAction = function(unit, autoActionArray, keyword) {
        var keywordSplit = keyword.split(" ");
        if (keywordSplit[0] === "Swarm") {
            var swarmCount = parseInt(keywordSplit[1]);
            var swarmGroup = parseInt(keywordSplit[2]);

            if (isNaN(swarmCount) === true) {
                root.msg("WARNING: " + unit.getName() + " has a NaN swarm count.");
                return alias1.call(this, unit, autoActionArray, keyword);
            }

            if (isNaN(swarmGroup) === true) {
                root.msg("WARNING: " + unit.getName() + " has a NaN swarm group.");
                return alias1.call(this, unit, autoActionArray, keyword);
            }

            this._buildSwarmAction(unit, autoActionArray, swarmCount, swarmGroup);
        }

        return alias1.call(this, unit, autoActionArray, keyword);
    }

    AutoActionBuilder._buildSwarmAction = function(unit, autoActionArray, swarmCount, swarmGroup) {
        var combination = CombinationManager.getApproachCombination(unit, true);
        if (combination === null) {
            return this._buildEmptyAction();
        } else {
            // Enemy is available to attack, but how many
            // allies of group Y are they in range of?
            var isSwarm = false;
            var listArray = FilterControl.getListArray(FilterControl.getNormalFilter(unit.getUnitType()));
            var i, keyword, keywordSplit, count = listArray.length;
            var totalSwarmCount = 0;
            var currentSwarmGroup;
            // Filter out all allies not in the same swarm group
            for (i = 0; i < count; i++) {
                listArray[i] = AllUnitList.getList(listArray[i], function(currentUnit) {
                    if (currentUnit === unit) {
                        return true;
                    }

                    // Allow custom parameter option
                    if ((currentUnit.custom.swarmGroup & swarmGroup) !== 0) {
                        return true;
                    }

                    var aiPattern = currentUnit.createAIPattern();
                    if (aiPattern == null) {
                        return false;
                    }

                    if (aiPattern.getPatternType() !== PatternType.CUSTOM) {
                        return false;
                    }

                    keyword = aiPattern.getCustomKeyword();
                    keywordSplit = keyword.split(" ");
                    if (keywordSplit[0] !== "Swarm") {
                        return false;
                    }

                    currentSwarmCount = parseInt(keywordSplit[1]);
                    if (isNaN(currentSwarmCount) === true) {
                        root.msg("WARNING: " + currentUnit.getName() + " has a NaN swarm count.");
                        return false;
                    }

                    currentSwarmGroup = parseInt(keywordSplit[2]);
                    if (isNaN(currentSwarmGroup) === true) {
                        root.msg("WARNING: " + currentUnit.getName() + " has a NaN swarm group.");
                        return false;
                    }

                    return (currentSwarmGroup & swarmGroup) !== 0;
                });

                totalSwarmCount += listArray[i].getCount();
            }


            if (swarmCount > totalSwarmCount) {
                swarmCount = totalSwarmCount;
            }

            // Now, grab the ranges of all remaining allies
            // and see if they can attack the desired target.
            var j, list, currentUnit, attackRange, indexArray, count2;
            var simulator = root.getCurrentSession().createMapSimulator();
            var availableSwarmCount = 0;
            for (i = 0; i < count; i++) {
                list = listArray[i];
                count2 = list.getCount();
                for (j = 0; j < count2; j++) {
                    currentUnit = list.getData(j);
                    attackRange = UnitRangePanel.getUnitAttackRange(currentUnit);
                    simulator.startSimulationWeapon(currentUnit, attackRange.mov, attackRange.startRange, attackRange.endRange);
                    indexArray = simulator.getSimulationWeaponIndexArray();
                    if (IndexArray.findUnit(indexArray, combination.targetUnit) === true) {
                        availableSwarmCount++;
                        if (availableSwarmCount >= swarmCount) {
                            isSwarm = true;
                        }
                    };
                }

                if (isSwarm === true) {
                    break;
                }
            }

            if (isSwarm === true) {
                this._pushGeneral(unit, autoActionArray, combination);
            } else {
                return this._buildEmptyAction();
            }
		}

        return true;
    }
}) ();