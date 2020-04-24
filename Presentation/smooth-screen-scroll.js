/*
	Version 1.1
	Made by MarkyJoe1990
	
	This makes the map screen scroll smoothly when you are using a keyboard
	While this does not apply to enemies, the game already has a config
	option that allows it for them. Look for "Scroll Speed" and set it to
	normal or slow.
	
	This plugin overrides the original functions for:
	
	* MapView.setScrollPixel
	* MouseControl._checkSideScroll
	* MapLineScroll.startLineScroll
	* MapLineScroll._setLinePos
	* LocationFocusEventCommand._checkFocusPos
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/
(function() {
	var SmoothScroll = {
		destX : 0,
		destY : 0,
		prevX : 0,
		prevY : 0
	}
	//First, we need to override the functions that scroll the screen in a shitty way
	//This function here happens after turn phase thingy
	//It's also called whenever you use the keyboard to move your cursor
	var alias1 = MapView.setScrollPixel;
	MapView.setScrollPixel = function(xPixel, yPixel) {
		//root.log("START: MapView.setScrollPixel");
		var pos = this.getScrollPixelPos(xPixel, yPixel);
		var session = root.getCurrentSession();
		var xScrollPrev = session.getScrollPixelX();
		var yScrollPrev = session.getScrollPixelY();
		
		if (session.getTurnType() == 0 && root.getChainEventCount() == 0) {
			//root.log("FUCK");
			SmoothScroll.destX = pos.x;
			SmoothScroll.destY = pos.y;
		}
		else {
			session.setScrollPixelX(pos.x)
			session.setScrollPixelY(pos.y)
		}
		
		return xScrollPrev !== pos.x || yScrollPrev !== pos.y;
	}
	
	//This happens whenever you move your mouse
	alias2 = MouseControl._checkSideScroll;
	MouseControl._checkSideScroll = function() {
		//root.log("Moves when mouse moves: MouseControl._checkSideScroll");
		var n = -1;
		var session = root.getCurrentSession();
		var mx = root.getMouseX() - root.getViewportX();
		var my = root.getMouseY() - root.getViewportY();
		var sx = session.getScrollPixelX();
		var sy = session.getScrollPixelY();
		var cx = (CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH) - root.getGameAreaWidth();
		var cy = (CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT) - root.getGameAreaHeight();
		
		if (mx <= GraphicsFormat.MAPCHIP_WIDTH) {
			if (sx > 0) {
				n = sx - Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
				if (n < 0) {
					n = 0;
				}
				if (session.getTurnType() == 0 && root.getChainEventCount() == 0) {
					SmoothScroll.destX = n;
				}
				else {
					session.setScrollPixelX(n);
				}
			}
			else {
				this._isSideScrollX = false;
			}
		}
		else if (mx >= root.getGameAreaWidth() - GraphicsFormat.MAPCHIP_WIDTH) {
			if (sx !== cx) {
				n = sx + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
				if (n > cx) {
					n = cx;
				}
				if (session.getTurnType() == 0 && root.getChainEventCount() == 0) {
					SmoothScroll.destX = n;
				}
				else {
					session.setScrollPixelX(n);
				}
			}
			else {
				this._isSideScrollX = false;
			}
		}
		else {
			this._isSideScrollX = false;
		}
		
		if (my <= GraphicsFormat.MAPCHIP_HEIGHT) {
			if (sy > 0) {
				n = sy - Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
				if (n < 0) {
					n = 0;
				}
				if (session.getTurnType() == 0 && root.getChainEventCount() == 0) {
					SmoothScroll.destY = n;
				}
				else {
					session.setScrollPixelY(n);
				}
			}
			else {
				this._isSideScrollY = false;
			}
		}
		else if (my >= root.getGameAreaHeight() - GraphicsFormat.MAPCHIP_HEIGHT) {
			if (sy !== cy) {
				n = sy + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
				if (n > cy) {
					n = cy;
				}
				if (session.getTurnType() == 0 && root.getChainEventCount() == 0) {
					SmoothScroll.destY = n;
				}
				else {
					session.setScrollPixelY(n);
				}
			}
			else {
				this._isSideScrollY = false;
			}
		}
		else {
			this._isSideScrollY = false;
		}
		
		if (this._isSideScrollX || this._isSideScrollY) {
			this._adjustMapCursor();
		}
	}
	
	//Then... Uh... You make the game do the map stuff
	//This function happens when the map loads, and when you start the map
	var alias3 = MapCursor.initialize;
	MapCursor.initialize = function() {
		//root.log("Current Scene Type: " + root.getCurrentScene());
		if (root.getCurrentScene() != SceneType.REST) {
			SmoothScroll.destX = root.getCurrentSession().getScrollPixelX();
			SmoothScroll.prevX = root.getCurrentSession().getScrollPixelX();
			SmoothScroll.destY = root.getCurrentSession().getScrollPixelY();
			SmoothScroll.prevY = root.getCurrentSession().getScrollPixelY();
		}
		
		alias3.call(this);
	}
	
	//This function occurs when the cursor needs to be drawn
	//Happens every frame
	var alias4 = MapCursor.drawCursor;
	MapCursor.drawCursor = function() {
		alias4.call(this);
		//root.log("Fuck2");
		//root.log(this._prevX);
		//root.log(this._destX);
		//root.log((GraphicsFormat.MAPCHIP_WIDTH));
		if (SmoothScroll.prevY < SmoothScroll.destY) {
			SmoothScroll.prevY = SmoothScroll.prevY + (GraphicsFormat.MAPCHIP_WIDTH / 4) + (MapCursor._isAccelerate()*Math.round(GraphicsFormat.MAPCHIP_WIDTH *.75));
		}
		if (SmoothScroll.prevY > SmoothScroll.destY) {
			SmoothScroll.prevY = SmoothScroll.prevY - (GraphicsFormat.MAPCHIP_WIDTH / 4) - (MapCursor._isAccelerate()*Math.round(GraphicsFormat.MAPCHIP_WIDTH *.75));
		}
		if (SmoothScroll.prevX < SmoothScroll.destX) {
			SmoothScroll.prevX = SmoothScroll.prevX + (GraphicsFormat.MAPCHIP_WIDTH / 4) + (MapCursor._isAccelerate()*Math.round(GraphicsFormat.MAPCHIP_WIDTH *.75));
		}
		if (SmoothScroll.prevX > SmoothScroll.destX) {
			SmoothScroll.prevX = SmoothScroll.prevX - (GraphicsFormat.MAPCHIP_WIDTH / 4) - (MapCursor._isAccelerate()*Math.round(GraphicsFormat.MAPCHIP_WIDTH *.75));
		}
		if (SmoothScroll.prevX < 0) {
			SmoothScroll.prevX = 0;
		}
		if (SmoothScroll.prevY < 0) {
			SmoothScroll.prevY = 0;
		}
		
		//root.log(SmoothScroll.prevX);
		//root.log(SmoothScroll.prevY);
		
		//Finally, do the smooth scrolling
		//THIS IS WHAT'S FUCKING YOU UP
		if (root.getCurrentSession().getTurnType() == 0 && root.getChainEventCount() == 0) {
			root.getCurrentSession().setScrollPixelX(SmoothScroll.prevX);
			root.getCurrentSession().setScrollPixelY(SmoothScroll.prevY);
		}
	}

	var alias5 = MapLineScroll.startLineScroll;
	MapLineScroll.startLineScroll = function(x, y) {
		//root.log("Fuck3");
		var x1, y1, x2, y2;
		var session = root.getCurrentSession();
		
		if (session === null) {
			return;
		}
		
		if (EnvironmentControl.getScrollSpeedType() === SpeedType.HIGH) {
			MapView.setScroll2(x, y);
			return;
		}
		
		x1 = session.getScrollPixelX() + Math.floor(root.getGameAreaWidth() / 2);
		y1 = session.getScrollPixelY() + Math.floor(root.getGameAreaHeight() / 2);
		x2 = (x * GraphicsFormat.MAPCHIP_WIDTH) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
		y2 = (y * GraphicsFormat.MAPCHIP_HEIGHT) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
		
		//This makes the scrolling twitch on the start of player phase.
		//Might cause issues. Not sure.
		//this.setGoalData(x1, y1, x2, y2);
	}

	var alias6 = MapLineScroll._setLinePos;
	MapLineScroll._setLinePos = function(pos) {
		//root.log("monkey");
		SmoothScroll.prevX = root.getCurrentSession().getScrollPixelX();
		SmoothScroll.prevY = root.getCurrentSession().getScrollPixelY();
		//root.log("POS.X: " + pos.x + ", POS.Y: " + pos.y);
		return MapView.setScrollPixel2(pos.x, pos.y);
	}
	
	var alias7 = LocationFocusEventCommand._checkFocusPos;
	LocationFocusEventCommand._checkFocusPos = function(pos) {
		//root.log("fuut");
		this._focusCursor.setPos(pos.x, pos.y);
		MapView.setScroll2(pos.x, pos.y);
	}
	
	MapView.setScroll2 = function(x, y) {
		//root.log("MAPPY");
		return this.setScrollPixel2(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT);
	}
	
	MapView.setScrollPixel2 = function(xPixel, yPixel) {
		//root.log("butt");
		var pos = this.getScrollPixelPos(xPixel, yPixel);
		var session = root.getCurrentSession();
		var xScrollPrev = session.getScrollPixelX();
		var yScrollPrev = session.getScrollPixelY();
		session.setScrollPixelX(pos.x);
		session.setScrollPixelY(pos.y);

		return xScrollPrev !== pos.x || yScrollPrev !== pos.y;
	}
	
}) ();