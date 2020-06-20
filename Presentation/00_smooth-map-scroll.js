/*
	Version 2.0
	Made by MarkyJoe1990
	
	WARNING: NEEDS SCROLLER.JS IN THE PLUGINS FOLDER IN ORDER TO WORK
	
	This makes the map screen scroll smoothly when you are using a keyboard
	While this does not apply to enemies, the game already has a config
	option that allows it for them. Look for "Scroll Speed" and set it to
	normal or slow.
	
	This plugin overrides the original functions for:
	
	* MapCursor._changeCursorValue
	* MapParts.Terrain._getPositionY
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/

(function () {
	var alias1 = MapCursor.initialize;
	MapCursor.initialize = function() {
		alias1.call(this);
		this._scroller = createObject(Scroller);
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
		
		if (input === InputType.LEFT) {
			xCursor--;
		}
		else if (input === InputType.UP) {
			yCursor--;
		}
		else if (input === InputType.RIGHT) {
			xCursor++;
		}
		else if (input === InputType.DOWN) {
			yCursor++;
		}
		
		if (xCursor < n) {
			xCursor = n;
		}
		else if (yCursor < n) {
			yCursor = n;
		}
		else if (xCursor > CurrentMap.getWidth() - 1 - n) {
			xCursor = CurrentMap.getWidth() - 1 - n;
		}
		else if (yCursor > CurrentMap.getHeight() - 1 - n) {
			yCursor = CurrentMap.getHeight() - 1 - n;
		}
		else {
			// A cursor was moved, so play a sound.
			this._playMovingSound();
		}
		this._scroller.setScroll(xCursor, yCursor);
		//MapView.setScroll(xCursor, yCursor);
		
		session.setMapCursorX(xCursor);
		session.setMapCursorY(yCursor);
	}
	
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
}) ();