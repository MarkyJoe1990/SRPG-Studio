/*
	Made by MarkyJoe1990
	
	This plugin allows you to have unit events that can be used by any unit,
	not just the one who has the unit event. This allows for a tremendous
	number of possibilities, including fully customizable rally skills.
	
	How to Use:
	- Create a unit in the Player database
	- Click "Custom Parameters" and type {global:true}, then click OK
	- Put all unit events that you want to be global into this unit's unit events
	- Done
*/

(function () {
	var alias1 = UnitCommand._appendUnitEvent;
	UnitCommand._appendUnitEvent = function (groupArray) {
		//Include the original unit commands of the current character
		alias1.call(this, groupArray);
		
		//Go through entire player database
		var playerList = root.getBaseData().getPlayerList();
		var globalFound = false;
		
		//Check if any unit has the "global" custom parameter set to true
		for (i = 0; i < playerList.getCount(); ++i) {
			currentPlayer = playerList.getData(i);
			if (currentPlayer.custom.global == true) {
				globalFound = true;
				break;
			}
		}
		
		if (globalFound == true) {
			var globalCount = currentPlayer.getUnitEventCount();
			for (i = 0; i < globalCount; i++) {
				event = currentPlayer.getUnitEvent(i);
				info = event.getUnitEventInfo();
				if (info.getUnitEventType() === UnitEventType.COMMAND && event.isEvent()) {
					groupArray.appendObject(UnitCommand.UnitEvent);
					groupArray[groupArray.length - 1].setEvent(event);
				}
			}
		}
	}
}) ();
