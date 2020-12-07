(function () {
	UnitCommand._appendUnitEvent = function(groupArray) {
		groupArray.appendObject(UnitCommand.SubUnitEvent);
		
		var i, event, info;
		var unit = this.getListCommandUnit();
		var count = unit.getUnitEventCount();
		
		for (i = 0; i < count; i++) {
			event = unit.getUnitEvent(i);
			info = event.getUnitEventInfo();
			if (info.getUnitEventType() === UnitEventType.COMMAND && event.isEvent() && event.custom.excludeFromSubMenu == true) {
				groupArray.appendObject(UnitCommand.UnitEvent);
				groupArray[groupArray.length - 1].setEvent(event);
			}
		}
		
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
				if (info.getUnitEventType() === UnitEventType.COMMAND && event.isEvent() && event.custom.excludeFromSubMenu == true) {
					groupArray.appendObject(UnitCommand.UnitEvent);
					groupArray[groupArray.length - 1].setEvent(event);
				}
			}
		}
		
	}
}) ();