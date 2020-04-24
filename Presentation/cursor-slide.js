/*
	Version 1.1
	Made by MarkyJoe1990
	
	When you press a direction on your keyboard, the map cursor will
	"slide" into the new tile rather than instantly appearing into it.

	This plugin overrides the original functions for:
	
	* MapCursor.drawCursor
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/
(function() {
	var alias1 = MapCursor.initialize;
	MapCursor.initialize = function() {
		this._displayedx = 0;
		this._displayedy = 0;
		alias1.call(this);
	}
	
	var alias2 = MapCursor.drawCursor;
	MapCursor.drawCursor = function() {
		var session = root.getCurrentSession();
		var width = UIFormat.MAPCURSOR_WIDTH / 2;
		var height = UIFormat.MAPCURSOR_HEIGHT;
		var x = (session.getMapCursorX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX() + this._displayedx;
		var y = (session.getMapCursorY() * GraphicsFormat.MAPCHIP_HEIGHT) - session.getScrollPixelY() + this._displayedy;
		var pic = root.queryUI('mapcursor');
		
		if (pic !== null) {
			pic.drawStretchParts(x, y, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, this._mapCursorSrcIndex * width, 0, width, height);
		}
		
		//If you moved right
		if (this._displayedx < 0 ) {
			this._displayedx += this._isAccelerate() ? (this._displayedx % UIFormat.MAPCURSOR_HEIGHT != 0 ? -this._displayedx : UIFormat.MAPCURSOR_HEIGHT) : (UIFormat.MAPCURSOR_HEIGHT / 4);
		}
		else if (this._displayedx > 0) {
			this._displayedx -= this._isAccelerate() ? (this._displayedx % UIFormat.MAPCURSOR_HEIGHT != 0 ? this._displayedx : UIFormat.MAPCURSOR_HEIGHT) : (UIFormat.MAPCURSOR_HEIGHT / 4)
		}
		
		if (this._displayedy < 0) {
			this._displayedy += this._isAccelerate() ? (this._displayedy % UIFormat.MAPCURSOR_HEIGHT != 0 ? -this._displayedy : UIFormat.MAPCURSOR_HEIGHT) : (UIFormat.MAPCURSOR_HEIGHT / 4);
		}
		else if (this._displayedy > 0) {
			this._displayedy -= this._isAccelerate() ? (this._displayedy % UIFormat.MAPCURSOR_HEIGHT != 0 ? this._displayedy : UIFormat.MAPCURSOR_HEIGHT) : (UIFormat.MAPCURSOR_HEIGHT / 4);
		}
		
	}
	
	var alias3 = MapCursor._changeCursorValue;
	MapCursor._changeCursorValue = function(input) {
		cursorX = root.getCurrentSession().getMapCursorX();
		cursorY = root.getCurrentSession().getMapCursorY();
		var n = root.getCurrentSession().getMapBoundaryValue();
		
		if (input === InputType.LEFT && cursorX > 0 + n) {
			this._displayedx += GraphicsFormat.MAPCHIP_WIDTH;
		}
		if (input === InputType.RIGHT && cursorX < CurrentMap.getWidth() - 1 - n) {
			this._displayedx -= GraphicsFormat.MAPCHIP_WIDTH;
		}
		if (input === InputType.UP && cursorY > 0 + n) {
			this._displayedy += GraphicsFormat.MAPCHIP_WIDTH;
		}
		if (input === InputType.DOWN && cursorY < CurrentMap.getHeight() - 1 - n) {
			this._displayedy -= GraphicsFormat.MAPCHIP_WIDTH;
		}
		alias3.call(this,input);
	}
	
}) ();