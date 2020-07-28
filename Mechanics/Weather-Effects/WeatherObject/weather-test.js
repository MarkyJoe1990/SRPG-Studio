var WeatherTest = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(1);
		this.setVelocityY(0);
		this.setX(0);
		this.setY(0);
	},
	
	getName: function() {
		return "Test";
	},
	
	getMaxCount: function() {
		return 1;
	},
	
	setSpecialImageProperties: function() {
		this._image.setAlpha(0);
	},
	
	specialEffect: function() {
		var doop = this.getParentInstance()._timePassed;
		this.drawLoopedImage(this.getImage(), doop % 640, (doop % 512) - 32, true, true, false);
	}
});