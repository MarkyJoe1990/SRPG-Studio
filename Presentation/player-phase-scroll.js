/*
	Version 1.1
	Made by MarkyJoe1990
	
	* During phase change, the camera will smoothly scroll
	* over to the player team's leader.
*/

(function() {
	var alias8 = BaseTurnChange.enterTurnChangeCycle;
	BaseTurnChange.enterTurnChangeCycle = function() {
		this._prevX = root.getCurrentSession().getScrollPixelX();
		this._prevY = root.getCurrentSession().getScrollPixelY();
		this._destX = PlayerTurn._getDefaultCursorPos().x * 32 - (320);
		this._destY = PlayerTurn._getDefaultCursorPos().y * 32 - (240);
		this._timePassed = 0;
		
		//Get width of map in pixels
		var myMapWidth = root.getCurrentSession().getCurrentMapInfo().getMapWidth() * root.getMapChipWidth();
		var myMapHeight = root.getCurrentSession().getCurrentMapInfo().getMapHeight() * root.getMapChipHeight();
		
		//Make sure the camera doesn't go outside the map boundaries
		if (this._destX < 0) {
			this._destX = 0;
		}
		if (this._destY < 0) {
			this._destY = 0;
		}
		
		if (this._destX + root.getGameAreaWidth() > myMapWidth) {
			this._destX = myMapWidth - root.getGameAreaWidth();
		}
		if (this._destY + root.getGameAreaHeight() > myMapHeight) {
			this._destY = myMapHeight - root.getGameAreaHeight();
		}
		
		this._prepareMemberData();
		return this._completeMemberData();
		//alias8.call(this);
	}
	
	var alias9 = BaseTurnChange.drawTurnChangeCycle;
	BaseTurnChange.drawTurnChangeCycle = function() {
		//root.log(this._timePassed);
		if (root.getCurrentSession().getTurnType() == 0 && root.getChainEventCount() == 0) {
			limit = 38;
			var limiter = this._timePassed > limit ? limit : this._timePassed;
			
			diffX = this._destX - this._prevX;
			diffY = this._destY - this._prevY;
			animX = ((diffX/2) * (Math.cos(Math.PI*(limiter/limit)))) + (diffX/2);
			animY = ((diffY/2) * (Math.cos(Math.PI*(limiter/limit)))) + (diffY/2);
			
			this._prevX = this._destX - animX;
			this._prevY = this._destY - animY;
			
			root.getCurrentSession().SetScrollPixelX(this._prevX)
			root.getCurrentSession().SetScrollPixelY(this._prevY)
			this._timePassed++;
		}
		alias9.call(this);
	}
}) ();