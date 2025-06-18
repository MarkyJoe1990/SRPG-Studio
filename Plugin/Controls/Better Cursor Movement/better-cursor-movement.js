/*
	Version 3.0
	Made by MarkyJoe1990
	
	This plugin improves the controls for the in-game cursor
	when using a gamepad or keyboard. It allows for diagonals
	and will not move an extra space if you let go of
	one of the two buttons too early.

	In addition, this plugin makes the cursor "slide" into
	the tile it is moving to, as opposed to snapping to it.

	This plugin overrides the original functions for:
	
	* MapCursor.moveCursor
	* MapCursor.drawCursor
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/

(function () {
	
	//Setting direction inputs as bitwise numbers
	//Allows us to detect diagonals as input.
	var InputBinary = {
		NONE: 0x00,
		LEFT: 0x01,
		UP: 0x02,
		RIGHT: 0x04,
		DOWN: 0x08
	}
	
	var alias1 = MapCursor.initialize;
	MapCursor.initialize = function() {
		this._displayedx = 0;
		this._displayedy = 0;
		
		alias1.call(this);
	}
	
	//Overwrites original
	MapCursor.moveCursor = function() {
		var inputBinary;
		
		this.moveCursorAnimation();
		
		inputBinary = this._getDirectionInputType2();
		if (inputBinary === InputBinary.NONE) {
			MouseControl.moveMapMouse(this);
			return inputBinary;
		}
		
		this._changeCursorValue2(inputBinary);
		
		return inputBinary;
	}

	var alias2 = MapCursor.moveCursorAnimation;
	MapCursor.moveCursorAnimation = function() {
		// Cursor Sliding
		var amount = Math.floor(GraphicsFormat.MAPCHIP_WIDTH / (this._isAccelerate() ? 2 : 4));
		if (this._displayedx < 0 ) {
			if (this._displayedx + amount > 0) {
				this._displayedx = 0;
			} else {
				this._displayedx += amount;
			}
			
		} else if (this._displayedx > 0) {
			if (this._displayedx - amount < 0) {
				this._displayedx = 0;
			} else {
				this._displayedx -= amount;
			}
		}
		
		if (this._displayedy < 0) {
			if (this._displayedy + amount > 0) {
				this._displayedy = 0;
			} else {
				this._displayedy += amount;
			}
			
		} else if (this._displayedy > 0) {
			if (this._displayedy - amount < 0) {
				this._displayedy = 0;
			} else {
				this._displayedy -= amount;
			}
		}

		return alias2.call(this);
	}
	
	// Overwrites original
	// Simply adds displayed x and y to formula.
	MapCursor.drawCursor = function() {
		var session = root.getCurrentSession();
		var width = UIFormat.MAPCURSOR_WIDTH / 2;
		var height = UIFormat.MAPCURSOR_HEIGHT;
		var x = (session.getMapCursorX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX() + this._displayedx;
		var y = (session.getMapCursorY() * GraphicsFormat.MAPCHIP_HEIGHT) - session.getScrollPixelY() + this._displayedy;
		var pic = this._getCursorUI();

		if (pic !== null) {
			pic.drawStretchParts(x, y, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, this._mapCursorSrcIndex * width, 0, width, height);
		}
	}
	
	//New function
	MapCursor._getDirectionInputType2 = function() {
		var InputBinary;
	
		if (!this._isInputEnabled) {
			return InputBinary.NONE;
		}
		
		if (this._isAccelerate()) {
			InputBinary = InputControl.getDirectionStateHigh2();
		}
		else {
			InputBinary = InputControl.getDirectionState2();
		}
		
		return InputBinary;
	}
	
	//New function
	MapCursor._changeCursorValue2 = function(input) {
		var session = root.getCurrentSession();
		var xCursor = session.getMapCursorX();
		var yCursor = session.getMapCursorY();
		var n = root.getCurrentSession().getMapBoundaryValue();
		
		var xPressed = false;
		var yPressed = false;
		
		if (input & InputBinary.LEFT) {
			xCursor--;
			xPressed = true;
			this._displayedx += GraphicsFormat.MAPCHIP_WIDTH;
		} else if (input & InputBinary.RIGHT) {
			xCursor++;
			xPressed = true;
			this._displayedx -= GraphicsFormat.MAPCHIP_WIDTH;
		}
		if (input & InputBinary.UP) {
			yCursor--;
			yPressed = true;
			this._displayedy += GraphicsFormat.MAPCHIP_HEIGHT;
		} else if (input & InputBinary.DOWN) {
			yCursor++;
			yPressed = true;
			this._displayedy -= GraphicsFormat.MAPCHIP_HEIGHT;
		}
		
		if (xCursor < n) {
			xCursor = n;
			xPressed = false;
			this._displayedx = 0;
		} else if (xCursor > CurrentMap.getWidth() - 1 - n) {
			xCursor = CurrentMap.getWidth() - 1 - n;
			xPressed = false;
			this._displayedx = 0;
		}
		
		if (yCursor < n) {
			yCursor = n;
			yPressed = false;
			this._displayedy = 0;
		}
		else if (yCursor > CurrentMap.getHeight() - 1 - n) {
			yCursor = CurrentMap.getHeight() - 1 - n;
			yPressed = false;
			this._displayedy = 0;
		}
		
		if (xPressed || yPressed) {
			// A cursor was moved, so play a sound.
			this._playMovingSound();
		}
		
		if (CameraPanConfig.enableMouseMovementPan === true) {
			this._cameraPan.setDestinationTileCenter(xCursor, yCursor);
			this._cameraPan.setTimeMethod(CameraPanControl.mouseTimeMethod);
			this._cameraPan.setEaseMethod(CameraPanControl.mouseEaseMethod);
			this._cameraPan.startCameraPan();
		} else {
			MapView.setScroll(xCursor, yCursor);
		}
		
		session.setMapCursorX(xCursor);
		session.setMapCursorY(yCursor);
	}

	// If your speed up key also speeds the mouse,
	// this alias function prevents it from moving
	// faster than intended.
	var alias4 = InputControl.initSingleton;
	InputControl.initSingleton = function() {
		alias4.call(this);
		this._counterHigh.disableGameAcceleration();
	};
	
	//New function
	InputControl.getDirectionState2 = function() {
		var inputBinary;
		var result = InputBinary.NONE;
		
		inputBinary = this.getInputBinary();
		
		// Check if the current state is no input.
		if (inputBinary === InputBinary.NONE) {
			this._prevInputType = inputBinary;
			this._isWait = false;
			return inputBinary;
		}

		if (this._prevInputType === -1) {
			this._prevInputType = InputBinary.NONE;
		}
		
		// Check if the previous state is no input, or the current input differs from the previous one.
		if (inputBinary !== this._prevInputType || this._prevInputType === InputBinary.NONE) {
			// Check if the current input is a diagonal that relates to the previous input
			if (inputBinary > this._prevInputType) {
				if ((inputBinary & this._prevInputType) !== 0) {
					var newInput = this._prevInputType ^ inputBinary;
				} else {
					var newInput = inputBinary;
				}
			} else {
				if ((inputBinary & this._prevInputType) !== 0) {
					var newInput = InputBinary.NONE;
				} else {
					var newInput = inputBinary;
				}
			}
			
			this._prevInputType = inputBinary; // 1 9 1
			
			if (inputBinary & this._prevInputType) {
				this._isWait = true;
			}
			
			this._counter.resetCounterValue();
			this._blanckCounter.resetCounterValue();
			return newInput;
		}
		
		// Current input and previous input are identical.
		// It means that the key is continuously pressed.
		
		if (this._isWait) {
			if (this._blanckCounter.moveCycleCounter() !== MoveResult.CONTINUE) {
				this._isWait = false;
			}
		}
		else {
			if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
				// Allow to input.
				result = inputBinary;
			}
		}
		
		return result;
	}

	//New function
	InputControl.getDirectionStateHigh2 = function() {
		var inputBinary = InputBinary.NONE;
		
		if (DataConfig.isHighPerformance()) {
			if (this._counterHigh.moveCycleCounter() !== MoveResult.CONTINUE) {
				inputBinary = this.getInputBinary();
			}
		}
		else {
			inputBinary = this.getInputBinary();
		}
		
		return inputBinary;
	}
	
	//New function
	InputControl.getInputBinary = function() {
		var inputBinary = InputBinary.NONE;
		
		if (root.isInputState(InputType.LEFT)) {
			inputBinary |= InputBinary.LEFT;
		} else if (root.isInputState(InputType.RIGHT)) {
			inputBinary |= InputBinary.RIGHT;
		}
		
		if (root.isInputState(InputType.UP)) {
			inputBinary |= InputBinary.UP;
		} else if (root.isInputState(InputType.DOWN)) {
			inputBinary |= InputBinary.DOWN;
		}
			
		return inputBinary;
	}
}) ();