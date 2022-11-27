var NotificationObject = defineObject(BaseObject, {
	_message: null,
	_timePassed: 0,
	_canvas: null,
	
	setUp: function(message) {
		this._message = message;
		this._timePassed = 0;
		this._canvas = root.getGraphicsManager().getCanvas();
	},
	
	moveNotification: function() {
		if (this._timePassed == 0) {
			this.playNotificationSound();
		}
		
		var result = MoveResult.CONTINUE;
		if (this._timePassed >= 200) {
			result = MoveResult.END;
		}
		
		this._timePassed++;
		return result;
	},
	
	drawNotification: function(x, y) {
		var range = {
			width: this.getWidth(),
			height: this.getHeight()
		}
		range.x = x; //Math.floor(root.getWindowWidth() / 2) - Math.floor(range.width / 2);
		range.y = y; //400;

		var color = 0xFFFFFF
		var font = root.queryTextUI("default_window").getFont();
		
		this._canvas.setFillColor(0x001155, 128);
		this._canvas.drawRoundedRectangle(range.x, range.y, range.width, range.height, 5, 5);
		TextRenderer.drawRangeText(range, TextFormat.CENTER, this._message, -1, color, font);
		
	},
	
	playNotificationSound: function() {
		root.getMediaManager().soundPlay(root.createResourceHandle(true, 61, 0, 0, 0), 50);
		
	},
	
	getWidth: function() {
		return 200;
	},
	
	getHeight: function() {
		return 32;
	},
	
	getSpaceY: function() {
		return 8;
	},
	
	getSpaceX: function() {
		return 8;
	}
});