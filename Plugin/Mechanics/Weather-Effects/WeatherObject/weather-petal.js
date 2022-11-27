var WeatherPetal = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-1,1));
		this.setVelocityY(this.randomNumber(1,2));
		this.setX(this.randomNumber(range.x1,range.x2));
		this.setY(range.y1);
	},
	
	specialEffect: function() {
		var width = root.getWindowWidth();
		var height = root.getWindowHeight();
		var alpha = 32;
		
		root.getGraphicsManager().fillRange(0, 0, width, height, 0xE9B0D7, alpha);
	},
	
	getName: function() {
		return "Petal";
	},
	
	getSpawnRate: function() {
		return 2;
	}
});