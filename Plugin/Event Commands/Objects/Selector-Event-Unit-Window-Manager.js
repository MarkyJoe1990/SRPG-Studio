var SelectorEventUnitWindowManager = defineObject(BaseWindowManager, {
    initialize: function() {
        this._rerollCount = -1;
        this._window = createWindowObject(SelectorEventUnitWindow, this);
        this._unitMenuTopWindow = createWindowObject(UnitMenuTopWindow, this);
        this._unitMenuBottomWindow = createWindowObject(UnitMenuBottomWindow, this);

        this._rerollWindow = createWindowObject(SelectEventRerollWindow, this);
        this._rerollWindow.enableWindow(false);
    },
    
    setData: function(unit, dataList) {
        this._unit = unit;
        this._dataList = dataList;
        
        this._window.setData(unit, dataList);
        this._rerollWindow.setWindowWidth(this._window.getWindowWidth());

        this._unitMenuTopWindow.setUnitMenuData();
		this._unitMenuBottomWindow.setUnitMenuData();

        this._unitMenuTopWindow.changeUnitMenuTarget(dataList.getData(0));
		this._unitMenuBottomWindow.changeUnitMenuTarget(dataList.getData(0));
        this.changeCycleMode(0);
    },

    isClickingRerollWindow: function() {
        var x = this.getPositionWindowX()
        var y = this.getPositionWindowY() + this._window.getWindowHeight() + this._getWindowInterval();

        var range = createRangeObject(x, y, this._rerollWindow.getWindowWidth(), this._rerollWindow.getWindowHeight());

        return MouseControl.isRangePressed(range);
    },

    _getWindowInterval: function() {
        return 10;
    },

    setRerollCount: function(rerollCount) {
        this._rerollCount = rerollCount;
        this._rerollWindow.setRerollCount(rerollCount);
        
        if (rerollCount != -1) {
            this._rerollWindow.enableWindow(true);
        }
    },

    moveWindowManager: function() {
        var mode = this.getCycleMode();
        var result = MoveResult.CONTINUE;

		this._unitMenuTopWindow.moveWindow();
		this._unitMenuBottomWindow.moveWindow();

        if (mode === 0) {
            result = this._window.moveWindow();

            if (this._window.isIndexChanged() === true) {
                var unit = this._window.getObject();
                this._unitMenuTopWindow.changeUnitMenuTarget(unit);
                this._unitMenuBottomWindow.changeUnitMenuTarget(unit);
            }

            var input = this._window.getRecentlyInputType();
            if (input === InputType.LEFT || input === InputType.RIGHT) {
                this._setHelpMode();
            }

            return result;
        } else if (mode === 1) {
            if (!this._unitMenuBottomWindow.isHelpMode()) {
                this._window.enableSelectCursor(true);
                this.changeCycleMode(UnitSortieMode.TOP);
            }
            
            return MoveResult.CONTINUE;
        }

        return result;
    },

    getObject: function() {
        return this._window.getObject();
    },

    getIndex: function() {
        return this._window.getIndex();
    },

    _setHelpMode: function() {
        if (this._unitMenuBottomWindow.setHelpMode()) {
			this._window.enableSelectCursor(false);
			this.changeCycleMode(1);
		}
    },

    drawWindowManager: function() {
		var x = this.getPositionWindowX();
		var y = this.getPositionWindowY();

        var dy = y;

        this._window.drawWindow(x, dy);
        dy += this._window.getWindowHeight() + this._getWindowInterval();
        if (this._rerollWindow._isWindowEnabled === true) {
            this._rerollWindow.drawWindow(x, dy);
        }

        x += this._window.getWindowWidth();
        dy = y;

        this._unitMenuTopWindow.drawWindow(x, dy);
        dy += this._unitMenuTopWindow.getWindowHeight();

        this._unitMenuBottomWindow.drawWindow(x, dy);

        this._drawDescription();
    },

    _drawDescription: function() {
        var screen = root.queryScreen("UnitMenu");
        if (screen != null) {
            var textui = screen.getBottomFrameTextUI();
            if (textui != null) {
                var text = "";

                if (this._unitMenuTopWindow.isTracingHelp()) {
                    text = this._unitMenuTopWindow.getHelpText();
                } else if (this._unitMenuBottomWindow.isHelpMode() || this._unitMenuBottomWindow.isTracingHelp()) {
                    text = this._unitMenuBottomWindow.getHelpText();
                } else {
                    text = this._window.getObject().getDescription();
                }

                TextRenderer.drawScreenBottomText(text, textui);
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
        var rightWindowWidth = 0;

        if (this._unitMenuTopWindow.getWindowWidth() > this._unitMenuBottomWindow.getWindowWidth()) {
            rightWindowWidth += this._unitMenuTopWindow.getWindowWidth();
        } else {
            rightWindowWidth += this._unitMenuBottomWindow.getWindowWidth();
        }

        return this._window.getWindowWidth() + rightWindowWidth;
    },

    getTotalWindowHeight: function() {
        var height = this._window.getWindowHeight();

        if (this._rerollWindow._isWindowEnabled === true) {
            height += this._rerollWindow.getWindowHeight() + this._getWindowInterval()
        }

        return height;
    }
});

var SelectorEventUnitWindow = defineObject(BaseWindow, {
    setData: function(unit, dataList) {
        this._scrollbar = createScrollbarObject(SelectorEventUnitScrollbar, this);
        var count = dataList.getCount();
        this._scrollbar.setScrollFormation(1, count > 3 ? 3 : count);
        this._scrollbar.setDataList(dataList);
        this._scrollbar.enableSelectCursor(true);
    },

    enableSelectCursor: function(isActive) {
        this._scrollbar.enableSelectCursor(isActive);
    },

    getRecentlyInputType: function() {
        return this._scrollbar.getRecentlyInputType();
    },

    isIndexChanged: function() {
        return this._scrollbar.checkAndUpdateIndex();
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

    getObject: function() {
        return this._scrollbar.getObject();
    },

    getIndex: function() {
        return this._scrollbar.getIndex();
    },

    drawWindowContent: function(x, y) {
        this._scrollbar.drawScrollbar(x, y);
    },

	getWindowTitleTextUI: function() {
		return root.queryTextUI("infowindow_title");
	},

    getWindowTitleText: function() {
		return 'Select Unit';
	},

    getWindowWidth: function() {
        return this._scrollbar.getScrollbarWidth() + (this.getWindowXPadding() * 2);
    },

    getWindowHeight: function() {
        return this._scrollbar.getScrollbarHeight() + (this.getWindowYPadding() * 2);
    }
});

var SelectorEventUnitScrollbar = defineObject(BaseSelectEventScrollbar, {
    initialize: function() {
        this._counter = createObject(UnitCounter);
        this._isLowRes = root.getConfigInfo().getResolutionIndex() == 0;
    },

    moveScrollbarContent: function() {
        return this._counter.moveUnitCounter();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        if (this._isLowRes === false) {
            var unitRenderParam = StructureBuilder.buildUnitRenderParam();
            unitRenderParam.colorIndex = 0;
            unitRenderParam.animationIndex = this._counter.getAnimationIndexFromUnit(object);
            unitRenderParam.direction = isSelect ? DirectionType.BOTTOM : DirectionType.NULL;
            unitRenderParam.isScroll = false;
    
            x += Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
            y += Math.floor((GraphicsFormat.CHARCHIP_HEIGHT) / 2) - 16;

            UnitRenderer.drawDefaultUnit(object, x, y, unitRenderParam);

            x += Math.floor(GraphicsFormat.CHARCHIP_WIDTH / 2);
        }

        x += 10;
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        TextRenderer.drawText(x, y, object.getName(), -1, color, font);
        TextRenderer.drawText(x, y + 20, object.getClass().getName(), -1, color, font);
	},

    getObjectWidth: function() {
        var extraWidth = 0;
        if (this._isLowRes === false) {
            extraWidth += GraphicsFormat.CHARCHIP_WIDTH + 10;
        }

        return extraWidth + 120;
    },

    getObjectHeight: function() {
        if (this._isLowRes === false) {
            return GraphicsFormat.CHARCHIP_HEIGHT;
        }

        return 50;
    },

    drawDescriptionLine: function(x, y) {
        if (this._isLowRes === true) {
            BaseScrollbar.drawDescriptionLine.call(this, x, y);
        }
    },

    playCancelSound: function() {
	}
})