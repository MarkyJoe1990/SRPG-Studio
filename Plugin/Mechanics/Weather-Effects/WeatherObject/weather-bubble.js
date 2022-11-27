var WeatherBubble = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-1,1));
		this.setVelocityY(-1);
		this.setTimeLimit(this.randomNumber(60,180));
		
		this.setX(this.randomNumber(range.x1,range.x2));
		this.setY(range.y2);
	},
	
	setSpecialImageProperties: function() {
		this.getImage().setAlpha(160);
		if (this.getTimePassed() + 10 >= this.getTimeLimit()) {
			this.getImage().setScale(100 + ((this.getTimePassed() + 10 - this.getTimeLimit())*5))
		}
	},
	
	getName: function() {
		return "Bubble";
	},
	
	getMaxCount: function() {
		return 50;
	}
});