var UnitSkillSelectorEventCommand = defineObject(BaseSelectorEventCommand, {
	_setVariables: function() {
		this._myVarTable1.setVariable(this._myVar1.id,this._chosenObject.getId());
		if (this._myVar2 != null) {
			this._myVarTable2.setVariable(this._myVar2.id,this._objectIndex);
		}
	},
	
	_getList: function() {
		this._listType = SelectorListType.SKILL;
		return getUnitSkillList(this._unit);
	},
	
	//Name of Event Command when used in "Execute Script"
	getEventCommandName: function() {
		return 'Unit Skill Select';
	}
});