( function() {
    if (CameraPanConfig.enableUnitSnapPan !== true) {
        return;
    }
	
    // Snap to unit after canceling movement
	var alias1 = MapSequenceArea._doCancelAction;
	MapSequenceArea._doCancelAction = function() {
        var session = root.getCurrentSession();
        var prevScrollX = session.getScrollPixelX();
        var prevScrollY = session.getScrollPixelY();

        alias1.call(this);

        // Undo the regular camera scrolling
        session.setScrollPixelX(prevScrollX);
        session.setScrollPixelY(prevScrollY);

		if (this._parentTurnObject._mapEdit != null) {
            var mapCursor = this._parentTurnObject._mapEdit._mapCursor;
            mapCursor._cameraPan.setDestinationTileCenter(this._targetUnit.getMapX(), this._targetUnit.getMapY());
            mapCursor._cameraPan.setTimeMethod(CameraPanControl.snapTimeMethod);
            mapCursor._cameraPan.setEaseMethod(CameraPanControl.defaultEaseMethod);
            mapCursor._cameraPan.startCameraPan();
		}
	}
	
    // Snap to unit after canceling command
	var alias2 = PlayerTurn.setPosValue;
	PlayerTurn.setPosValue = function(unit) {
        var session = root.getCurrentSession();
        var prevScrollX = session.getScrollPixelX();
        var prevScrollY = session.getScrollPixelY();

        alias2.call(this, unit);

        // Undo the regular camera scrolling
        session.setScrollPixelX(prevScrollX);
        session.setScrollPixelY(prevScrollY);

        var mapCursor = this._mapEdit._mapCursor;
        mapCursor._cameraPan.setDestinationTileCenter(unit.getMapX(), unit.getMapY());
        mapCursor._cameraPan.setTimeMethod(CameraPanControl.snapTimeMethod);
        mapCursor._cameraPan.setEaseMethod(CameraPanControl.defaultEaseMethod);
        mapCursor._cameraPan.startCameraPan();
	}
	
    // Snap to unit after L or R Switch unit cycling
	var alias3 = MapEdit._setFocus;
	MapEdit._setFocus = function(unit) {
        var session = root.getCurrentSession();
        var prevScrollX = session.getScrollPixelX();
        var prevScrollY = session.getScrollPixelY();

        alias3.call(this, unit);

        // Undo the regular camera scrolling
        session.setScrollPixelX(prevScrollX);
        session.setScrollPixelY(prevScrollY);

        var mapCursor = this._mapCursor;
        mapCursor._cameraPan.setDestinationTileCenter(unit.getMapX(), unit.getMapY());
        mapCursor._cameraPan.setTimeMethod(CameraPanControl.snapTimeMethod);
        mapCursor._cameraPan.setEaseMethod(CameraPanControl.defaultEaseMethod);
        mapCursor._cameraPan.startCameraPan();
	}
}) ();