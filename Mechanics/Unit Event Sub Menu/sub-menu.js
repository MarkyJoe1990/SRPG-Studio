var SubUnitEventMode = {
	SELECTION: 0,
	EVENT: 1
}

UnitCommand.SubUnitEvent = defineObject(UnitListCommand, {
	_eventWindow: null,
	_eventWindowInfo: null,
	_unit: null,
	_unitEventArray: null,
	_capsuleEvent: null,
	
	openCommand: function() {
		this._prepareCommandMemberData();
		this._completeCommandMemberData();
	},
	
	getCommandName: function() {
		return UNIT_EVENT_SUB_MENU_NAME;
	},
	
	isCommandDisplayable: function() {
		var i, currentPlayer, playerList, unit;
		unit = this.getCommandTarget();
		
		//Find at least one unit event that the player can use
		if (this._hasExecutableUnitEvent(unit)) {
			return true;
		}
		
		//Search player database for global unit
		var playerList = root.getBaseData().getPlayerList();
		
		for (i = 0; i < playerList.getCount(); i++) {
			currentPlayer = playerList.getData(i);
			
			if (currentPlayer.custom.global == true) {
				//search for an executable event
				if (this._hasExecutableUnitEvent(currentPlayer)) {
					return true;
				}
			}
		}
		
		return false;
	},
	
	isRepeatMoveAllowed: function() {
		return DataConfig.isUnitCommandMovable(RepeatMoveType.UNITEVENT);
	},
	
	moveCommand: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode == SubUnitEventMode.SELECTION) {
			
			input = this._eventWindow.moveWindow();
			this._event = this._eventWindow._unitEventScrollbar.getObject();
			if (input == ScrollbarInput.SELECT) {
				this._changeEvent();
			} else if (input == ScrollbarInput.CANCEL) {
				return MoveResult.CANCEL;
			}
		} else if (mode == SubUnitEventMode.EVENT) {
			result = this._moveEvent();
		}
		
		return result;
	},
	
	drawCommand: function() {
		var width = this._eventWindow.getWindowWidth();
		var height = this._eventWindow.getWindowHeight();
		var x = LayoutControl.getCenterX(-1, width);
		var y = LayoutControl.getCenterY(-1, height);
		var mode = this.getCycleMode();
		var textui = root.queryScreen("ItemUse").getBottomFrameTextUI();
		
		if (mode == SubUnitEventMode.SELECTION) {
			this._eventWindow.drawWindow(x, y);
			
			if (this._event && typeof this._event.custom.description == "string") {
				TextRenderer.drawScreenBottomText(this._event.custom.description, textui);
			}
		}
		
	},
	
	_prepareCommandMemberData: function() {
		this._eventWindow = createObject(UnitEventWindow);
		this._unit = this.getCommandTarget();
		this._unitEventArray = [];
		this._capsuleEvent = createObject(CapsuleEvent);
	},
	
	_completeCommandMemberData: function() {
		this._unitEventArray = this._getUnitEvents();
		
		this._eventWindow.setUp(this._unit, this._unitEventArray);
		this.changeCycleMode(SubUnitEventMode.SELECTION);
	},
	
	_moveEvent: function() {
		var result = MoveResult.CONTINUE;
		
		if (this._capsuleEvent.moveCapsuleEvent() !== MoveResult.CONTINUE) {
			if (!UnitEventChecker.isCancelFlag()) {
				// Cancel doesn't occur, it means that some operation is done, so end it.
				if (this._event.custom.freeAction || SkillControl.getPossessionCustomSkill(this._unit, "Free-Action")) {
					this.setExitCommand(this);
				} else {
					this.endCommandAction();
				}
			}
			UnitEventChecker.setCancelFlag(false);
			return MoveResult.END;
		}
		
		return result;
	},
	
	_changeEvent: function() {
		var event = this._getEvent();
		var unit = this.getCommandTarget();
		
		this._capsuleEvent.enterCapsuleEvent(event, true);
		this._applyCost(unit, event);
		
		UnitEventChecker.setCancelFlag(false);
		
		this.changeCycleMode(SubUnitEventMode.EVENT);
	},
	
	_applyCost: function(unit, event) {
	},
	
	_getEvent: function() {
		return this._event;
	},
	
	_hasExecutableUnitEvent: function(unit) {
		var i, currentUnitEvent, currentUnitEventInfo;
		
		for (i = 0; i < unit.getUnitEventCount(); i++) {
			currentUnitEvent = unit.getUnitEvent(i);
			if (this._isExecutableUnitEvent(currentUnitEvent)) {
				return true;
			}
		}
		
		return false;
	},
	
	_isExecutableUnitEvent: function(unitEvent) {
		var unitEventInfo = unitEvent.getUnitEventInfo();
		
		return unitEventInfo.getUnitEventType() === UnitEventType.COMMAND && unitEvent.isEvent() && unitEvent.custom.excludeFromSubMenu != true && this._meetsCost(unitEvent);
	},
	
	_meetsCost: function(unitEvent) {
		return true;
	},
	
	_getUnitEvents: function() {
		var groupArray = [];
		
		var unit = this._unit;
		var currentUnitEvent, globalUnit, i;
		
		//Create an array of unit events
		for (i = 0; i < unit.getUnitEventCount(); i++) {
			currentUnitEvent = unit.getUnitEvent(i);
			
			if (this._isExecutableUnitEvent(currentUnitEvent)) {
				groupArray.push(currentUnitEvent);
			}
		}
		
		var globalUnit = this._getGlobalUnit();
		
		if (globalUnit != null) {
			for (i = 0; i < globalUnit.getUnitEventCount(); i++) {
				currentUnitEvent = globalUnit.getUnitEvent(i);
				if (this._isExecutableUnitEvent(currentUnitEvent)) {
					groupArray.push(currentUnitEvent);
				}
			}
		}
		
		return groupArray;
	},
	
	_getGlobalUnit: function() {
		var playerList = root.getBaseData().getPlayerList();
		var i;
		
		for (i = 0; i < playerList.getCount(); i++) {
			currentUnit = playerList.getData(i);
			
			if (currentUnit.custom.global == true) {
				return currentUnit;
			}
		}
		
		return null;
	}
	
});