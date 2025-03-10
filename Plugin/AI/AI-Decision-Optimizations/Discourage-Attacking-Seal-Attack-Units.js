/*
	Discourage Attacking Seal Attack Units
	v1.0 By MarkyJoe1990

	If an attackable unit has a seal attack skill,
	and attacker lacks a way to break through it,
	OR, the attackable unit has a state with
	the custom parameter "isDiscouraged",
	don't bother, unless no other targets.

	"isDiscouraged" is a boolean custom parameter,
	so you can set it to true or false. However,
	you can also use a function with the active
	and passive units as arguments to account
	for specific circumstances.
*/

(function () {
	var alias1 = AIScorer.Weapon._getTotalScore;
	AIScorer.Weapon._getTotalScore = function(unit, combination) {
		if (this._isSealAttack(unit, combination)) {
			if (!this._isSealAttackBreak(unit, combination)) {
				return AIValue.MIN_SCORE;
			}
		}
		
		return alias1.call(this, unit, combination);
	}

	var alias2 = AIScorer.Weapon._getDamageScore;
	AIScorer.Weapon._getDamageScore = function(unit, combination) {
		// Treat discouraged actions as though unit cannot deal damage.
		if (this._isDiscouraged(unit, combination) == true) {
			return 0;
		}

		return alias2.call(this, unit, combination);
	}
	
	AIScorer.Weapon._isDiscouraged = function(unit, combination) {
		var targetUnit = combination.targetUnit;

		if (targetUnit != null) {
			var turnStateList = targetUnit.getTurnStateList();
			var i, currentTurnState, currentState, count = turnStateList.getCount();
			var isDiscouraged;

			for (i = 0; i < count; i++) {
				currentTurnState = turnStateList.getData(i);
				currentState = currentTurnState.getState();

				// Check if discourage conditions are met
				isDiscouraged = currentState.custom.isDiscouraged;
				if (typeof isDiscouraged == "function") {
					return isDiscouraged(unit, targetUnit);
				} else if (typeof isDiscouraged == "boolean") {
					return isDiscouraged;
				}
			}
		}

		return false;
	}

	AIScorer.Weapon._isSealAttack = function(unit, combination) {
		var targetUnit = combination.targetUnit;
		var weapon = ItemControl.getEquippedWeapon(targetUnit);
		
		if (weapon !== null && weapon.getWeaponOption() === WeaponOption.SEALATTACK) {
			return true;
		}
		
		return SkillControl.getBattleSkillFromValue(combination.targetUnit, unit, SkillType.BATTLERESTRICTION, BattleRestrictionValue.SEALATTACK) !== null
	};
	
	AIScorer.Weapon._isSealAttackBreak = function(unit, combination) {
		var targetUnit = combination.targetUnit
		var weapon = combination.item;
		
		if (weapon.getWeaponOption() === WeaponOption.SEALATTACKBREAK) {
			return true;
		}
		
		return SkillControl.getBattleSkillFromFlag(unit, targetUnit, SkillType.INVALID, InvalidFlag.SEALATTACKBREAK) !== null;
	};
}) ();