var SelectorEventParameterWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventParameterWindow;
    }/*,

    _getInfoWindow: function() {
        return ParameterInfoWindow;
    },

    _setInfoObject: function(object) {
        this._infoWindow.setSkillInfoData(object);
    }*/
});

var SelectorEventParameterWindow = defineObject(BaseSelectEventWindow, {
    setData: function(unit, dataList) {
        var count = dataList.getCount();
        this._scrollbar.setScrollFormation(1, count > 12 ? 12 : count);
        this._scrollbar.setDataList(dataList);
        this._scrollbar.enableSelectCursor(true);
    },

    _getScrollbarObject: function() {
        return SelectorEventParameterScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select Parameter';
	}
});

var SelectorEventParameterScrollbar = defineObject(BaseSelectEventScrollbar, {
    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var length = -1;
        var text = object.getParameterName();

        TextRenderer.drawText(x, y, text, length, color, font);
    }
});