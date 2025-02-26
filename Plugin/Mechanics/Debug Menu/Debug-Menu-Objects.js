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
        this._windowManager.drawWindowManager();
    },

    isCommandDisplayable: function() {
        return root.isTestPlay() && DebugMenuControl.getDebugEventArray().length > 0;
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
        this._window = createWindowObject(DebugMenuWindow, this);
    },

    moveWindowManager: function() {
        return this._window.moveWindow();
    },

    drawWindowManager: function() {
        var x = LayoutControl.getCenterX(-1, this._window.getWindowWidth());
        var y = LayoutControl.getCenterY(-1, this._window.getWindowHeight());

        this._window.drawWindow(x, y);
    },

    getObject: function() {
        return this._window.getObject();
    }
});

var DebugMenuWindow = defineObject(BaseWindow, {
    initialize: function() {
        this._scrollbar = createScrollbarObject(DebugMenuScrollbar, this);
        var arr = DebugMenuControl.getDebugEventArray();
        var count = arr.length;
        if (count > 10) {
            count = 10;
        }
        
        this._scrollbar.setScrollFormation(1, count);
        this._scrollbar.setObjectArray(arr);
		this._scrollbar.setActive(true);
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