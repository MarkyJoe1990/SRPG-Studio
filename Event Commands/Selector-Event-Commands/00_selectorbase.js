var SelectorListType = {
	NONE: 0,
	ITEM: 1,
	SKILL: 2,
	CLASS: 3,
	UNIT: 4,
	STATE: 5,
	ART: 6
}

var BaseSelectorEventCommand = defineObject(BaseEventCommand, {
	_unit: null,
	_convoy: null,
	_windowManager: null,
	_metaSession: null,
	_itemList: null,
	_weaponList: null,
	_combinedList: null,
	_skillList: null,
	_classList: null,
	_stateList: null,
	_unitList: null,
	_artList: null,
	_myVar1: null,
	_myVarTable1: null,
	_myVar2: null,
	_myVarTable2: null,
	_args: null,
	_listSelection: null,
	_chosenObject: null,
	_objectIndex: null,
	_listType: null,
	_selfSwitch: null,
	
	enterEventCommandCycle: function() {
		//How event commands are typically structured
		this._prepareEventCommandMemberData();
		
		//_checkEventCommand always returns true as far as I'm concerned
		//Not sure why this exists
		if (!this._checkEventCommand() || !this._errorHandling()) {
			return EnterResult.NOTENTER;
		}
		
		//After preparation, the next part of the event code begins
		return this._completeEventCommandMemberData();
	},
	
	moveEventCommandCycle: function() {
		var result = this._windowManager.moveWindowManager();
		//getCycleMode and changeCycleMode are only needed for window managers
		//with extra "steps" to selection, such as Goinza's combat arts stuff
		var mode = this.getCycleMode();
		
		if (result == MoveResult.SELECT) {
			this._chosenObject = this.getSelectedItem();
			this._objectIndex = this.getSelectedIndex();
			this._setVariables();
		}
		if (result == MoveResult.CANCEL) {
			if (this._selfSwitch == null) {
				result = MoveResult.CONTINUE;
			}
			else {
				MediaControl.soundDirect('commandcancel');
				this._selfSwitch = selfSwitchInterpret(this._selfSwitch);
				root.setSelfSwitch(this._selfSwitch,true);
				UnitEventChecker.setCancelFlag(true);
			}
		}
		
		return result;
	},
	
	//Used in the specific event commands
	_setVariables: function() {
	},
	_getList: function() {
	},
	
	_prepareEventCommandMemberData: function() {
		this._windowManager = createObject(ItemSelectManager);
		this._metaSession = root.getMetaSession();
		this._args = root.getEventCommandObject().getEventCommandArgument();
		
		this._myVar1 = findVar(this._args.var1);
		this._myVarTable1 = this._myVar1 != null ? this._metaSession.getVariableTable(this._myVar1.table) : null;
		this._myVar2 = findVar(this._args.var2);
		this._myVarTable2 = this._myVar2 != null ? this._metaSession.getVariableTable(this._myVar2.table) : null;
		this._selfSwitch = this._args.selfSwitch != null ? this._args.selfSwitch : null;
		
		if (this._args.weaponList != undefined) {
			this._weaponList = createWeaponList(this._args.weaponList);
			this._combinedList = this._weaponList;
			}
		if (this._args.itemList != undefined) {
			this._itemList = createItemList(this._args.itemList);
			this._combinedList = this._itemList;
		}
		if (this._args.weaponList != undefined && this._args.itemList != undefined) {
			this._combinedList = combineArrays(this._weaponList, this._itemList);
		}
		if (this._args.skillList != undefined) {
			this._skillList = createSkillList(this._args.skillList);
		}
		if (this._args.classList != undefined) {
			this._classList = createClassList(this._args.classList);
		}
		if (this._args.stateList != undefined) {
			this._stateList = createStateList(this._args.stateList);
		}
		if (this._args.unitList != undefined) {
			this._unitList = createUnitList(this._args.unitList);
		}
		if (this._args.artList != undefined && typeof CombatArtControl != 'undefined') {
			this._artList = createArtList(this._args.artList);
		}
		
		this._unit = root.getEventCommandObject().getOriginalContent().getUnit();
		this._convoy = this._metaSession.getStockItemArray();
	},
	
	//Gets the selected item from the Item Selector Window Manager
	getSelectedItem: function() {
		return this._windowManager.getSelectedItem();
	},
	
	getSelectedIndex: function() {
		return this._windowManager.getSelectedIndex();
	},
	
	//Draws whatever shit this event is doing
	drawEventCommandCycle: function() {
		//Draw the Item Selector Window Manager
		this._windowManager.drawWindowManager();
	},
	
	_completeEventCommandMemberData: function() {
		this._windowManager.setList(this._getList(),this._listType);
		this._windowManager.setUp();
		return EnterResult.OK;
	},
	
	//Check if the event command is actually working
	_checkEventCommand: function() {
		return true;
	},
	
	//Specified in the actual event commands themselves
	_errorHandling: function() {
		var isErrorFree = true;
		var reason = null;
		var example = "\nThe property field should look something like this: \n{\n\tvar1:\"NAME OF VARIABLE\"\n}\n\n";
		var cancel = "Event Command Canceled.";
		if (this._myVar1 == null) {
			reason = "Please specify what var1 is in the Execute Script's property field and make sure that it is spelt correctly.\n\n";
		}
		if (reason != null) {
			root.msg(reason + example + cancel);
			isErrorFree = false;
		}
		
		return isErrorFree;
	},
	
	//If you set the return value to false, the player cannot skip this event
	//Important for when you want player input
	isEventCommandSkipAllowed: function() {
		// The event command (such as Choice Show) which doesn't allow skip, return false.
		return false;
	},
	
	//Notice this function has 3 M's. this is to compensate for
	//a spelling error made by the dev team. in eventcommand-scriptexecute.js
	//they both use a misspelt version of this command, and the proper one,
	//Making simply using one or the other not work.
	getEventCommmandName: function() {
		return this.getEventCommandName();
	},
	
	getEventCommandName: function() {
		return '';
	}
});