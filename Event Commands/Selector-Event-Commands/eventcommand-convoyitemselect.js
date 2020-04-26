var ConvoyItemSelectorEventCommand = defineObject(BaseSelectorEventCommand, {
	_setVariables: function() {
		this._myVarTable1.setVariable(this._myVar1.id,this._chosenObject.getId() + (!this._chosenObject.isWeapon() * 65536));
		if (this._myVar2 != null) {
			this._myVarTable2.setVariable(this._myVar2.id,this._objectIndex);
		}
	},
	
	_getList: function() {
		this._listType = SelectorListType.ITEM;
		return this._convoy;
	},

	//Name of Event Command when used in "Execute Script"
	getEventCommandName: function() {
		return 'Convoy Item Select';
	}
});