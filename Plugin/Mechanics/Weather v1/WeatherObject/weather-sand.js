var WeatherSand = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-20,-15));
		this.setVelocityY(this.randomNumber(-1,1));
		
		this.setX(range.x2);
		this.setY(this.randomNumber(range.y1, range.y2));
	},
	
	specialEffect: function() {
		var width = root.getWindowWidth();
		var height = root.getWindowHeight();
		var alpha = 32;
		
		root.getGraphicsManager().fillRange(0, 0, width, height, 0x5B2F00, alpha);
	},
	
	getName: function() {
		return "Sand";
	}
});