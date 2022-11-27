/*
	Version 1.0
	Made by MarkyJoe1990
	
	When you check a unit's stats, the windows will swipe
	in instead of just appearing.
	
	This plugin overrides the original functions for:
	
	* UnitMenuScreen.drawScreenCycle
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
*/

(function () {
	
	var alias1 = UnitMenuScreen.setScreenData;
	UnitMenuScreen.setScreenData = function(screenParam) {
		alias1.call(this, screenParam);
		this._timePassed = 0;
		this._timeMax = 6;
		this._timeDifference = this._timeMax - this._timePassed;
	}
	
	var alias2 = UnitMenuScreen.moveScreenCycle;
	UnitMenuScreen.moveScreenCycle = function() {
		
		if (this._timePassed < this._timeMax) {
			this._timePassed++;
		}
		this._timeDifference = this._timeMax - this._timePassed;
		
		return alias2.call(this);
	}
	
	UnitMenuScreen.drawScreenCycle = function() {
		var x, y;
		var index = this._activePageIndex;
		var width = this._topWindow.getWindowWidth();
		var topHeight = this._topWindow.getWindowHeight();
		var bottomHeight = this._bottomWindowArray[index].getWindowHeight();
		var interval = DefineControl.getWindowInterval();

		
		if (this._isUnitSentenceVisible()) {
			x = LayoutControl.getCenterX(-1, width + this._unitSentenceWindow.getWindowWidth());
		}
		else {
			x = LayoutControl.getCenterX(-1, width);
		}
		y = LayoutControl.getCenterY(-1, topHeight + bottomHeight + interval);
		
		this._topWindow.drawWindow(x, y - (30 * this._timeDifference));
		if (this._isUnitSentenceVisible()) {
			this._unitSentenceWindow.drawWindow(x + width + (30 * this._timeDifference), y);
		}
		this._bottomWindowArray[index].drawWindow(x - (30 * this._timeDifference), y + topHeight + interval);
		
		//charIllust = this._unit.getCharIllustImage(0);
		//if (charIllust != null) {
		//	clockMotion = 20 * (this._timeMax - this._timePassed);
		//	charIllust.draw(root.getWindowWidth() - charIllust.getWidth() + clockMotion, root.getWindowHeight() - charIllust.getHeight());
		//}
		
		 //this._pageChanger.drawPage cannot be called after this._topWindow.drawWindow.
		 //If it's done, scroll cursor is displayed over the item window.
		 //For _setMenuData, by calling setDrawingMethod, the cursor is drawn before that.
	}
}) ();