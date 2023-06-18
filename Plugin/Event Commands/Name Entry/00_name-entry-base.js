var NameEntryEventCommand = defineObject(BaseEventCommand,{
	_windowManager: null,
	_title: null,
	_keys: null,
	_selfSwitch: null,
	_lengthLimit: null,
	_unit: null,
	
	enterEventCommandCycle: function() {
		this._prepareEventCommandMemberData();
		
		if (!this._checkEventCommand() || !this._errorHandling()) {
			return EnterResult.NOTENTER;
		}
		
		return this._completeEventCommandMemberData();
	},
	
	_prepareEventCommandMemberData: function() {
		//Create Objects
		this._windowManager = createObject(NameEntryWindowManager);
		
		//Set variables
		var args = root.getEventCommandObject().getEventCommandArgument();
		
		this._title = args.title == undefined ? this.getEventCommandName() : args.title; //Optional. Defaults to "Name Entry"
		this._keys = args.keys == undefined ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ " : args.keys; //Optional. Defaults to the ABCDEF... formation
		//Last three buttons are always back space, lowercase and finish
		this._selfSwitch = args.selfSwitch == undefined ? null : args.selfSwitch; //Optional. If this isn't set, you can't cancel out of the entry.
		this._lengthLimit = args.lengthLimit == undefined ? 20 : args.lengthLimit; //Optional. Defaults to 20
		this._unit = root.getEventCommandObject().getOriginalContent().getUnit();

		var playerList = root.getBaseData().getPlayerList();

		if (this._unit == null) {
			var id = args.id == undefined ? -1 : args.id;

			this._unit = playerList.getDataFromId(id);
			this._dataBaseUnit = this._unit;
		} else {
			this._dataBaseUnit = playerList.getDataFromId(this._unit.getBaseId());
		}

		this._defaultName = args.defaultName == undefined ? this._unit.getName() : args.defaultName;
	},
	
	_completeEventCommandMemberData: function() {
		this._selfSwitch = selfSwitchInterpret(this._selfSwitch);
		this._windowManager.setUp(this._title, this._keys, this._selfSwitch, this._lengthLimit, this._unit, this._defaultName);
		
		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
		result = this._windowManager.moveWindowManager();

		if (result == MoveResult.END) {
			this.mainEventCommand();
		}

		return result;
	},

	mainEventCommand: function() {
		this._unit.setName(this._windowManager.getNameEntry());
		this._dataBaseUnit.setName(this._windowManager.getNameEntry());
	},
	
	drawEventCommandCycle: function() {
		this._windowManager.drawWindowManager();
	},
	
	_errorHandling: function() {
		var type = "Name Entry Event Error:"
		var reason = null;
		
		if (typeof this._title != "string") {
			reason = "Make sure your title parameter is a string";
		}
		if (typeof this._keys != "string") {
			reason = "Make sure your keys parameter is a string";
		}
		if (typeof this._selfSwitch != "string" && typeof this._selfSwitch != "number" && this._selfSwitch != null) {
			reason = "Make sure your selfSwitch parameter is either a string or a number";
		}
		if (typeof this._lengthLimit != "number") {
			reason = "Make sure your lengthLimit parameter is a number";
		}
		
		if (reason != null) {
			root.msg(type + "\n\n" + reason);
			return false;
		}
		
		return true;
	},
	
	_checkEventCommand: function() {
		return true;
	},
	
	isEventCommandSkipAllowed: function() {
		// The event command (such as Choice Show) which doesn't allow skip, return false.
		return false;
	},
	
	getEventCommandName: function() {
		return 'Name Entry';
	}
});