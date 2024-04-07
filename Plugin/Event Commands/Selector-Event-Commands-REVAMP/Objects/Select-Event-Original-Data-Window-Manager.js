var SelectorEventOriginalDataWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventOriginalDataWindow;
    }
});

var SelectorEventOriginalDataWindow = defineObject(BaseSelectEventWindow, {
    _getScrollbarObject: function() {
        return SelectorEventOriginalDataScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select Original Data';
	}
});

var SelectorEventOriginalDataScrollbar = defineObject(BaseSelectEventScrollbar, {
});