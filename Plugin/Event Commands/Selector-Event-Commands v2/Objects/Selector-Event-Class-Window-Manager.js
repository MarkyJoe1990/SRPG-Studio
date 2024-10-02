var SelectorEventClassWindowManager = defineObject(BaseSelectEventWindowManager, {
    _getMainWindow: function() {
        return SelectorEventClassWindow;
    }
});

var SelectorEventClassWindow = defineObject(BaseSelectEventWindow, {
    setData: function(unit, dataList) {
        this._scrollbar = createScrollbarObject(this._getScrollbarObject(), this);
        var count = dataList.getCount();
        this._scrollbar.setScrollFormation(1, count > 3 ? 3 : count);
        this._scrollbar.setDataList(dataList);
        this._scrollbar.enableSelectCursor(true);
    },

    _getScrollbarObject: function() {
        return SelectorEventClassScrollbar;
    },

    getWindowTitleText: function() {
		return 'Select Class';
	}
});

var SelectorEventClassScrollbar = defineObject(BaseSelectEventScrollbar, {
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
            unitRenderParam.handle = object.getCharChipResourceHandle();
            unitRenderParam.animationIndex = this._counter.getAnimationIndex();
            unitRenderParam.direction = isSelect ? DirectionType.BOTTOM : DirectionType.NULL;
            unitRenderParam.isScroll = false;

            x += Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
            y += Math.floor((GraphicsFormat.CHARCHIP_HEIGHT) / 2) - 16;
    
            UnitRenderer.drawCharChip(x, y, unitRenderParam);

            x += Math.floor(GraphicsFormat.CHARCHIP_WIDTH / 2);
            y += 10;
        }

        x += 10;
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        TextRenderer.drawText(x, y, object.getName(), -1, color, font);
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

        return 25;
    },

    drawDescriptionLine: function(x, y) {
        if (this._isLowRes === true) {
            BaseScrollbar.drawDescriptionLine.call(this, x, y);
        }
    },

    playCancelSound: function() {
	}
});