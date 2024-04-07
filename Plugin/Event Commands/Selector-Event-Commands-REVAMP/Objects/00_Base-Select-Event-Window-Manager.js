var BaseSelectEventWindowManager = defineObject(BaseWindowManager, {
    initialize: function() {
        this._rerollCount = -1;
        this._window = createWindowObject(this._getMainWindow(), this);
        this._infoWindow = createWindowObject(this._getInfoWindow(), this);
        this._rerollWindow = createWindowObject(SelectEventRerollWindow, this);
        this._rerollWindow.enableWindow(false);
    },

    setData: function(unit, dataList) {
        this._unit = unit;
        this._dataList = dataList;

        this._window.setData(unit, dataList);
        this._rerollWindow.setWindowWidth(this._window.getWindowWidth());
    },

    setRerollCount: function(rerollCount) {
        this._rerollCount = rerollCount;
        this._rerollWindow.setRerollCount(rerollCount);
        
        if (rerollCount != -1) {
            this._rerollWindow.enableWindow(true);
        }
    },

    isClickingRerollWindow: function() {
        var x = this.getPositionWindowX()
        var y = this.getPositionWindowY() + this._window.getWindowHeight() + this._getWindowInterval();

        var range = createRangeObject(x, y, this._rerollWindow.getWindowWidth(), this._rerollWindow.getWindowHeight());

        return MouseControl.isRangePressed(range);
    },

    getRerollCount: function() {
        return this._rerollCount;
    },

    _getMainWindow: function() {
        return null
    },

    _getInfoWindow: function() {
        return null;
    },

    getObject: function() {
        return this._window.getObject();
    },

    getIndex: function() {
        return this._window.getIndex();
    },

    moveWindowManager: function() {
        var result = this._window.moveWindow();

        if (this._window.isIndexChanged()) {
            this._setInfoObject(this._window.getObject());
        }

        this._infoWindow != null && this._infoWindow.moveWindow();

        return result;
    },

    _setInfoObject: function(object) {
    },

    drawWindowManager: function() {
        var x = this.getPositionWindowX();
        var y = this.getPositionWindowY();

        this._window.drawWindow(x, y);
        y += this._window.getWindowHeight() + this._getWindowInterval();

        if (this._rerollWindow._isWindowEnabled === true) {
            this._rerollWindow.drawWindow(x, y);
            y += this._rerollWindow.getWindowHeight() + this._getWindowInterval();
        }

        this._infoWindow != null && this._infoWindow.drawWindow(x, y);

        this._drawDescription();
    },

    _getWindowInterval: function() {
		return 10;
	},

    _drawDescription: function() {
        var screen = root.queryScreen("UnitMenu");
        if (screen != null) {
            var textui = screen.getBottomFrameTextUI();
            if (textui != null) {
                var desc = "";
                var object = this._window.getObject();
                if (typeof object.getDescription != "undefined") { // Just in case the object is one without descriptions such as a Parameter
                    desc = object.getDescription();
                }
                desc != "" && TextRenderer.drawScreenBottomText(desc, textui);
            }
        }
    },

    getPositionWindowX: function() {
		var width = this.getTotalWindowWidth();

        if (this._unit == null) {
            return LayoutControl.getCenterX(-1, width);
        }

		return LayoutControl.getUnitBaseX(this._unit, width);
	},
	
	getPositionWindowY: function() {
        var y = LayoutControl.getCenterY(-1, 340);

        if (this._rerollWindow._isWindowEnabled === true) {
            y -= this._rerollWindow.getWindowHeight() + this._getWindowInterval()
        }

		return y;
	},

    getTotalWindowWidth: function() {
        return this._window.getWindowWidth();
    },

    getTotalWindowHeight: function() {
        var height = this._window.getWindowHeight();

        if (this._rerollWindow._isWindowEnabled === true) {
            height += this._rerollWindow.getWindowHeight() + this._getWindowInterval()
        }

        return height;
    }
});

var BaseSelectEventWindow = defineObject(BaseWindow, {
    initialize: function() {
        this._scrollbar = createScrollbarObject(this._getScrollbarObject(), this);
    },

    setData: function(unit, dataList) {
        var count = dataList.getCount();
        this._scrollbar.setScrollFormation(1, count > 5 ? 5 : count);
        this._scrollbar.setDataList(dataList);
        this._scrollbar.enableSelectCursor(true);
    },

    _getScrollbarObject: function() {
        return null;
    },

    moveWindowContent: function() {
        var input = this._scrollbar.moveInput()

        if (input === ScrollbarInput.SELECT) {
            return MoveResult.SELECT;
        }

        if (input === ScrollbarInput.CANCEL) {
            return MoveResult.CANCEL;
        }

        return MoveResult.CONTINUE;
    },

    isIndexChanged: function() {
        return this._scrollbar.checkAndUpdateIndex();
    },

    getObject: function() {
        return this._scrollbar.getObject();
    },

    getIndex: function() {
        return this._scrollbar.getIndex();
    },

    drawWindowContent: function(x, y) {
        this._scrollbar.drawScrollbar(x, y);
    },

    drawWindowTitle: function(x, y, width, height) {
		var color, font, pic, titleWidth, dx;
		var titleCount = 5;
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

    getWindowTitleTextUI: function() {
		return root.queryTextUI("infowindow_title");
	},

    getWindowTitleText: function() {
		return '';
	},

    getWindowWidth: function() {
        return this._scrollbar.getScrollbarWidth() + (this.getWindowXPadding() * 2);
    },

    getWindowHeight: function() {
        return this._scrollbar.getScrollbarHeight() + (this.getWindowYPadding() * 2);
    }
});

var SelectEventRerollWindow = defineObject(BaseWindow, {
    _width: 0,
    _rerollCount: -1,

    setWindowWidth: function(width) {
        this._width = width;
    },
    
    setRerollCount: function(rerollCount) {
        this._rerollCount = rerollCount;
    },

    getRerollCount: function() {
        return this._rerollCount;
    },

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var dx = x;

        var rerollText = "Rerolls Left for this run: ";
        TextRenderer.drawText(dx, y, rerollText, -1, ColorValue.KEYWORD, font);
        dx += TextRenderer.getTextWidth(rerollText, font) + this._getIntervalX();

        NumberRenderer.drawRightNumber(dx, y - 2, this.getRerollCount());
        y += 25;
        dx = x;

        TextRenderer.drawText(dx, y, "Press Option2 or click here", -1, color, font);
    },

    _getIntervalX: function() {
        return 10;
    },

    getWindowWidth: function() {
        return this._width;
    },

    getWindowHeight: function() {
        return this._isWindowEnabled === true ? 50 + (this.getWindowYPadding() * 2) : 0;
    },

    getInnerWidth: function() {
        return this.getWindowWidth() - (this.getWindowXPadding() * 2);
    },

    getInnerHeight: function() {
        return this.getWindowHeight() - (this.getWindowYPadding() * 2);
    }
});

var BaseSelectEventScrollbar = defineObject(BaseScrollbar, {
    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var handle = object.getIconResourceHandle();

        if (handle.isNullHandle() === false) {
            GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
            x += GraphicsFormat.ICON_WIDTH + this._getIntervalX();
        }

        TextRenderer.drawText(x, y, object.getName(), -1, color, font);
	},

    _getIntervalX: function() {
        return 10;
    },

	getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
	},

    playCancelSound: function() {
	}
});