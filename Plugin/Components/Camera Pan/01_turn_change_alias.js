( function() {
    if (CameraPanConfig.enableTurnChangePan !== true) {
        return;
    }
	
    // Default Phase Change Animation
	var alias1 = TurnMarkFlowEntry._prepareMemberData;
    TurnMarkFlowEntry._prepareMemberData = function(turnChange) {
        alias1.call(this, turnChange);
        this._cameraPan = createObject(CameraPan);
        this._isScrollAllowed = false;
        this._isAnimationAllowed = true;
    }

    var alias2 = TurnMarkFlowEntry._completeMemberData;
    TurnMarkFlowEntry._completeMemberData = function(turnChange) {
        var pos = this._getCursorPos();
        if (pos != null) {
            this._cameraPan.disableGameAcceleration();
            this._cameraPan.setDestinationTileCenter(pos.x, pos.y);
            this._cameraPan.startCameraPan();
            this._isScrollAllowed = true;
        }

        return alias2.call(this, turnChange);
    }

    var alias3 = TurnMarkFlowEntry.moveFlowEntry;
    TurnMarkFlowEntry.moveFlowEntry = function() {
        if (this._isScrollAllowed === true) {
            if (this._cameraPan.moveCameraPan() !== MoveResult.CONTINUE) {
                this._isScrollAllowed = false;
            }
        }

        if (this._isAnimationAllowed === true) {
            if (alias3.call(this) !== MoveResult.CONTINUE) {
                this._isAnimationAllowed = false;
            }
        }

        if (this._isScrollAllowed === true) {
            return MoveResult.CONTINUE;
        }

        if (this._isAnimationAllowed === true) {
            return MoveResult.CONTINUE;
        }

        return MoveResult.END;
    }

    var alias4 = TurnMarkFlowEntry.drawFlowEntry;
    TurnMarkFlowEntry.drawFlowEntry = function() {
        if (this._isAnimationAllowed !== true) {
            return;
        }

        alias4.call(this);
    }

    // Specific Phase Change Animation
	var alias5 = TurnAnimeFlowEntry._prepareMemberData;
    TurnAnimeFlowEntry._prepareMemberData = function(turnChange) {
        alias5.call(this, turnChange);
        this._cameraPan = createObject(CameraPan);
        this._isScrollAllowed = false;
        this._isAnimationAllowed = true;
    }

    var alias6 = TurnAnimeFlowEntry._completeMemberData;
    TurnAnimeFlowEntry._completeMemberData = function(turnChange) {
        var pos = this._getCursorPos();
        if (pos != null) {
            this._cameraPan.disableGameAcceleration();
            this._cameraPan.setDestinationTileCenter(pos.x, pos.y);
            this._cameraPan.startCameraPan();
            this._isScrollAllowed = true;
        }

        return alias6.call(this, turnChange);
    }

    var alias7 = TurnAnimeFlowEntry.moveFlowEntry;
    TurnAnimeFlowEntry.moveFlowEntry = function() {
        if (this._isScrollAllowed === true) {
            if (this._cameraPan.moveCameraPan() !== MoveResult.CONTINUE) {
                this._isScrollAllowed = false;
            }
        }

        if (this._isAnimationAllowed === true) {
            if (alias7.call(this) !== MoveResult.CONTINUE) {
                this._isAnimationAllowed = false;
            }
        }

        if (this._isScrollAllowed === true) {
            return MoveResult.CONTINUE;
        }

        if (this._isAnimationAllowed === true) {
            return MoveResult.CONTINUE;
        }

        return MoveResult.END;
    }

    var alias8 = TurnAnimeFlowEntry.drawFlowEntry;
    TurnAnimeFlowEntry.drawFlowEntry = function() {
        if (this._isAnimationAllowed !== true) {
            return;
        }

        alias8.call(this);
    }

    // New function
    BaseTurnLogoFlowEntry._getCursorPos = function() {
        var session = root.getCurrentSession();
        if (session.getTurnType() === TurnType.PLAYER && root.getCurrentSession().getTurnCount() > 0) {
            if (EnvironmentControl.isAutoCursor() !== true) {
                return createPos(session.getMapCursorX(), session.getMapCursorY());
            }
        }

        var i, unit;
		var targetUnit = null;
		var list = TurnControl.getActorList();
		var count = list.getCount();
		
		for (i = 0; i < count; i++) {
			unit = list.getData(i);
			if (unit.getImportance() === ImportanceType.LEADER) {
				targetUnit = unit;
				break;
			}
		}
		
		if (targetUnit === null) {
			targetUnit = list.getData(0);
		}
		
		if (targetUnit !== null) {
			return createPos(targetUnit.getMapX(), targetUnit.getMapY());
		}

        return null;
    }
}) ();