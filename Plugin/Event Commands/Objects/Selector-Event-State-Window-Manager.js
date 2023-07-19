var SelectorEventStateWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventStateWindow;
    }
});

var SelectorEventStateWindow = defineObject(BaseSelectEventWindow, {
    _getScrollbarObject: function() {
        return SelectorEventStateScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select State';
	}
});

var SelectorEventStateScrollbar = defineObject(BaseSelectEventScrollbar, {
});