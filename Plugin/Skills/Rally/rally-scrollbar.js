var RallySelectScrollbar = defineObject(BaseScrollbar, {
    drawScrollContent: function(x, y, object, isSelect, index) {
		var icon;
        var rally = object;
		var name = rally.getName();
        var isArray = name == "Rally Player" || name == "Rally Enemy" || name == "Rally All";
		//Render rally's icon and name
		var font = root.queryTextUI("default_window").getFont();
		var color = 0xFFFFFF;
		
		//Draw Rally Player, Rally Enemy, Rally All
		if (isArray) {
			//icon = rally.array.getIconResourceHandle();
			TextRenderer.drawText(x + 10, y + 2, name, -1, color, font);
		} else {
			icon = rally.getIconResourceHandle();
			GraphicsRenderer.drawImage(x+10, y, icon, GraphicsType.ICON);
			TextRenderer.drawText(x + 32+10, y + 2, name, -1, color, font);
		}
    },
	
	getObjectWidth: function() {
		return 200;
	},
	getObjectHeight: function() {
		return 32;
	}
});