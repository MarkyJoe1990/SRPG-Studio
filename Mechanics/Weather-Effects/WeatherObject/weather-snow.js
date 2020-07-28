var WeatherSnow = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-1,1));
		this.setVelocityY(this.randomNumber(1,2));
		this.setMaximumVelocityX(1);
		this.setMaximumVelocityY(2);
		this.setX(this.randomNumber(range.x1,range.x2));
		this.setY(range.y1);
	},
	
	moveSpecificWeatherObject: function() {
		this.setAccelerationX(this.randomNumber(-0.1,0.1));
	},
	
	getName: function() {
		return "Snow";
	},
	
	getSpawnRate: function() {
		return 2;
	}
});