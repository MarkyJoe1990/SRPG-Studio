/*
	Version 1.0
	Made by MarkyJoe1990
	
	This is a scrolling object meant to handle map scrolling
	when the player has control of the cursor. It only works
	if you have smooth-map-scroll.js in your plugins as well.
*/

var MarkyJoeScroller = defineObject(BaseObject, {
	_prevX: null,
	_prevY: null,
	_goalX: null,
	_goalY: null,
	
	initialize: function() {
	},
	
	moveScroller: function() {
		if (this._coordinatesDefined()) {
			var session = root.getCurrentSession();
			
			if (this._prevX < this._goalX) {
				this._prevX += Math.ceil(Math.abs(Math.abs(this._prevX) - Math.abs(this._goalX)) / 4);
			} else if (this._prevX > this._goalX) {
				this._prevX -= Math.ceil(Math.abs(Math.abs(this._prevX) - Math.abs(this._goalX)) / 4);
			}
			
			if (this._prevY < this._goalY) {
				this._prevY += Math.ceil(Math.abs(Math.abs(this._prevY) - Math.abs(this._goalY)) / 4);
			} else if (this._prevY > this._goalY) {
				this._prevY -= Math.ceil(Math.abs(Math.abs(this._prevY) - Math.abs(this._goalY)) / 4);
			}
			
			session.setScrollPixelX(this._prevX);
			session.setScrollPixelY(this._prevY);
			
			//Turn off scroll
			if (this._prevX == this._goalX && this._prevY == this._goalY) {
				this.resetScroller();
			}
		}
	},
	
	drawScroller: function() {
		var font = root.queryTextUI("default_window").getFont();
		TextRenderer.drawText(16, 16, "goalX: " + this._goalX, -1, 0xFFFFFF, font);
		TextRenderer.drawText(16, 32, "goalY: " + this._goalY, -1, 0xFFFFFF, font);
		TextRenderer.drawText(16, 48, "prevX: " + this._prevX, -1, 0xFFFFFF, font);
		TextRenderer.drawText(16, 64, "prevY: " + this._prevY, -1, 0xFFFFFF, font);
	},
	
	setScroll: function (x, y) {
		return this.setScrollPixel(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT);
	},
	
	setScrollPixel: function (x, y) {
		//Previous Location
		var pos = MapView.getScrollPixelPos(x, y);
		var session = root.getCurrentSession();
		this._prevX = session.getScrollPixelX();
		this._prevY = session.getScrollPixelY();
		
		var mapWidthPixel = CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH;
		var boundaryX = mapWidthPixel - root.getGameAreaWidth();
		var mapHeightPixel = CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
		var boundaryY = mapHeightPixel - root.getGameAreaHeight();
		
		var boundaryLeft = Math.floor(root.getGameAreaWidth() / 2) - Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
		var boundaryTop = Math.floor(root.getGameAreaHeight() / 2) - Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
		
		//Destination
		this._goalX = x - boundaryLeft;
		this._goalY = y - boundaryTop;
		
		if (this._goalX > boundaryX) {
			this._goalX = boundaryX;
		} else if (this._goalX < 0) {
			this._goalX = 0;
		}
		if (this._goalY > boundaryY) {
			this._goalY = boundaryY;
		} else if (this._goalY < 0) {
			this._goalY = 0;
		}
		
		return this._prevX !== pos.x || this._prevY !== pos.y;
	},
	
	forceSetScroll: function (x, y) {
		this.forceSetScrollPixel(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT);
	},
	
	forceSetScrollPixel: function(x, y) {
		var session = root.getCurrentSession();
		this._prevX = session.getScrollPixelX();
		this._prevY = session.getScrollPixelY();
		this._goalX = x;
		this._goalY = y;
	},
	
	resetScroller: function() {
		this._prevX = null;
		this._prevY = null;
		this._goalX = null;
		this._goalY = null;
	},
	
	_coordinatesDefined: function() {
		if (this._goalX != null && this._goalY != null && this._prevX != null && this._prevY != null) {
			return true;
		}
		return false;
	}
});