var NameEntryPreview = defineObject(BaseWindow, {
	_currentString: null,
	
	setUp: function(string) {
		this._currentString = string;
	},
	
	drawWindowContent: function(x, y) {
		var textui = root.queryTextUI("extraname_title");
		var color = textui.getColor();
		var font = textui.getFont();
		//Get value from window manager
		TextRenderer.drawText(x, y, this._currentString, -1, color, font);
	},
	
	setCurrentString: function(string) {
		this._currentString = string;
	},
	
	getWindowHeight: function() {
		return 50;
	},
	
	getWindowWidth: function() {
		return 300;
	}
});