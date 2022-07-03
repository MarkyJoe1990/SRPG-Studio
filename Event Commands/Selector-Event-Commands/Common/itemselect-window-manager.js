var ItemSelectManager = defineObject(BaseWindowManager,
{
	//Our unit we selected in the event
	_unit: null,
	//Item List
	_itemList: null,
	//The item selection window
	_itemWindow: null,
	_descWindow: null,
	_listType: null,
	_itemInfoWindow: null,
	
	//Don't use
	initialize: function() {
	},
	
	setUp: function() {
		//Creates the Item Selection Window. See itemselect-window.js
		this._itemWindow = createObject(ItemSelectorWindow);
		this._descWindow = createObject(ItemSelectorDescriptionWindow);
		
		//Sets the window information
		if (this._unit != null) {
			this._itemWindow.setUnit(this._unit);
		}
		if (this._itemList != null) {
			this._itemWindow.setItemList(this._itemList, this._listType);
		}
		this._itemWindow.setUp();
		this._descWindow.setObject(this._itemWindow.getSelectedItem());
		
		if (this._listType == SelectorListType.ITEM) {
			this._itemInfoWindow = createObject(ItemInfoWindow, this);
			this._itemInfoWindow.setInfoItem(this._itemWindow.getSelectedItem());
		} else if (this._listType == SelectorListType.ART) {
			this._itemInfoWindow = createObject(CombatArtSupport);
			this._itemInfoWindow.setCombatArt(this._itemWindow.getSelectedItem());
		} else if (this._listType == SelectorListType.SKILL) {
			this._itemInfoWindow = createObject(SkillInfoWindow);
			this._itemInfoWindow.setSkillInfoData(this._itemWindow.getSelectedItem(), this._itemWindow.getSelectedItem().getSkillType());
		}
		
	},
	
	//Sets our unit to be the focus of the item selection window
	//So we can see their inventory and select an item
	setUnit: function(unit) {
		this._unit = unit;
	},
	
	setList: function(itemList, listType) {
		this._itemList = itemList;
		this._listType = listType;
	},
	
	//Gets the item we selected from the Item Selection Window Object
	getSelectedItem: function() {
		return this._itemWindow.getSelectedItem();
	},
	
	getSelectedIndex: function() {
		return this._itemWindow.getSelectedIndex();
	},
	
	//Runs every frame. Ends when an item is selected
	moveWindowManager: function() {
		var result = this._itemWindow.moveWindow();
		
		this._descWindow.setObject(this._itemWindow.getSelectedItem());
		if (this._listType == SelectorListType.ITEM) {
			this._itemInfoWindow.setInfoItem(this._itemWindow.getSelectedItem());
		} else if (this._listType == SelectorListType.ART) {
			this._itemInfoWindow.setCombatArt(this._itemWindow.getSelectedItem());
		} else if (this._listType == SelectorListType.SKILL) {
			this._itemInfoWindow.setSkillInfoData(this._itemWindow.getSelectedItem(), this._itemWindow.getSelectedItem().getSkillType());
		}
		return result;
	},
	
	//Draws the contents of our window manager
	//such as the window itself
	drawWindowManager: function() {
        var x = this.getPositionWindowX();
        var y = this.getPositionWindowY();
		var dx = this._itemInfoWindow != null ? 100 : 0;
		
        this._itemWindow.drawWindow(x - dx, y);
		var difference = Math.abs(this._itemWindow.getWindowWidth() - this._descWindow.getWindowWidth());
        this._descWindow.drawWindow(x - (difference / 2), y + this._itemWindow.getWindowHeight());
		
		if (this._itemInfoWindow != null) {
			this._itemInfoWindow.drawWindow(x - 100 + this._itemWindow.getWindowWidth(), y + this._itemWindow.getWindowHeight() - (this._itemInfoWindow.getWindowHeight()));
		}
	},
	
	getTotalWindowWidth: function() {
		return this._itemWindow.getWindowWidth();
	},
	
	getTotalWindowHeight: function() {
		return this._itemWindow.getWindowHeight();
	},
	
	getPositionWindowX: function() {
		var width = this.getTotalWindowWidth();
		var result = null;
		if (this._unit != null) {
			result = LayoutControl.getUnitBaseX(this._unit, width);
		} else {
			result = LayoutControl.getCenterX(-1,this.getTotalWindowWidth());
		}
		return result;
	},
	
	getPositionWindowY: function() {
		return LayoutControl.getCenterY(-1, this.getTotalWindowHeight());
	}
}
);