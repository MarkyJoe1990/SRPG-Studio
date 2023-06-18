var CheatCodeScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = root.queryTextUI("default_window");
        var color = object.isEvent ? textui.getColor() : ColorValue.DISABLE;
        var font = textui.getFont();
        var string = object.event.getName();
        var dx = 0;

        var handle = object.event.getIconResourceHandle();

        if (!handle.isNullHandle()) {
            dx += 36;
            GraphicsRenderer.drawImage(x, y + 4, handle, GraphicsType.ICON)
        }

        TextRenderer.drawText(x + dx, y + 5, string, -1, color, font);
	},

    getObjectWidth: function() {
        return 240;
    },

    getObjectHeight: function() {
        return 36;
    }
});