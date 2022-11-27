var ConfirmScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = root.queryTextUI("default_window");
		var color = textui.getColor();
		var font = textui.getFont();
		
		TextRenderer.drawText(x + 12, y, object, -1, color, font);
	},
	
	getObjectWidth: function() {
		return 50;
	},
	
	getObjectHeight: function() {
		return 24;
	},
	
	getSpaceX: function() {
		return 30;
	}
	
});