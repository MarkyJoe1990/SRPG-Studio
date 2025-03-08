/*
    Enemy will start pursuing targets if they are within
    X turns worth of movement away.

    Simply set the AI to custom, with the Keyword
    "X Turn Approach" with X being the amount of turns
    away the target needs to be within to get the enemy
    to approach.
*/

( function () {
    var alias1 = AutoActionBuilder.buildCustomAction;
    AutoActionBuilder.buildCustomAction = function(unit, autoActionArray, keyword) {
        var pattern = /\d+ Turn Approach/g;
        if (pattern.test(keyword) === true) {
            var turns = parseInt(keyword.split(" ")[0]);

            this._buildTurnApproachAction(unit, autoActionArray, turns);
        }

        return alias1.call(this, unit, autoActionArray, keyword);
    }

    AutoActionBuilder._buildTurnApproachAction = function(unit, autoActionArray, turns) {
        var combination = CombinationManager.getApproachCombination(unit, true);
        if (combination === null) {
            combination = CombinationManager.getEstimateCombination(unit);
            if (combination === null) {
                return this._buildEmptyAction();
            } else {
                var attackRange = UnitRangePanel.getUnitAttackRange(unit);
                var mov = attackRange.mov * turns;
                if (combination.movePoint <= mov) {
                    this._pushMove(unit, autoActionArray, combination);
                    this._pushWait(unit, autoActionArray, combination);
                } else {
                    return this._buildEmptyAction();
                }
            }
        } else {
			this._pushGeneral(unit, autoActionArray, combination);
		}

        return true;
    }
}) ();