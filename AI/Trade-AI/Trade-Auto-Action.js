//0 = cursor show
//1 = trade action

var TradeAutoAction = defineObject(BaseAutoAction, {
	setAutoActionInfo: function(unit, tradeInfo) {
		this._unit = unit;
		this._tradeInfo = tradeInfo;
	},
	
	enterAutoAction: function() {
		this._doTradeAction();
		this._notificationWindow = createObject(TradeNotificationWindow);
		this._notificationWindow.setTradeInfo(this._tradeInfo);
		this._autoActionCursor = createObject(AutoActionCursor);
		
		
		
		if (this.isSkipMode() || !this._isPosVisible()) {
			if (this._doTradeAction() === EnterResult.NOTENTER) {
				return EnterResult.NOTENTER;
			}
			
			this.changeCycleMode(1);
		}
		else {
			if (this._tradeInfo !== null) {
				this._autoActionCursor.setAutoActionPos(this._tradeInfo.x, this._tradeInfo.y, false);
			}
			else {
				this._autoActionCursor.setAutoActionPos(this._tradeInfo.destUnit.getMapX(), this._tradeInfo.destUnit.getMapY(), false);
			}
			
			this.changeCycleMode(0);
		}
		
		
		return EnterResult.OK;
	},
	
	_doTradeAction: function() {
		var destIndex = UnitItemControl.getIndexFromItem(this._tradeInfo.destUnit, this._tradeInfo.destItem);
		
		if (destIndex == -1) {
			return;
		}
		
		UnitItemControl.cutItem(this._tradeInfo.destUnit, destIndex);
		
		//If inventory is full...
		if (!UnitItemControl.pushItem(this._tradeInfo.srcUnit, this._tradeInfo.destItem)) {
			//Give target unit item in position 0
			var giveItem = UnitItemControl.cutItem(this._tradeInfo.srcUnit, 0);
			UnitItemControl.pushItem(this._tradeInfo.destUnit, giveItem);
			UnitItemControl.pushItem(this._tradeInfo.srcUnit, this._tradeInfo.destItem);
		}
		
		return EnterResult.OK;
		
		//root.msg(this._tradeInfo.destUnit.getName() + " gave " + this._tradeInfo.destItem.getName() + " to " + this._tradeInfo.srcUnit.getName());
	},
	
	moveAutoAction: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		if (mode === 0) {
			result = this._moveCurosrShow();
		}
		else if (mode === 1) {
			result = this._notificationWindow.moveWindow();
		}
		
		return result;
	},
	
	_moveCurosrShow: function() {
		if (this._autoActionCursor.moveAutoActionCursor() !== MoveResult.CONTINUE) {
			this.changeCycleMode(1);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_drawCurosrShow: function() {
		this._autoActionCursor.drawAutoActionCursor();
	},
	
	drawAutoAction: function() {
		var mode = this.getCycleMode();
		
		if (mode == 0) {
			this._drawCurosrShow();
		} else if (mode == 1) {
			this._drawWindow();
		}
	},
	
	_drawWindow: function() {
		var x = LayoutControl.getCenterX(-1, this._notificationWindow.getWindowWidth());
		var y = LayoutControl.getCenterY(-1, this._notificationWindow.getWindowHeight());
		
		this._notificationWindow.drawWindow(x, y);
	},
	
	_isPosVisible: function() {
		if (this._tradeInfo === null) {
			// If revive the unit, isInvisible returns true.
			if (this._tradeInfo.destUnit === null || this._tradeInfo.destUnit.isInvisible()) {
				return false;
			}
			
			if (!MapView.isVisible(this._tradeInfo.destUnit.getMapX(), this._tradeInfo.destUnit.getMapY())) {
				// If it doesn't exist within a range of showing on the map, cannot see even if the position is displayed.
				return false;
			}
		}
		
		return true;
	},
	
	isSkipMode: function() {
		return CurrentMap.isTurnSkipMode();
	},
	
	isSkipAllowed: function() {
		return true;
	}
});

AutoActionBuilder._pushTrade = function(unit, autoActionArray, combination) {
	
	var tradeQueue = combination.tradeQueue;
	
	var i, count = tradeQueue.length
	
	for (i = 0; i < count; i++) {
		var currentTradeInfo = tradeQueue[i];
		
		var autoAction = createObject(TradeAutoAction);
		
		autoAction.setAutoActionInfo(unit, currentTradeInfo);
		autoActionArray.push(autoAction);
	}
	
}