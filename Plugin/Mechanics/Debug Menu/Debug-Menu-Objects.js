var DebugMenu = defineObject(BaseListCommand, {
    _capsuleEvent: null,
    _windowManager: null,

    openCommand: function() {
        this._capsuleEvent = createObject(CapsuleEvent);
        this._windowManager = createObject(DebugMenuWindowManager);

        this.changeCycleMode(0);
    },

    moveCommand: function() {
        var mode = this.getCycleMode();

        if (mode === 0) {
            var input = this._windowManager.moveWindowManager();
            if (input === ScrollbarInput.SELECT) {
                if (this._capsuleEvent.enterCapsuleEvent(this.getObject(), false) === EnterResult.OK) {
                    this.changeCycleMode(1);
                };
            } else if (input === ScrollbarInput.CANCEL) {
                return MoveResult.CANCEL;
            }
        } else if (mode === 1) {
            if (this._capsuleEvent.moveCapsuleEvent() === MoveResult.END) {
                this.changeCycleMode(0);
            }
        }

        return MoveResult.CONTINUE;
    },

    drawCommand: function() {
        this.getCycleMode() === 0 && this._windowManager.drawWindowManager();
    },

    isCommandDisplayable: function() {
        if (DebugMenuConfig.isForceDebugMenu === true) {
            return true;
        }

        return root.isTestPlay();// && DebugMenuControl.getDebugEventArray().length > 0;
    },

    getObject: function() {
        return this._windowManager.getObject();
    },

    getCommandName: function() {
        return "Debug";
    }
});

var DebugMenuWindowManager = defineObject(BaseWindowManager, {
    initialize: function() {
        this._pageChanger = createObject(HorizontalPageChanger);
        this._windowArray = [];
        this._windowIndex = 0;
        this._configureWindowArray(this._windowArray);

        var currentWindow = this._windowArray[this._pageChanger.getPageIndex()];
        this._pageChanger.setPageData(this._windowArray.length, currentWindow.getWindowWidth(), currentWindow.getWindowHeight());
    },

    moveWindowManager: function() {
        this._pageChanger.movePage();
        if (this._pageChanger.checkPage() === true) {
            this._changePage(this._pageChanger.getPageIndex());
        }

        return this._windowArray[this._windowIndex].moveWindow();
    },

    _changePage: function(index) {
        this._windowIndex = index;
        var currentWindow = this._windowArray[this._windowIndex];

        this._pageChanger.setPageData(this._windowArray.length, currentWindow.getWindowWidth(), currentWindow.getWindowHeight());
        this._pageChanger._activePageIndex = this._windowIndex;
    },

    drawWindowManager: function() {
        var x = LayoutControl.getCenterX(-1, this._windowArray[this._windowIndex].getWindowWidth());
        var y = LayoutControl.getCenterY(-1, this._windowArray[this._windowIndex].getWindowHeight());

        this._pageChanger.drawPage(x, y);
        this._windowArray[this._windowIndex].drawWindow(x, y);
    },

    getObject: function() {
        return this._windowArray[this._windowIndex].getObject();
    },

    _configureWindowArray: function(groupArray) {
        groupArray.appendWindowObject(DebugMenuDebugEventWindow, this);
        groupArray.appendWindowObject(DebugMenuAutoEventWindow, this);
        groupArray.appendWindowObject(DebugMenuOpeningEventWindow, this);
        groupArray.appendWindowObject(DebugMenuEndingEventWindow, this);
        groupArray.appendWindowObject(DebugMenuPlaceEventWindow, this);
        groupArray.appendWindowObject(DebugMenuTalkEventWindow, this);
        groupArray.appendWindowObject(DebugMenuCommunicationEventWindow, this);
        groupArray.appendWindowObject(DebugMenuMapCommonEventWindow, this);
    }
});

var BaseDebugMenuWindow = defineObject(BaseWindow, {
    initialize: function() {
        this._scrollbar = createScrollbarObject(DebugMenuScrollbar, this);
        var arr = this._getEventArray();
        var count = arr.length;
        if (count > 10) {
            count = 10;
        }
        
        this._scrollbar.setScrollFormation(1, count);
        this._scrollbar.setObjectArray(arr);
		this._scrollbar.setActive(true);
    },

    _getEventArray: function() {
        return [];
    },

    _getEventList: function() {
        return null;
    },

    moveWindowContent: function() {
        return this._scrollbar.moveInput();
    },

    drawWindowContent: function(x, y) {
        this._scrollbar.drawScrollbar(x, y);
    },

    getObject: function() {
        return this._scrollbar.getObject();
    },

    getWindowWidth: function() {
        return this._scrollbar.getScrollbarWidth() + (this.getWindowXPadding() * 2);
    },

    getWindowHeight: function() {
        return this._scrollbar.getScrollbarHeight() + (this.getWindowYPadding() * 2);
    },

	getWindowTitleTextUI: function() {
		return root.queryTextUI('objective_title');
	},

	_getWindowTitlePartsCount: function() {
		return 6;
	}
});

var BaseDebugMenuEventWindow = defineObject(BaseDebugMenuWindow, {
    _getEventArray: function() {
        var arr = [];

        var list = this._getEventList();
        var i, count = list.getCount();
        for (i = 0; i < count; i++) {
            arr.push(list.getData(i));
        }

        return arr;
    }
});


// Actual Objects
var DebugMenuDebugEventWindow = defineObject(BaseDebugMenuWindow, {
    _getEventArray: function() {
        return DebugMenuControl.getDebugEventArray();
    },

	getWindowTitleText: function() {
		return 'Debug Events';
	}
});

var DebugMenuAutoEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getAutoEventList();
    },

	getWindowTitleText: function() {
		return 'Auto Events';
	}
});

var DebugMenuOpeningEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getOpeningEventList();
    },

	getWindowTitleText: function() {
		return 'Opening Events';
	}
});

var DebugMenuEndingEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getEndingEventList();
    },

	getWindowTitleText: function() {
		return 'Ending Events';
	}
});

var DebugMenuPlaceEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getPlaceEventList();
    },

	getWindowTitleText: function() {
		return 'Place Events';
	}
});

var DebugMenuTalkEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getTalkEventList();
    },

	getWindowTitleText: function() {
		return 'Talk Events';
	}
});

var DebugMenuCommunicationEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getCommunicationEventList();
    },

	getWindowTitleText: function() {
		return 'Communication Events';
	}
});

var DebugMenuMapCommonEventWindow = defineObject(BaseDebugMenuEventWindow, {
    _getEventList: function() {
        return root.getCurrentSession().getMapCommonEventList();
    },

	getWindowTitleText: function() {
		return 'Map Common Events';
	}
});

var DebugMenuScrollbar = defineObject(BaseScrollbar, {
	drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var handle = object.getIconResourceHandle();

        if (handle.isNullHandle() !== true) {
            GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
            x += 32;
        }

        TextRenderer.drawText(x, y, object.getName(), -1, color, font);
	},

    getObjectWidth: function() {
        return 200;
    },

    getObjectHeight: function() {
        return 28;
    }
});

(function() {
    var alias1 = MapCommand.configureCommands;
    MapCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.insertObject(DebugMenu, groupArray.length - 1);
    };
}) ();