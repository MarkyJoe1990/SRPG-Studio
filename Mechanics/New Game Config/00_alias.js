( function () {
	var alias1 = TitleCommand.NewGame._pushFlowEntries;
	TitleCommand.NewGame._pushFlowEntries = function(straightFlow) {
		alias1.call(this, straightFlow); //Difficulty setting must come first, since it initializes the meta session.
		//straightFlow.pushFlowEntry(NameEntryFlowEntry); // To be added at a later date
		straightFlow.pushFlowEntry(NewGameConfigFlowEntry);
	}
}) ();