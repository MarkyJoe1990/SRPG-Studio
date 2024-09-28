( function() {
    if (CameraPanConfig.enableMouseMovementPan !== true) {
        return;
    }

    var alias1 = MapCursor.initialize;
	MapCursor.initialize = function() {
		alias1.call(this);
		this._cameraPan = createObjectEx(CameraPan, this);
        this._cameraPan.disableGameAcceleration();
	}

    var alias2 = MapCursor.moveCursorAnimation;
	MapCursor.moveCursorAnimation = function() {
        this._cameraPan.moveCameraPan();
        return alias2.call(this);
    }

    var alias3 = MapCursor._changeCursorValue;
	MapCursor._changeCursorValue = function(input) {
        var session = root.getCurrentSession();

        // This is just to undo the pixel scrolling
        // stuff done in the original function
        var prevScrollX = session.getScrollPixelX();
        var prevScrollY = session.getScrollPixelY();
        
        var result = alias3.call(this, input);

        var scrollX = session.getScrollPixelX();
        var scrollY = session.getScrollPixelY();

        session.setScrollPixelX(prevScrollX);
        session.setScrollPixelY(prevScrollY);

        this._cameraPan.setDestination(scrollX, scrollY);
        this._cameraPan.setTimeMethod(CameraPanControl.mouseTimeMethod);
        this._cameraPan.setEaseMethod(CameraPanControl.mouseEaseMethod);
        this._cameraPan.startCameraPan();

        return result;
    }

    // Override
	MapParts.Terrain._getPositionY = function() {
		var x = LayoutControl.getPixelX(this.getMapPartsX());
		var dx = root.getGameAreaWidth() / 2;
		var y = LayoutControl.getPixelY(this.getMapPartsY());
		var dy = root.getGameAreaHeight() / 2;
		var yBase = LayoutControl.getRelativeY(10) - 28;
		
        // Only change is adding more pixels to the position change requirements.
		if (x > dx + 100 && y < dy + 100) {
			return root.getGameAreaHeight() - this._getWindowHeight() - yBase;
		}
		else {
			return yBase;
		}
	}
}) ();