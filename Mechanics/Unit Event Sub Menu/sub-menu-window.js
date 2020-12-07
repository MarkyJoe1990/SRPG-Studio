//

var UnitEventWindow = defineObject(BaseWindow, {
	_unit: null,
	_unitEventArray: null,
	
	setUp: function(unit, unitEventArray) {
		this._unit = unit;
		this._unitEventArray = unitEventArray;
		
		this._unitEventScrollbar = createObject(UnitEventScrollbar, this);
		this._unitEventScrollbar.setScrollFormation(1,12);
		this._unitEventScrollbar.enableSelectCursor(true);
		this._unitEventScrollbar.setObjectArray(unitEventArray);
	},
	
	moveWindowContent: function() {
		return this._unitEventScrollbar.moveInput();
	},
	
	drawWindowContent: function(x, y) {
		this._unitEventScrollbar.drawScrollbar(x, y);
	},
	
	getWindowWidth: function() {
		return this._unitEventScrollbar.getObjectWidth() + (this.getWindowXPadding());
	},
	
	getWindowHeight: function() {
		var count = this._unitEventScrollbar.getObjectCount();
		var height = this._unitEventScrollbar.getObjectHeight()
		
		return (count * height) + (this.getWindowYPadding() * 2);
	},
	
	getWindowTitleTextUI: function() {
		return root.queryTextUI("infowindow_title");
	},
	
	getWindowTitleText: function() {
		return UNIT_EVENT_SUB_MENU_NAME;
	}
})