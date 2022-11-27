var KeysScrollbar = defineObject(BaseScrollbar, {
	_specialKeys: null,
	
	getSpecialKeys: function() {
		this._specialKeys = root.getMaterialManager().createImage("keys", "keys.png");
	},
	
	drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = root.queryTextUI("extraname_title");
		var color = KEYS_COLOR;
		var graphicsIndex = KEY_GRAPHICS_INDEX * 30;
		var font = textui.getFont();
		var range = {
			x: x,
			y: y-2,
			width: 30,
			height:30
			}
		
		if (object == "LWR") {
			this._specialKeys.drawParts(x, y, 0, graphicsIndex, 30,30);
		} else if (object == "BACK") {
			this._specialKeys.drawParts(x, y, 30, graphicsIndex, 30,30);
		} else if (object == "DONE") {
			this._specialKeys.drawParts(x, y, 60, graphicsIndex, 30,30);
		} else {
			this._specialKeys.drawParts(x, y, 90, graphicsIndex, 30,30);
			TextRenderer.drawRangeText(range, TextFormat.CENTER, object, -1, color, font);
		}
		
	},
	
	getObjectWidth: function() {
		return 30;
	},
	
	getObjectHeight: function() {
		return 30;
	},
	
	playCancelSound: function() {
	}
	
});