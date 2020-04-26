var KeysScrollbar = defineObject(BaseScrollbar, {
	_specialKeys: null,
	
	getSpecialKeys: function() {
		this._specialKeys = root.getMaterialManager().createImage("keys", "keys.png");
	},
	
	drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = root.queryTextUI("extraname_title");
		var color = 0x000000;
		var font = textui.getFont();
		
		if (object == "LWR") {
			this._specialKeys.drawParts(x, y, 0, 0, 30,30);
		} else if (object == "BACK") {
			this._specialKeys.drawParts(x, y, 30, 0, 30,30);
		} else if (object == "DONE") {
			this._specialKeys.drawParts(x, y, 60, 0, 30,30);
		} else {
			this._specialKeys.drawParts(x, y, 90, 0, 30,30);
			TextRenderer.drawText(x + 9, y+2, object, -1, color, font);
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