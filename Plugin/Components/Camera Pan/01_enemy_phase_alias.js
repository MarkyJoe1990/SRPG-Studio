( function() {
    if (CameraPanConfig.enableEnemyPan !== true) {
        return;
    }

	var alias1 = ScrollAutoAction.setAutoActionInfo;
	ScrollAutoAction.setAutoActionInfo = function(unit, combination) {
		alias1.call(this, unit, combination);
        this._cameraPan = createObject(CameraPan);
        this._cameraPan.setDestinationTileCenter(unit.getMapX(), unit.getMapY());
	}
	
	// Override
	ScrollAutoAction.enterAutoAction = function() {
		if (this.isSkipMode() === true) {
			return EnterResult.NOTENTER;
		}

        this._cameraPan.startCameraPan();
		return EnterResult.OK;
	}
	
	// Override
	ScrollAutoAction.moveAutoAction = function() {
		if (this.isSkipMode() === true) {
			return MoveResult.END;
		}

		return this._cameraPan.moveCameraPan();
	}
}) ();