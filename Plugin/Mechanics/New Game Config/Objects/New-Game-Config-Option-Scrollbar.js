var NewGameConfigOptionScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
		var value = object
		var textui = root.queryTextUI("default_window");
		var isChoice = this._isChoice(index);
		var colorIndex = 0;
		var color, alpha;
		var valueType = typeof value;
		
		if (isChoice) {
			color = ColorValue.DEFAULT;
			alpha = 256;
		} else {
			color = ColorValue.DISABLE;
			alpha = 128;
		}
		
		var font = textui.getFont();
		
		if (valueType == "string") {
			TextRenderer.drawText(x, y, value, -1, color, font);
		} else if (valueType == "number") {
			NumberRenderer.drawRightNumberColor(x, y - 3, value, colorIndex, alpha);
		} else if (valueType == "function") {

		} else {
			TextRenderer.drawText(x, y, value.name, -1, color, font);
		}
		
	},
	
	getObjectWidth: function() {
		return 80;
	},
	
	getScrollbarWidth: function() {
		return BaseScrollbar.getScrollbarWidth.call(this) + 10;
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

	playCancelSound: function() {
	},

	playStartSound: function() {
		MediaControl.soundDirect('commandselect');
	},
	
	_isChoice: function(index) {
		if (this.getParentInstance().getConfigIndex() == index) {
			return true;
		}
		
		return false;
	}
})