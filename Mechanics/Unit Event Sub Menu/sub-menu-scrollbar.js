//

var UnitEventScrollbar = defineObject(BaseScrollbar, {
	
	drawScrollContent: function(x, y, object, isSelect, index) {
		var dx = 0;
		var color = 0xFFFFFF;
		var textui = root.queryTextUI("default_window");
		var font = textui.getFont();
		var icon = object.getIconResourceHandle();
		var iconWidth = GraphicsFormat.ICON_WIDTH + 5;
		var cost = 0;
		
		if (!icon.isNullHandle()) {
			GraphicsRenderer.drawImage(x + dx, y, icon, GraphicsType.ICON);
			dx = iconWidth;
		}
		
		TextRenderer.drawText(x + dx, y+2, object.getName(), -1, color, font);
		
		if (typeof object.custom.cost == "number") {
			cost = object.custom.cost;
			NumberRenderer.drawNumber(x + this.getObjectWidth() - iconWidth, y, cost);
		}
		
	},
	
	getObjectWidth: function() {
		return 200;
	},
	
	getObjectHeight: function() {
		return 32;
	}
});