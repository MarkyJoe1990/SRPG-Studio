(function () {
	//Adds our event object to the list of custom events
	var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
	ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
			alias1.call(this, groupArray);
			groupArray.appendObject(NameEntryEventCommand);
	};
}) ();