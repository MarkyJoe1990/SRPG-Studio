/*
	Required parameters.
	var1 - String. Specifies what variable's value to change to the object's ID.
	dataList - DataList or function. Specifies the list of objects the player can select from. If it's a function, it will be run. Return value should be data list.
	dataType - String. Specifies what type of object list is being used.

	Optional parameters.
	var2 - String. Specifies what variable's value to change to the object's selection index.
	selfSwitch - String or Number.

	Implied parameters.
	unit - Grabbed if there is an active unit. Will set them as the focus of this event.
*/

var SelectorEventCommand = defineObject(BaseEventCommand, {
	_args: null,
	_var1: null,
	_var2: null,
	_dataList: null,
	_dataType: null, // Relevant for item conversion
	_selectData: null,
	_selfSwitch: -1,

    enterEventCommandCycle: function() {
		this._args = root.getEventCommandObject().getEventCommandArgument();
		if (this._args == undefined) {
			root.msg("Please define arguments for this selector event.");
			return EnterResult.NOTENTER;
		}

		// Variable 1. Required.
		var var1String = this._args.var1;
		if (var1String == undefined) {
			root.msg("You need to specify the variable you want to use by name for this selector event.");
			return EnterResult.NOTENTER;
		}

		this._var1 = SelectorEventControl.parseVariableString(var1String);
		if (this._var1 == null) {
			root.msg("The variable you wanted to use could not be found. Check the variable name you specified and confirm that it matches the variable you want to use in the database. Remember, it's case sensitive!");
			return EnterResult.NOTENTER;
		}

		// Variable 2. Optional.
		var var2String = this._args.var2;
		if (typeof var2String == "string") {
			this._var2 = SelectorEventControl.parseVariableString(var2String);
			if (this._var2 == null) {
				root.msg("It seems you wanted to use a second variable, but nothing in the database matched its name. Check the variable name you specified and confirm that it matches the variable you want to use in the database. Remember, it's case sensitive!");
				return EnterResult.NOTENTER;
			}
		} else {
			this._var2 = null;
		}

		// Data Type. Required.
		this._dataType = this._args.dataType;
		if (typeof this._dataType != "string") {
			root.msg("The variable you wanted to use could not be found. Check the variable name you specified and confirm that it matches the variable you want to use in the database. Remember, it's case sensitive!");
			return EnterResult.NOTENTER;
		}

		this._selectData = SelectorEventControl.createSelectorData(this._dataType);
		if (this._selectData == null) {
			root.msg("The data type you specified could not be found. Please check that the data type name is correct and that it is included in the Selector Event Control configuration array.");
			return EnterResult.NOTENTER;
		}

		// Data List. Required most of the time, but will sometimes have a default set.
		var dataList = this._args.dataList;
		var dataListType = typeof dataList;
		if (dataListType === "function") {
			this._dataList = dataList();
		} else if (dataListType === "undefined")  {
			this._dataList = this._selectData.getSessionDataList();
		} else {
			this._dataList = dataList;
		}

		if (this._dataList == undefined) {
			root.msg("You need to specify a data list for this event.");
			return EnterResult.NOTENTER;
		}

		this._unit = null;
		var sceneType = root.getBaseScene();
		if (sceneType === SceneType.FREE) {
			var unit = root.getCurrentSession().getActiveEventUnit();
			if (unit != null) {
				this._unit = unit;
			}
		}

		this._maxCount = this._args.maxCount;
		if (this._maxCount == undefined) {
			this._maxCount = this._dataList.getCount();
		}

		var isSetReroll = this._maxCount < this._dataList.getCount();
		this._reroll(isSetReroll);

		this._rerollCallback = this._args.rerollCallback;

		// Self Switch
		var selfSwitch = this._args.selfSwitch;
		var selfSwitchType = typeof selfSwitch;
		if (selfSwitchType == "number") {
			this._selfSwitch = selfSwitch;
		} else if (selfSwitchType == "string") {
			this._selfSwitch = SelectorEventControl.parseSelfSwitchString(selfSwitch);
		} else {
			this._selfSwitch = -1;
		}

		return EnterResult.OK;
	},
	
	// Move selector window
	moveEventCommandCycle: function() {
		var result = this._selectData.moveSelectorData();

		if (InputControl.isOptionAction2() || this._isClickingRerollWindow()) {
			if (Math.ceil(this._dataList.getCount() / this._maxCount) != 0) {
				MediaControl.soundDirect("commandselect");
				this._reroll(true);
			} else {
				MediaControl.soundDirect("operationblock");
			}
		}

		if (result == MoveResult.SELECT) {
			this._setVariable1(this._selectData.getObjectId());
			
			if (this._var2 != null) {
				this._setVariable2(this._selectData.getIndex());
			}

			return MoveResult.END;
		} else if (result == MoveResult.CANCEL) {
			if (this._selfSwitch != -1) {
				UnitEventChecker.setCancelFlag(true);
				root.setSelfSwitch(this._selfSwitch, true);
				MediaControl.soundDirect('commandcancel');
				return MoveResult.CANCEL;
			} else {
				MediaControl.soundDirect('operationblock');
			}
		}

		return MoveResult.CONTINUE;
	},

	_isClickingRerollWindow: function() {
		return this._selectData.isClickingRerollWindow();
	},

	_reroll: function(isSetReroll) {
		var finalList = StructureBuilder.buildDataList();
		var dataListChunk = this._dataList._arr.splice(0, this._maxCount);

		finalList.setDataArray(dataListChunk);
		this._selectData.setData(this._unit, finalList);

		if (isSetReroll === true) {
			this._selectData.setRerollCount(Math.ceil(this._dataList.getCount() / this._maxCount));
			if (this._rerollCallback != undefined) {
				this._rerollCallback.call(this);
			}
		}
	},

	_setVariable1: function(objectId) {
		var meta = root.getMetaSession();
		var variableTable = meta.getVariableTable(this._var1.table);
		variableTable.setVariable(this._var1.index, objectId);
	},

	_setVariable2: function(objectIndex) {
		var meta = root.getMetaSession();
		var variableTable = meta.getVariableTable(this._var2.table);
		variableTable.setVariable(this._var2.index, objectIndex);
	},

	drawEventCommandCycle: function() {
		this._selectData.drawSelectorData();
	},

    isEventCommandSkipAllowed: function() {
		return false;
	},

    getEventCommandName: function() {
		return 'Select';
	}
});