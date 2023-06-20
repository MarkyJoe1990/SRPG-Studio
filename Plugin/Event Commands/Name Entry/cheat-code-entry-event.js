( function () {

    // Modes
    // 0 - Name Entry
    // 1 - Config
    // 2 - Event

    MapCommand.CheatCode = defineObject(BaseListCommand, {
        openCommand: function() {
            this._windowManager = createObject(NameEntryWindowManager);
            this._cheatManager = createObject(CheatCodeWindowManager);
            this._capsuleEvent = createObject(CapsuleEvent);
            var title = "Cheat Codes";
            var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
            var lengthLimit = 20;
    
            this._windowManager.setUp(title, keys, 0, lengthLimit, null, "");
            if (CheatCodeControl.isCheatConfigEnabled()) {
                this._startCheatWindowManager();
                return;
            }

            this.changeCycleMode(0);
        },
    
        moveCommand: function() {
            var result, mode = this.getCycleMode();
            if (mode === 0) {
                result = this._windowManager.moveWindowManager();

                if (result == MoveResult.END) {
                    var string = this._windowManager.getNameEntry();
                    if (CheatCodeControl.checkMasterCheatPassword(string)) {
                        result = MoveResult.CONTINUE;
                        CheatCodeControl.setCheatConfig(true);
                        this._startCheatWindowManager();
                    } else {
                        this._playBlockSound();
                    }
                }
            } else if (mode === 1) {
                result = this._cheatManager.moveWindowManager();

                if (result == MoveResult.SELECT) {
                    var event = this.getObject().event;

                    if (event.isEvent()) {
                        this._startCapsuleEvent(event);
                    }

                    return MoveResult.CONTINUE;
                }
            } else if (mode === 2) {
                result = this._capsuleEvent.moveCapsuleEvent();

                if (result == MoveResult.END) {
                    this.changeCycleMode(1);
                    return MoveResult.CONTINUE;
                }
            }
    
            return result;
        },

        getObject: function() {
            return this._cheatManager.getObject();
        },
    
        drawCommand: function() {
            var mode = this.getCycleMode();

            if (mode === 0) {
                this._windowManager.drawWindowManager();
            } else if (mode === 1) {
                this._cheatManager.drawWindowManager();
            }
        },

        getCommandName: function() {
            return "Cheat Codes"
        },

        isCommandDisplayable: function() {
            return CheatCodeControl.getMasterCheatPassword() != "";
        },

        _startCapsuleEvent: function(event) {
            this._capsuleEvent.enterCapsuleEvent(event, true);
            this.changeCycleMode(2);
        },

        _startCheatWindowManager: function() {
            this._cheatManager.setUp();
            this.changeCycleMode(1);
        },

        _playBlockSound: function() {
            MediaControl.soundDirect('operationblock');
        }
    });

    var alias1 = MapCommand.configureCommands;
    MapCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.insertObject(MapCommand.CheatCode, groupArray.length - 1);
    };
}) ();
