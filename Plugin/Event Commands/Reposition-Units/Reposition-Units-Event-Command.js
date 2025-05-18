var RepositionUnitsEventCommand = defineObject(BaseEventCommand, {
    enterEventCommandCycle: function() {
        var args = root.getEventCommandObject().getEventCommandArgument();

        switch(typeof args.positions) {
            case "function":
                this._positions = args.positions();
                break;
            case "undefined":
                return EnterResult.NOTENTER;
            default:
                this._positions = args.positions
                break;
        }

        this._isForce = args.isForce === true;

        this._mapEdit = createObject(MapEdit);
        this._posDoubleCursor = createObject(PosDoubleCursor);
        this._mapEdit.openMapEdit();
        this._questionWindow = createObject(QuestionWindow);
        this._questionWindow.setQuestionMessage("Are you sure you want this unit configuration?");

        var indexArray = [];
        var i, index, pos, count = this._positions.length;
        for (i = 0; i < count; i++) {
            pos = this._positions[i];
            index = CurrentMap.getIndex(pos.x, pos.y);

            if (index === -1) {
                continue;
            }

            indexArray.push(index);
        }


        MapLayer.getMapChipLight().setIndexArray(indexArray);

        this._startEdit();

		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
        var mode = this.getCycleMode();
        
        // Have to do a bunch of fancy nonsense to get this to work properly
        if (mode === 0) {
            var result = this._mapEdit.moveMapEdit();

            // Check if the Unit Menu was opened
            if (SceneManager.isScreenClosed(this._mapEdit._unitMenu) !== true) {
                this._startUnitMenu();
            } else if (result === MapEditResult.UNITSELECT) {
                this._selectUnit();
            } else if (result === MapEditResult.MAPCHIPSELECT) {
                if (this._isPositionSelect() === true) {
                    this._selectTile();
                } else if (InputControl.isSelectAction() === true) {
                    if (this._isValidConfiguration() === true) {
                        this._startQuestionWindow();
                    }
                }
            }
        } else if (mode === 1) {
            var result = this._mapEdit._unitMenu.moveScreenCycle();
            if (result !== MoveResult.CONTINUE) {
                SceneManager._screenArray.pop();
                this._startEdit();
            }
        } else if (mode === 2) {
            if (this._questionWindow.moveWindow() !== MoveResult.CONTINUE) {
                var ans = this._questionWindow.getQuestionAnswer();
                if (ans === QuestionAnswer.YES) {
                    MapLayer.getMapChipLight().endLight();
                    return MoveResult.END;
                } else {
                    this._startEdit();
                }
            }
        }

        this._posDoubleCursor.moveCursor();

		return MoveResult.CONTINUE;
	},
	
	drawEventCommandCycle: function() {
        var mode = this.getCycleMode();

        if (mode === 0) {
            this._mapEdit.drawMapEdit();
        }

        if (this._targetObj != null) {
			this._posDoubleCursor.drawCursor(this._targetObj.x, this._targetObj.y, this._mapEdit.getEditX(), this._mapEdit.getEditY());
		}

        if (mode === 2) {
            var x = LayoutControl.getCenterX(-1, this._questionWindow.getWindowWidth());
            var y = LayoutControl.getCenterY(-1, this._questionWindow.getWindowHeight());

            this._questionWindow.drawWindow(x, y);
        }
	},

    isEventCommandSkipAllowed: function() {
		return false;
	},

    getEventCommandName: function() {
        return "Reposition Units";
    },

    _selectUnit: function() {
        this._playSelectSound();

        if (this._targetObj != null) {
            this._swapUnit();
            this._targetObj = null;
            return;
        }

        var unit = this._mapEdit.getEditTarget();
        this._targetObj = {
            unit: unit,
            x: unit.getMapX(),
            y: unit.getMapY()
        };
    },

    _selectTile: function() {
        this._playSelectSound();

        if (this._targetObj != null) {
            this._swapUnit();
            this._targetObj = null;
            return;
        }

        var mapEdit = this._mapEdit;
        this._targetObj = {
            unit: null,
            x: mapEdit.getEditX(),
            y: mapEdit.getEditY()
        };
    },

    _swapUnit: function() {
        var mapEdit = this._mapEdit;

        var currentUnit = mapEdit.getEditTarget();
        var currentX = mapEdit.getEditX();
        var currentY = mapEdit.getEditY();

        var prevUnit = this._targetObj.unit;
        var prevX = this._targetObj.x;
        var prevY = this._targetObj.y;

        if (currentUnit != null) {
            currentUnit.setMapX(prevX);
            currentUnit.setMapY(prevY);
        }

        if (prevUnit != null) {
            prevUnit.setMapX(currentX);
            prevUnit.setMapY(currentY);
        }
    },

    _isPositionSelect: function() {
        var mapEdit = this._mapEdit;
        var editX = mapEdit.getEditX();
        var editY = mapEdit.getEditY();

        var i, position, count = this._positions.length;
        for (i = 0; i < count; i++) {
            position = this._positions[i];
            if (editY === position.y && editX === position.x) {
                return true;
            }
        }

        return false;
    },

    _isValidConfiguration: function() {
        if (this._isForce !== true) {
            return true;
        }

        var playerList = PlayerList.getSortieList();
        var playerCount = playerList.getCount();
        var i, unit, pos, count = this._positions.length;
        var totalCount = 0;
        for (i = 0 ; i < count; i++) {
            pos = this._positions[i];
            unit = PosChecker.getUnitFromPos(pos.x, pos.y);
            if (unit == null) {
                continue;
            }

            if (unit.getUnitType() !== UnitType.PLAYER) {
                continue;
            }

            if (++totalCount >= playerCount) {
                return true;
            };
        }

        return false;
    },

    _playSelectSound: function() {
        MediaControl.soundDirect('commandselect');
	},
    
    _startQuestionWindow: function() {
        MediaControl.soundDirect('commandselect');
        this._questionWindow.setQuestionActive(true);
        this.changeCycleMode(2);
    },

    _startEdit: function() {
        this.changeCycleMode(0);
    },

    _startUnitMenu: function() {
        this.changeCycleMode(1);
    }
});