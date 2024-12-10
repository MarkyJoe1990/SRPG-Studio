/*
	Made by MarkyJoe1990
	
	This makes various command list menus swipe into view
	rather than just blinking instantly on screen.
	
	You can also set how many frames the swipe animation lasts
	and the speed at which the swipe happens. Just scroll down
	to where it says SWIPE_SPEED and SWIPE_LENGTH and set those
	values to whatever you like.
	
	This plugin overrides the original functions for:
	
	* BaseListCommandManager._drawTitle
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/

(function() {
	if (AnimationEasingConfig.enableCommandSmoothSwipe !== true) {
		return;
	}
	
	var alias2 = BaseListCommandManager.openListCommandManager;
	BaseListCommandManager.openListCommandManager = function() {
		alias2.call(this);
		this._counter = createObject(CycleCounter);
		this._counter.disableGameAcceleration();
		this._counter.setCounterInfo(8);
		this._isAnimationFinished = false;

		// Predetermine side where scrollbar comes from
		var x = this.getPositionX();
		var width = this._commandScrollbar.getScrollbarWidth();
		var centerX = x + Math.floor(width / 2);
		var screenCenterX = Math.floor(root.getGameAreaWidth() / 2);

		this._isLeft = centerX <= screenCenterX;
	}

	var alias4 = BaseListCommandManager.moveListCommandManager;
	BaseListCommandManager.moveListCommandManager = function() {
		if (this._isAnimationFinished !== true) {
			if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
				this._isAnimationFinished = true;
			}
		}

		return alias4.call(this);
	}
	
	var alias3 = BaseListCommandManager._drawTitle;
	BaseListCommandManager._drawTitle = function () {
		if (EnvironmentControl.isMouseOperation() && EnvironmentControl.isMouseCursorTracking()) {
			alias3.call(this);
			return;
		}

		var x = this.getPositionX();
		var y = this.getPositionY();

		var width = this._commandScrollbar.getScrollbarWidth();
		var gameWidth = root.getGameAreaWidth();
		var startX = this._isLeft === true ? 0 - width : gameWidth;
		var diffX = x - startX;
		var max = this._counter._max;
		var time = this._isAnimationFinished === true ? max : this._counter.getCounter();

		this._commandScrollbar.drawScrollbar(EaseControl.easeOutQuad(time, startX, diffX, max), y);
	}
}) ();