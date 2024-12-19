( function() {
    if (CameraPanConfig.enableEnemyPan !== true) {
        return;
    }

	var alias1 = ScrollAutoAction.setAutoActionInfo;
	ScrollAutoAction.setAutoActionInfo = function(unit, combination) {
		alias1.call(this, unit, combination);
		this._unit = unit;
		this._cource = combination.cource;
        this._cameraPan = createObject(CameraPan);
	}
	
	// Override
	ScrollAutoAction.enterAutoAction = function() {
		if (this.isSkipMode() === true) {
			return EnterResult.NOTENTER;
		}

		var unit = this._unit;
		var cource = this._cource;

		var unitPos = createPos(unit.getMapX(), unit.getMapY());
		var destPos = this._getDestinationPos(unitPos.x, unitPos.y, cource);
		var scrollBoundary = CameraPanControl.calculateScrollBoundary();
		
		if (CameraPanControl.isScrollTileAllowed(unitPos.x, unitPos.y, scrollBoundary) !== true) {
			return EnterResult.NOTENTER;
		}

		if (CameraPanControl.isScrollTileAllowed(destPos.x, destPos.y, scrollBoundary) !== true) {
			return EnterResult.NOTENTER;
		}

		var centerPos = createPos(Math.floor((unitPos.x + destPos.x) / 2), Math.floor((unitPos.y + destPos.y) / 2))
		this._cameraPan.setDestinationTileCenter(centerPos.x, centerPos.y);
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

	var alias2 = ScrollAutoAction.drawAutoAction;
	ScrollAutoAction.drawAutoAction = function() {
		alias2.call(this);
		this._cameraPan.drawDebug();
	}

	// New function
	ScrollAutoAction._getDestinationPos;
	ScrollAutoAction._getDestinationPos = function(x, y, cource) {
		var i, count = cource.length;

		for (i = 0; i < count; i++) {
			x += XPoint[cource[i]];
			y += YPoint[cource[i]];
		}

		return createPos(x, y);
	}
}) ();