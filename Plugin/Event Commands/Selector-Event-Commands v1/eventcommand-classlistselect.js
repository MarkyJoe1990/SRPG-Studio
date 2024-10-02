var ClassListSelectorEventCommand = defineObject(BaseSelectorEventCommand, {
	_setVariables: function() {
		this._myVarTable1.setVariable(this._myVar1.id,this._chosenObject.getId());
	},
	
	//Check if var1, weaponlist and item list are set
	_errorHandling: function() {
		var isErrorFree = true;
		var reason = "";
		var example = "\nThe property field should look something like this: \n{\n\tvar1:\"NAME OF VARIABLE\",\n\tclassList:[0,1,2,3]\n}\n\n";
		var cancel = "Event Command Canceled.";
		
		
		if (this._myVar1 == null) {
			reason += "Please specify what var1 is in the Execute Script's property field and make sure that it is spelt correctly.\n";
		}
		
		if (this._classList == null) {
			reason += "Please specify what classList is in the Execute Script's property field and make sure that it is formatted correctly.\n";
		}
		
		if (reason != "") {
			root.msg(reason + example + cancel);
			isErrorFree = false;
		}
		
		return isErrorFree;
	},
	
	_getList: function() {
		this._listType = SelectorListType.CLASS;
		return this._classList;
	},

	//Name of Event Command when used in "Execute Script"
	getEventCommandName: function() {
		return 'Class List Select';
	}
});