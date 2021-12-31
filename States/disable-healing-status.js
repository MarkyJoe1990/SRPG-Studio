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
}) ();