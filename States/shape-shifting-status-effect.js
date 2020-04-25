/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin makes status effects able to shape shift into
	a different status effect after its timer has run out, or
	after it has been removed in an event.
	
	How to use:
	- Create a status effect
	- Give it the custom parameter "shapeShift"
	- Set the value of "shapeShift" to the id of the status you want this to shape shift into.
	- Done
	
*/

(function () {
	var alias1 = StateControl.arrangeState;
	StateControl.arrangeState = function(unit, state, increaseType) {
		var turnState = null;
		var list = unit.getTurnStateList();
		var editor = root.getDataEditor();
		
		if (state != null) {
			if (state.custom.shapeShift != undefined && increaseType === IncreaseType.DECREASE) {
				newState = root.getBaseData().getStateList().getDataFromId(state.custom.shapeShift);
				
				turnState = this.getTurnState(unit, newState);
				if (turnState !== null) {
					// If the state has already been added, update the turn number.
					turnState.setTurn(newState.getTurn());
				}
				else {
						turnState = editor.addTurnStateData(list, newState);
				}
			}
		}
		
		return alias1.call(this, unit, state, increaseType);
	}
}) ();
