var NewGameConfigScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
		var width = this.getObjectWidth();
		var height = this.getObjectHeight();
		var textui = this.getParentTextUI();
		var pic = textui.getUIImage();
		
		WindowRenderer.drawStretchWindow(x, y, width, height, pic);
		
		var xPadding = DefineControl.getWindowXPadding();
		var yPadding = DefineControl.getWindowYPadding();
		
		object.drawConfig(x + xPadding, y + yPadding);
	},
	
	drawCursor: function(x, y, isActive) {
	},
	
	drawDescriptionLine: function() {
	},
	
	getObjectWidth: function() {
		return 520;
	},
	
	getObjectHeight: function() {
		return 50;
	}
});