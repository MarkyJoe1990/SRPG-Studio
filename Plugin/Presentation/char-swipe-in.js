/*
	Made by MarkyJoe1990
	
	If yours or the enemy's character has a character illustration,
	it will swipe in on the battle preview window. If neither of
	you have a character illustration, the battle preview
	will act as it normally does.
	
	You can set which character illustration is used for the battle
	preview by scrolling down to ILLUST_TO_USE and setting it to
	whatever value you like.
	
	This plugin overrides the original functions for:
	
	* PosMenu.getPositionWindowY
	
	Be weary of any new plugins that change these two functions, as they
	might not be compatible with this plugin.
*/
(function() {
	
	ILLUST_TO_USE = 0;
	
    var alias1 = PosMenu.createPosMenuWindow;
    PosMenu.createPosMenuWindow = function (unit, item, type) {
        this._timePassed = 0;
        alias1.call(this, unit, item, type);
    }
    
    var alias2 = PosMenu.drawWindowManager;
    PosMenu.drawWindowManager = function () {
		//root.log();
		if (root.getExternalData().env.forecastBusts == 0) {
			var distance = 40
			var myAlpha = 200
			
			if (this._currentTarget != null) {
				
				if (this._timePassed < 10) {
					this._timePassed++;
				}
				
				var charIllust1 = this._unit.getCharIllustImage(ILLUST_TO_USE);
				if (charIllust1 != null) {
					charIllust1.setReverse(true);
					charIllust1.setAlpha(myAlpha - (myAlpha / this._timePassed) + 20);
					
					charIllust1.draw((0 - distance) - (200 / this._timePassed) + 20, 80);
				}
				
				var charIllust2 = this._currentTarget.getCharIllustImage(ILLUST_TO_USE);
				if (charIllust2 != null) {
					charIllust2.setAlpha(myAlpha - (myAlpha / this._timePassed) + 20);
					charIllust2.draw((root.getWindowWidth() - charIllust2.getWidth() + distance) + (200 / this._timePassed) - 20, 80);
				}
			}
			else {
				this._timePassed = 0;
			}
		}
        
        alias2.call(this);
    }
	
	alias3 = PosMenu.getPositionWindowY;
	PosMenu.getPositionWindowY = function() {
		
		if (this._unit.getCharIllustImage(ILLUST_TO_USE) == null && 
		this._currentTarget.getCharIllustImage(ILLUST_TO_USE) == null) {
			return Miscellaneous.getDyamicWindowY(this._unit, this._currentTarget, this._posWindowLeft.getWindowHeight());
		}
		else {
			return 295;
		}
	}
}) ();