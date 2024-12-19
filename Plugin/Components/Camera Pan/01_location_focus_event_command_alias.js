( function () {
    if (CameraPanConfig.enableLocationFocusPan !== true) {
        return;
    }

    var alias1 = LocationFocusEventCommand._prepareEventCommandMemberData;
    LocationFocusEventCommand._prepareEventCommandMemberData = function() {
        alias1.call(this);
        this._cameraPan = createObject(CameraPan);
    }

    var alias2 = LocationFocusEventCommand._completeEventCommandMemberData;
    LocationFocusEventCommand._completeEventCommandMemberData = function() {
        var result = alias2.call(this);

        if (result === EnterResult.NOTENTER) {
            return result;
        }

        var pos = this._getFocusPos();
        this._cameraPan.setDestinationTileCenter(pos.x, pos.y);
        this._cameraPan.startCameraPan();

        return result;
    }

    // OVERWRITE
    var alias3 = LocationFocusEventCommand._moveScroll;
    LocationFocusEventCommand._moveScroll = function() {
        var pos;
		
		if (this._cameraPan.moveCameraPan() !== MoveResult.CONTINUE) {
			pos = this._getFocusPos();
			this._focusCursor.setPos(pos.x, pos.y);
			this.changeCycleMode(LocationFocusMode.CURSOR);
		}
		
		return MoveResult.CONTINUE;
    }
}) ();