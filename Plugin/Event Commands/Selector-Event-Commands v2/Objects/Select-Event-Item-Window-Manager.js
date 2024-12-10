var SelectorEventItemWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventItemWindow;
    },

    _getInfoWindow: function() {
        return ItemInfoWindow;
    },

    _setInfoObject: function(object) {
        this._infoWindow.setInfoItem(object);
    }
});

var SelectorEventItemWindow = defineObject(BaseSelectEventWindow, {
    _getScrollbarObject: function() {
        return SelectorEventItemScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select Item';
	}
});

var SelectorEventItemScrollbar = defineObject(BaseSelectEventScrollbar, {
    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        ItemRenderer.drawItem(x, y, object, color, font, true);
    }
});