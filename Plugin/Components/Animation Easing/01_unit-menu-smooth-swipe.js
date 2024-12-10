/*
	Version 2.0
	Made by MarkyJoe1990
	
	When you check a unit's stats, the windows will swipe
	in instead of just appearing.
	
	This plugin overrides the original functions for:
	
	* UnitMenuScreen.drawScreenCycle
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
*/

(function () {
	if (AnimationEasingConfig.enableUnitMenuSmoothSwipe !== true) {
		return;
	}
	
	var alias1 = UnitMenuScreen.setScreenData;
	UnitMenuScreen.setScreenData = function(screenParam) {
		alias1.call(this, screenParam);
		this._counter = createObject(CycleCounter);
		this._counter.disableGameAcceleration();
		this._counter.setCounterInfo(8);
		this._time = 0;
		this._isAnimationOver = false;
	}
	
	var alias2 = UnitMenuScreen.moveScreenCycle;
	UnitMenuScreen.moveScreenCycle = function() {
		if (this._isAnimationOver !== true) {
			if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
				this._isAnimationOver = true;
				this._time = this._counter._max;
			} else {
				this._time = this._counter.getCounter();
			}
		}

		return alias2.call(this);
	}
	
	UnitMenuScreen.drawScreenCycle = function() {
		var x, y;
		var index = this._activePageIndex;
		var width = this._topWindow.getWindowWidth();
		var topHeight = this._topWindow.getWindowHeight();
		var bottomHeight = this._bottomWindowArray[index].getWindowHeight();
		var interval = DefineControl.getWindowInterval();

		var time = this._time;
		var max = this._counter._max;

		if (this._isUnitSentenceVisible()) {
			x = LayoutControl.getCenterX(-1, width + this._unitSentenceWindow.getWindowWidth());
		}
		else {
			x = LayoutControl.getCenterX(-1, width);
		}
		y = LayoutControl.getCenterY(-1, topHeight + bottomHeight + interval);

		var startY = 0 - this._topWindow.getWindowHeight();
		var diffY = y - startY;

		var startX, diffX;

		this._topWindow.drawWindow(x, EaseControl.easeOutQuad(time, startY, diffY, max));
		if (this._isUnitSentenceVisible()) {
			startX = root.getGameAreaWidth();
			diffX = (x + width) - startX;

			this._unitSentenceWindow.drawWindow(EaseControl.easeOutQuad(time, startX, diffX, max), y);
		}

		startX = 0 - this._bottomWindowArray[index].getWindowWidth();
		diffX = x - startX;

		this._bottomWindowArray[index].drawWindow(EaseControl.easeOutQuad(time, startX, diffX, max), y + topHeight + interval);

		// this._pageChanger.drawPage cannot be called after this._topWindow.drawWindow.
		// If it's done, scroll cursor is displayed over the item window.
		// For _setMenuData, by calling setDrawingMethod, the cursor is drawn before that.
	}
}) ();