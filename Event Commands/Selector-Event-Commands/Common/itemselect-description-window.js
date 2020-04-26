var ItemSelectorDescriptionWindow = defineObject(BaseWindow, {
	_object: null,
	
	setObject: function(object) {
		this._object = object;
		this._description = this._object.getDescription();
	},
	
	drawWindowContent: function(x, y) {
		textui = this.getWindowTextUI();
		font = textui.getFont()
		color = textui.getColor();
		text = this._object.getDescription();
		
		width = this.getWindowWidth() - (this.getWindowXPadding()*2);
		height = TextRenderer.getTextHeight("E", font)*2;
		
		var range = createRangeObject(x, y, width, height);
		TextRenderer.drawRangeText(range, TextFormat.CENTER, text, -1, color, font);
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI('default_window');
	},
	
	getWindowWidth: function() {
		return 540;
	},
	
	getWindowHeight: function() {
		textui = this.getWindowTextUI();
		text = this._object.getDescription();
		font = textui.getFont();
		textHeight = TextRenderer.getTextHeight("E", font);
		
		return (textHeight*2) + (this.getWindowYPadding() * 2)//TextRenderer.getTextHeight(this._description);
	}
});