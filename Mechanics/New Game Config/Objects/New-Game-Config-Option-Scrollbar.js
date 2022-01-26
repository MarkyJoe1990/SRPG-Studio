var NewGameConfigOptionScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
		var text = object
		var textui = root.queryTextUI("default_window");
		var isChoice = this._isChoice(index);
		var colorIndex = 0;
		var color, alpha;
		
		if (isChoice) {
			color = ColorValue.DEFAULT;
			alpha = 256;
		} else {
			color = ColorValue.DISABLE;
			alpha = 128;
		}
		
		var font = textui.getFont();
		
		if (typeof text == "string") {
			TextRenderer.drawText(x, y, text, -1, color, font);
		} else if (typeof text == "number") {
			NumberRenderer.drawRightNumberColor(x, y - 3, text, colorIndex, alpha);
		}
		
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
	
	_isChoice: function(index) {
		if (this.getParentInstance().getConfigIndex() == index) {
			return true;
		}
		
		return false;
	}
})