/*
	Version 1.2
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
		var amount = 8 + (MapCursor._isAccelerate() * 24);
		
		//If you moved right
		if (this._displayedx < 0 ) {
			
			if (this._displayedx + amount > 0) {
				this._displayedx = 0;
			} else {
				this._displayedx += amount;
			}
			
			//this._displayedx += Math.ceil(Math.abs(Math.abs(this._displayedx) - 0) / (4 - (MapCursor._isAccelerate() *2) ));
		}
		else if (this._displayedx > 0) {
			//this._displayedx -= Math.ceil(Math.abs(Math.abs(this._displayedx) - 0) / (4 - (MapCursor._isAccelerate() *2)))
			if (this._displayedx - amount < 0) {
				this._displayedx = 0;
			} else {
				this._displayedx -= amount;
			}
		}
		
		if (this._displayedy < 0) {
			//this._displayedy += Math.ceil(Math.abs(Math.abs(this._displayedy) - 0) / (4 - (MapCursor._isAccelerate() *2)));
			if (this._displayedy + amount > 0) {
				this._displayedy = 0;
			} else {
				this._displayedy += amount;
			}
			
		}
		else if (this._displayedy > 0) {
			//this._displayedy -= Math.ceil(Math.abs(Math.abs(this._displayedy) - 0) / (4 - (MapCursor._isAccelerate() *2)));
			if (this._displayedy - amount < 0) {
				this._displayedy = 0;
			} else {
				this._displayedy -= amount;
			}
		}

		if (pic !== null) {
			pic.drawStretchParts(x, y, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, this._mapCursorSrcIndex * width, 0, width, height);
		}
		
		//this._scroller.drawScroller();
	}
	
	var alias3 = MapCursor._changeCursorValue;
    MapCursor._changeCursorValue = function(input) {
        cursorX = root.getCurrentSession().getMapCursorX();
        cursorY = root.getCurrentSession().getMapCursorY();
        var n = root.getCurrentSession().getMapBoundaryValue();
        
        if (root.isInputState(InputType.LEFT) && cursorX > 0 + n) {
            this._displayedx += GraphicsFormat.MAPCHIP_WIDTH;
        } else if (root.isInputState(InputType.RIGHT) && cursorX < CurrentMap.getWidth() - 1 - n) {
            this._displayedx -= GraphicsFormat.MAPCHIP_WIDTH;
        }
        if (root.isInputState(InputType.UP) && cursorY > 0 + n) {
            this._displayedy += GraphicsFormat.MAPCHIP_WIDTH;
        } else if (root.isInputState(InputType.DOWN) && cursorY < CurrentMap.getHeight() - 1 - n) {
            this._displayedy -= GraphicsFormat.MAPCHIP_WIDTH;
        }
        alias3.call(this,input);
    }
	
}) ();