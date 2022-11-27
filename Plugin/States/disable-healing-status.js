/*
	Version 1.0
	By MarkyJoe1990
	
	This plugin allows for status effects that prevent healing
	of all kinds, whether it be from healing tiles, or from
	healing items. Units with the status effect CANNOT be targetted
	as healing partners.
	
	How to Use:
	- Create a status effect
	- Go into its Custom Parameters
	- Add the property "disableHeal" and set it to true.
	- Done
*/

( function () {
	var hasHealingDisableStatus = function(unit) {
		var turnState = unit.getTurnStateList();
		var i, count = turnState.getCount();
		
		for (i = 0; i < count; i++) {
			var currentTurnState = turnState.getData(i);
			var currentState = currentTurnState.getState();
			
			if (currentState.custom.disableHeal == true) {
				return true;
			}
		}
		
		return false;
	}
	
	var alias1 = RecoveryItemAvailability.isItemAllowed;
	RecoveryItemAvailability.isItemAllowed = function(unit, targetUnit, item) {
		if (hasHealingDisableStatus(targetUnit)) {
			return false;
		}
		
		return alias1.call(this, unit, targetUnit, item);
	}
	
	var alias2 = EntireRecoveryControl._isTargetAllowed;
	EntireRecoveryControl._isTargetAllowed = function(unit, targetUnit, item) {
		if (hasHealingDisableStatus(targetUnit)) {
			return false;
		}
		
		return alias2.call(this, unit, targetUnit, item);
	}
	
	var alias3 = RecoveryAllFlowEntry._getRecoveryValue;
	RecoveryAllFlowEntry._getRecoveryValue = function(unit) {
		var result = alias3.call(this, unit);
		
		if (result > 0 && hasHealingDisableStatus(unit)) {
			return 0;
		}
		
		return result;
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
		
		if (state.custom.disableHeal == true) {
			score += 10;
		}
		
		return score;
	}
}) ();