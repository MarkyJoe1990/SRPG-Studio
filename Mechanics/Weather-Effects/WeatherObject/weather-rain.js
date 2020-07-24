var WeatherRain = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-5,-4));
		this.setVelocityY(this.randomNumber(15,20));
		this.setX(this.randomNumber(range.x1,range.x2));
		this.setY(range.y1);
	},
	
	getBox: function() {
		return {
			x1: this.getImageParts().width * -1,
			y1: this.getImageParts().height * -1,
			x2: root.getWindowWidth() + 128,
			y2: root.getWindowHeight()
		}
	},
	
	setSpecialImageProperties: function() {
		this._image.setAlpha(128);
	},
	
	specialEffect: function() {
		var width = root.getWindowWidth();
		var height = root.getWindowHeight();
		var alpha = 32;
		
		root.getGraphicsManager().fillRange(0, 0, width, height, 0x0000FF, alpha);
	},
	
	getName: function() {
		return "Rain";
	}
});