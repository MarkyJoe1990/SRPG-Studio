var NewGameConfigOptionScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
		var text = object
		var textui = root.queryTextUI("default_window");
		var color = this._getTextColor(index, isSelect);
		var font = textui.getFont();
		
		TextRenderer.drawText(x, y, text, -1, color, font)
	},
	
	getObjectWidth: function() {
		return 80;
	},
	
	getScrollbarWidth: function() {
		return (this._col * this._objectWidth) + ((this._col - 1) * this.getSpaceX()) + 40;
	},
	
	getSpaceX: function() {
		return 20;
	},
	
	getSpaceY: function() {
		return 20;
	},
	
	drawDescriptionLine: function(x, y) {
	},
	
	getObjectHeight: function() {
		return 20;
	},
	
	_getTextColor: function(index, isSelect) {
		if (this.getParentInstance().getConfigValue() == index) {
			return ColorValue.KEYWORD;
		}
		
		return ColorValue.DISABLE;
	}
})