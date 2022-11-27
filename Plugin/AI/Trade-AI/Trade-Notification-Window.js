var TradeNotificationWindow = defineObject(BaseWindow, {
	_tradeInfo: null,
	_soundPlayed: false,
	
	setTradeInfo: function(tradeInfo) {
		this._tradeInfo = tradeInfo;
	},
	
	moveWindow: function() {
		if (!this._soundPlayed) {
			this._soundPlay();
			this._soundPlayed = true;
		}
		
		if (InputControl.isSelectAction() || Miscellaneous.isGameAcceleration() || CurrentMap.isTurnSkipMode()) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		var srcUnit = this._tradeInfo.srcUnit;
		var destUnit = this._tradeInfo.destUnit;
		var destItem = this._tradeInfo.destItem;
		
		var rangeWidth = this.getWindowWidth() - (this.getWindowXPadding() * 2);
		var rangeHeight = this.getWindowHeight() - (this.getWindowYPadding() * 2);
		
		var range = createRangeObject(x, y, rangeWidth, rangeHeight);
		
		TextRenderer.drawRangeText(range, TextFormat.CENTER, srcUnit.getName() + " recieved a " + destItem.getName() + " from " + destUnit.getName() + "!", -1, color, font);
	},
	
	_soundPlay: function() {
		MediaControl.soundPlay(root.querySoundHandle("itemget"))
	},
	
	getWindowWidth: function() {
		return 350;
	},
	
	getWindowHeight: function() {
		return 75;
	}
});