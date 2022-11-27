var UnitArtSelectorEventCommand = defineObject(BaseSelectorEventCommand, {
	_setVariables: function() {
		root.log("Fuck");
		this._myVarTable1.setVariable(this._myVar1.id,this._chosenObject.getId());
		if (this._myVar2 != null) {
			this._myVarTable2.setVariable(this._myVar2.id,this._objectIndex);
		}
	},
	
	_getList: function() {
		this._listType = SelectorListType.ART;
		return CombatArtControl.getCombatArtsArray(this._unit);
	},
	
	//Name of Event Command when used in "Execute Script"
	getEventCommandName: function() {
		return 'Unit Art Select';
	}
});