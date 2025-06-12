/*
	Version 1.1
	Made by MarkyJoe1990
	
	This plugin allows the creation of "taunt" status effects.
	Units inflicted with the taunt status will prioritize attacking
	the unit that taunted them.
	
	How to use:
	- Create a status effect
	- Give it the custom parameter "isTaunt".
	- Set the value to true
	- If you want player units to be tauntable, I recommend setting
		the state to use the "Auto AI" status condition option.
	- Done
	
	Limitations:
	Taunting only works when the unit is inflicted by either a weapon
	or item. Inflicting via event command or other methods do not currently work.
	
	There is also no option for making the unit outright ignore non-taunt targets
	yet.
*/

( function() {
	var alias1 = StateControl.arrangeState;
	StateControl.arrangeState = function(unit, state, increaseType) {
		var preAttack, attackParam, activeUnit, passiveUnit, activeSpirit;
		var turnState = alias1.call(this, unit, state, increaseType);
		
		if (TauntControl.isTaunt(state) === true && increaseType == IncreaseType.INCREASE) {
			preAttack = AttackControl.getPreAttackObject();
			
			if (typeof SpiritSkillControl != "undefined") {
				activeSpirit = SpiritSkillControl.getActiveSpirit();
			} else {
				activeSpirit == null;
			}
			
			if (preAttack != null) {
				attackParam = preAttack.getAttackParam();
				activeUnit = attackParam.unit;
				passiveUnit = attackParam.targetUnit;
				
				if (activeUnit == unit) {
					TauntControl.setTauntTarget(activeUnit, passiveUnit);
				} else {
					TauntControl.setTauntTarget(passiveUnit, activeUnit);
				}
			} else if (activeSpirit != null) {
				activeUnit = activeSpirit.srcUnit;
				
				if (unit != activeUnit) {
					TauntControl.setTauntTarget(unit, activeUnit);
				}
			} else if (root.getBaseScene() !== SceneType.REST) {
				var session = root.getCurrentSession();
				var activeUnit = session.getActiveEventUnit();
				if (activeUnit != null) {

					if (unit != activeUnit) {
						TauntControl.setTauntTarget(unit, activeUnit);
					}
				}
			}
		}
		
		return turnState;
	}
	
	var alias2 = StateItemUse.enterMainUseCycle;
	StateItemUse.enterMainUseCycle = function(itemUseParent) {
		var result = alias2.call(this, itemUseParent);
		
		var itemTargetInfo = itemUseParent.getItemTargetInfo();
		var info = itemTargetInfo.item.getStateInfo();
		
		var unit = itemTargetInfo.unit;
		var targetUnit = itemTargetInfo.targetUnit;
		var state = info.getStateInvocation().getState();
		
		if (TauntControl.isTaunt(state) === true) {
			TauntControl.setTauntTarget(targetUnit, unit);
		}
		
		return result;
	}
	
	var alias3 = BaseAIScorer._getPlusScore;
	BaseAIScorer._getPlusScore = function(unit, combination) {
		var score = alias3.call(this, unit, combination);
		
		var targetUnit = combination.targetUnit;
		if (targetUnit == null) {
			return score;
		}

		if (TauntControl.isTaunted(unit)) {
			if (TauntControl.isTauntTarget(unit, targetUnit)) {
				score += TauntControl.getTauntScore();
			}
		}
		
		return score;
	}
	
	var alias4 = StateScoreChecker.getScore;
	StateScoreChecker.getScore = function(unit, targetUnit, state) {
		if (StateControl.isStateBlocked(targetUnit, unit, state)) {
			// If the state cannot be given to the opponent, the item is not used.
			return -1;
		}
		
		if (StateControl.getTurnState(targetUnit, state) !== null) {
			// If the opponent has already been given that state, the item is not used.
			return -1;
		}
		
		var score = alias4.call(this, unit, targetUnit, state);
		
		var option = state.getBadStateOption();
		if (TauntControl.isTaunt(state) === true && option == BadStateOption.AUTO) {
			score += 20;
		}

		return score;
	}
}) ();