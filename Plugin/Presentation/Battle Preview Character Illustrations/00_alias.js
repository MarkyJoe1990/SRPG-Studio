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
    var alias1 = PosMenu.createPosMenuWindow;
    PosMenu.createPosMenuWindow = function (unit, item, type) {
        alias1.call(this, unit, item, type);
		this._counter = createObject(CycleCounter);
		this._counter.disableGameAcceleration();
		this._counter.setCounterInfo(8);
		this._isAnimationFinished = true;
		this._isEaseControl = typeof EaseControl != "undefined" && AnimationEasingConfig.enableBattlePreviewCharacterIllustrationSwipe;
    }

	var alias6 = PosMenu.changePosTarget;
	PosMenu.changePosTarget = function(unit) {
		var prevUnit = this._targetUnit;
		alias6.call(this, unit);

		if (prevUnit == null && unit != null) {
			this._counter.resetCounterValue();
			this._isAnimationFinished = false;
		}
	}
    
    var alias2 = PosMenu.drawWindowManager;
    PosMenu.drawWindowManager = function () {
		if (this._currentTarget != null) {
			var max = this._counter._max;
			var time = this._isAnimationFinished === true ? max : this._counter.getCounter();
			var percent = this._isEaseControl === true ? time / max : max;
			var myAlpha = 200;
			var startX, destX, diffX;
			var bottomDist = BattlePreviewCharIllustConfig.distanceFromBottom;
			var y;
			var borderDist = BattlePreviewCharIllustConfig.distanceFromBorder;
			var illustIndex = BattlePreviewCharIllustConfig.index;

			var charIllust1 = this._unit.getCharIllustImage(illustIndex);
			if (charIllust1 != null) {
				startX = 0 - charIllust1.getWidth();
				destX = borderDist;
				diffX = destX - startX;
				y = root.getGameAreaHeight() - charIllust1.getHeight() - bottomDist;

				charIllust1.setReverse(true);
				charIllust1.setAlpha(Math.floor(myAlpha * percent));
				x = this._isEaseControl === true ? EaseControl.easeOutQuad(time, startX, diffX, max) : destX;
				charIllust1.draw(x, y);
			}
			
			var charIllust2 = this._currentTarget.getCharIllustImage(illustIndex);
			if (charIllust2 != null) {
				startX = root.getGameAreaWidth();
				destX = startX - charIllust2.getWidth() - borderDist;
				diffX = destX - startX;
				x = this._isEaseControl === true ? EaseControl.easeOutQuad(time, startX, diffX, max) : destX;
				y = root.getGameAreaHeight() - charIllust2.getHeight() - bottomDist;

				charIllust2.setAlpha(Math.floor(myAlpha * percent));
				charIllust2.draw(x, y);
			}
		}
        
        alias2.call(this);
    }

	var alias3 = PosMenu.moveWindowManager;
	PosMenu.moveWindowManager = function() {
		if (this._isAnimationFinished !== true) {
			if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
				this._isAnimationFinished = true;
			}
		}

		return alias3.call(this);
	}

	// PosMenu.moveWindowManager is not normally
	// used... even though it's fully programmed.
	var alias5 = PosSelector.movePosSelector;
	PosSelector.movePosSelector = function() {
		if (this._posCursor != null) {
			this._posMenu.moveWindowManager();
		}

		return alias5.call(this);
	}
	
	var alias4 = PosMenu.getPositionWindowY;
	PosMenu.getPositionWindowY = function() {
		var illustIndex = BattlePreviewCharIllustConfig.index;
		if (this._unit.getCharIllustImage(illustIndex) != null || this._currentTarget.getCharIllustImage(illustIndex) != null) {
			return root.getGameAreaHeight() - this.getTotalWindowHeight() - BattlePreviewCharIllustConfig.windowDistanceFromBottom;
		}
		
		return alias4.call(this);
	}
}) ();