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

		// Calculate validation boundary
		var session = root.getCurrentSession();
		var tileWidth = GraphicsFormat.MAPCHIP_WIDTH;
		var tileHeight = GraphicsFormat.MAPCHIP_HEIGHT;
		var gameWidth = root.getGameAreaWidth();
		var gameHeight = root.getGameAreaHeight();
		var scrollX = session.getScrollPixelX();
		var scrollY = session.getScrollPixelY();
		var mapPixelWidth = CurrentMap.getWidth() * tileWidth;
		var mapPixelHeight = CurrentMap.getHeight() * tileHeight;
		var extraTileX = scrollX % tileWidth > 0 ? 1 : 0;
		var extraTileY = scrollY % tileHeight > 0 ? 1 : 0;
		var tileHighlightCountX = Math.ceil(gameWidth / tileWidth) - 4 + extraTileX;
		var tileHighlightCountY = Math.ceil(gameHeight / tileHeight) - 4 + extraTileY;

		// Slightly different from drawDebug since this is tile-level instead of pixel-level;
		var width = tileHighlightCountX;
		var height = tileHighlightCountY;
		var x = 2 + Math.floor(scrollX / tileWidth);
		var y = 2 + Math.floor(scrollY / tileHeight);
		var unitPos = createPos(unit.getMapX(), unit.getMapY());
		var destPos = this._getDestinationPos(unitPos.x, unitPos.y, cource);

		// Check if unit or destination coordinates are close to the screen edges.
		// If so, check if the screen can reasonably be scrolled over there.
		var isScrollable = false;
		if (unitPos.x < x) {
			if (scrollX > 0) {
				isScrollable = true;
			}
		} else if (unitPos.x > x + width - 1) {
			if (scrollX < mapPixelWidth - gameWidth) {
				isScrollable = true;
			}
		}

		if (unitPos.y < y) {
			if (scrollY > 0) {
				isScrollable = true;
			}
		} else if (unitPos.y > y + height - 1) {
			if (scrollY < mapPixelHeight - gameHeight) {
				isScrollable = true;
			}
		}

		if (destPos.x < x) {
			if (scrollX > 0) {
				isScrollable = true;
			}
		} else if (destPos.x > x + width - 1) {
			if (scrollX < mapPixelWidth - gameWidth) {
				isScrollable = true;
			}
		}

		if (destPos.y < y) {
			if (scrollY > 0) {
				isScrollable = true;
			}
		} else if (destPos.y > y + height - 1) {
			if (scrollY < mapPixelHeight - gameHeight) {
				isScrollable = true;
			}
		}

		if (isScrollable !== true) {
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