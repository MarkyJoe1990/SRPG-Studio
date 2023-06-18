var CheatCodeWindow = defineObject(BaseWindow, {

    initialize: function() {
        this._scrollbar = createScrollbarObject(CheatCodeScrollbar, this);
        this._scrollbar.setScrollFormation(1, 6);
		this._scrollbar.setObjectArray(this._getCheatArray());
        this._scrollbar.enableSelectCursor(true);
    },

    moveWindowContent: function() {
        var input = this._scrollbar.moveInput();

        if (input == ScrollbarInput.CANCEL) {
            return MoveResult.CANCEL;
        }

        if (input == ScrollbarInput.SELECT) {
            return MoveResult.SELECT;
        }

        return MoveResult.CONTINUE;
    },

    drawWindowContent: function(x, y) {
        this._scrollbar.drawScrollbar(x, y);
    },

    getObject: function() {
        return this._scrollbar.getObject();
    },

    getWindowWidth: function() {
		return this._scrollbar.getObjectWidth() + (this.getWindowXPadding() * 2);
	},
	
	getWindowHeight: function() {
        var count = this._scrollbar.getObjectCount();

        if (count > 6) {
            count = 6;
        }

        var totalObjectHeight = this._scrollbar.getObjectHeight() * count;

		return totalObjectHeight + (this.getWindowYPadding() * 2);
	},

	getWindowTitleTextUI: function() {
		return root.queryTextUI("infowindow_title");
	},

    getWindowTitleText: function() {
		return 'Cheat Event';
	},

	drawWindowTitle: function(x, y, width, height) {
		var color, font, pic, titleWidth, dx;
		var titleCount = 6;
		var textui = this.getWindowTitleTextUI();
		var text = this.getWindowTitleText();
		
		if (textui === null || text === '') {
			return;
		}
		
		color = textui.getColor();
		font = textui.getFont();
		pic = textui.getUIImage();
		titleWidth = TitleRenderer.getTitlePartsWidth() * (titleCount + 2);
		dx = Math.floor((width - titleWidth) / 2);
		TextRenderer.drawFixedTitleText(x + dx, y - 40, text, color, font, TextFormat.CENTER, pic, titleCount);
	},

    _getCheatArray: function() {
        var currentEvent, bookmarkEventList = root.getBaseData().getBookmarkEventList();
        var arr = [];

        var i, count = bookmarkEventList.getCount();
        for (i = 0; i < count; i++) {
            currentEvent = bookmarkEventList.getData(i);
            if (currentEvent.custom.isCheatEvent === true) {

                var eventObject = {
                    event: currentEvent,
                    isEvent: currentEvent.isEvent()
                }

                arr.push(eventObject);
            }
        }

        return arr;
    }
});