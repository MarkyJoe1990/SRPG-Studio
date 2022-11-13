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
	
	//Higher SWIPE_SPEED makes the swipe more fierce. Lower makes the swipe less fierce
	var SWIPE_SPEED = 3;
	
	//Higher SWIPE_LENGTH makes the animation take longer before it stops entirely
	var SWIPE_LENGTH = 10;
	
	var alias2 = BaseListCommandManager.openListCommandManager;
	BaseListCommandManager.openListCommandManager = function() {
		this._timePassed = 0;
		alias2.call(this);
	}
	
	var alias3 = BaseListCommandManager._drawTitle;
	BaseListCommandManager._drawTitle = function () {
		if (EnvironmentControl.isMouseOperation() && EnvironmentControl.isMouseCursorTracking()) {
			alias3.call(this);
			return;
		}

		var x = this.getPositionX();
		var y = this.getPositionY();
		
		if (this._timePassed < SWIPE_LENGTH) {
			this._timePassed++;
		}
		thing1 = SWIPE_LENGTH * SWIPE_SPEED;
		thing2 = SWIPE_LENGTH / this._timePassed;
		doop = x - (thing1 * thing2) + thing1;
		this._commandScrollbar.drawScrollbar(doop, y);
	}
}) ();