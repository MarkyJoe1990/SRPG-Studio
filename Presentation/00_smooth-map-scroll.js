/*
	Version 2.1
	Made by MarkyJoe1990
	
	WARNING: NEEDS SCROLLER.JS IN THE PLUGINS FOLDER IN ORDER TO WORK
	
	This makes the map screen scroll smoothly when you are using a keyboard
	While this does not apply to enemies, the game already has a config
	option that allows it for them. Look for "Scroll Speed" and set it to
	normal or slow.
	
	This plugin overrides the original functions for:
	
	* MapCursor._changeCursorValue
	* MapParts.Terrain._getPositionY
	* MapEdit._setFocus
	* PlayerTurn.setPosValue
	* MapSequenceArea._doCancelAction
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/

(function () {
	var alias1 = MapCursor.initialize;
	MapCursor.initialize = function() {
		alias1.call(this);
		this._scroller = createObject(MarkyJoeScroller);
	}
	
	var alias2 = MapCursor.moveCursor;
	MapCursor.moveCursor = function() {
		alias2.call(this);
		this._scroller.moveScroller();
	}
	
	var alias3 = MapCursor._changeCursorValue;
	MapCursor._changeCursorValue = function(input) {
		var session = root.getCurrentSession();
		var xCursor = session.getMapCursorX();
		var yCursor = session.getMapCursorY();
		var n = root.getCurrentSession().getMapBoundaryValue();
		
		var newx = xCursor;
		var newy = yCursor;
		
		if (root.isInputState(InputType.LEFT)) {
			newx--;
		} else if (root.isInputState(InputType.RIGHT)) {
			newx++;
		}
		if (root.isInputState(InputType.UP)) {
			newy--;
		} else if (root.isInputState(InputType.DOWN)) {
			newy++;
		}
		
		if (newx < n) {
			newx = n;
		}
		else if (newx > CurrentMap.getWidth() - 1 - n) {
			newx = CurrentMap.getWidth() - 1 - n;
		}
		if (newy < n) {
			newy = n;
		}
		else if (newy > CurrentMap.getHeight() - 1 - n) {
			newy = CurrentMap.getHeight() - 1 - n;
		}

		if (newx !== xCursor || newy !== yCursor) {
			// A cursor was moved, so play a sound.
			this._playMovingSound();
		}
		
		//MapView.setScroll(newx, newy);
		this._scroller.setScroll(newx, newy);
		session.setMapCursorX(newx);
		session.setMapCursorY(newy);
	};
	
	var alias4 = MapParts.Terrain._getPositionY;
	MapParts.Terrain._getPositionY = function() {
		var x = LayoutControl.getPixelX(this.getMapPartsX());
		var dx = root.getGameAreaWidth() / 2;
		var y = LayoutControl.getPixelY(this.getMapPartsY());
		var dy = root.getGameAreaHeight() / 2;
		var yBase = LayoutControl.getRelativeY(10) - 28;
		
		if (x > dx + 100 && y < dy + 100) {
			return root.getGameAreaHeight() - this._getWindowHeight() - yBase;
		}
		else {
			return yBase;
		}
	}
	
	var alias5 = MapSequenceArea.openSequence;
	MapSequenceArea.openSequence = function(parentTurnObject) {
		alias5.call(this, parentTurnObject);
		
		if (parentTurnObject._mapEdit) {
			this._mapCursor._scroller = parentTurnObject._mapEdit._mapCursor._scroller;
		}
		
		//return result;
	}
	
	var alias6 = MapSequenceArea._doCancelAction;
	MapSequenceArea._doCancelAction = function() {
		// Get the cursor back to the selected unit position.
		this._mapCursor.setPos(this._targetUnit.getMapX(), this._targetUnit.getMapY());
		
		this._targetUnit.setDirection(DirectionType.NULL);
		this._playMapUnitCancelSound();
		
		if (parentTurnObject._mapEdit) {
			this._parentTurnObject._mapEdit._mapCursor._scroller.setScroll(this._targetUnit.getMapX(), this._targetUnit.getMapY());
		}
		
		//MapView.setScroll(this._targetUnit.getMapX(), this._targetUnit.getMapY());
	}
	
	var alias10 = MapSequenceArea.moveSequence;
	MapSequenceArea.moveSequence = function() {
		result = alias10.call(this);
		
		this._mapCursor._scroller.moveScroller();
		
		return result;
	}
	
	var alias7 = PlayerTurn.setPosValue;
	PlayerTurn.setPosValue = function(unit) {
		unit.setMapX(this._xCursorSave);
		unit.setMapY(this._yCursorSave);
		this._mapEdit.setCursorPos(unit.getMapX(), unit.getMapY());
		
		this._mapEdit._mapCursor._scroller.setScroll(unit.getMapX(), unit.getMapY());
	}
	
	var alias8 = MapEdit._setFocus;
	MapEdit._setFocus = function(unit) {
		if (unit.getMapX() === this._mapCursor.getX() && unit.getMapY() === this._mapCursor.getY()) {
			return;
		}
		
		var session = root.getCurrentSession();
		
		session.setMapCursorX(unit.getMapX());
		session.setMapCursorY(unit.getMapY());
		
		MouseControl.changeCursorFromMap(unit.getMapX(), unit.getMapY());
		this._mapCursor._scroller.setScroll(unit.getMapX(), unit.getMapY());
		//MapView.changeMapCursor(unit.getMapX(), unit.getMapY());
	}
	
}) ();