(function () {
	//Adds our event object to the list of custom events
	var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
	ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
			alias1.call(this, groupArray);
			groupArray.appendObject(ConvoyItemSelectorEventCommand);
			groupArray.appendObject(UnitItemSelectorEventCommand);
			groupArray.appendObject(ItemListSelectorEventCommand);
			groupArray.appendObject(UnitSkillSelectorEventCommand);
			groupArray.appendObject(SkillListSelectorEventCommand);
			groupArray.appendObject(ClassListSelectorEventCommand);
			groupArray.appendObject(StateListSelectorEventCommand);
			groupArray.appendObject(UnitListSelectorEventCommand);
			
			//Compatibility with Goinza's Combat Art Plugin 2.0
			if (typeof CombatArtControl != 'undefined') {
				groupArray.appendObject(UnitArtSelectorEventCommand);
				groupArray.appendObject(ArtListSelectorEventCommand);
			}
	};
}) ();