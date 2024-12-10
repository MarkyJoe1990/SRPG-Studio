var SelectorEventSkillWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventSkillWindow;
    },

    _getInfoWindow: function() {
        return SkillInfoWindow;
    },

    _setInfoObject: function(object) {
        this._infoWindow.setSkillInfoData(object);
    }
});

var SelectorEventSkillWindow = defineObject(BaseSelectEventWindow, {
    _getScrollbarObject: function() {
        return SelectorEventSkillScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select Skill';
	}
});

var SelectorEventSkillScrollbar = defineObject(BaseSelectEventScrollbar, {
});