var WeatherFire = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		
		this.setVelocityX(this.randomNumber(-1,1));
		this.setVelocityY(this.randomNumber(-2,-1));
		this.setTimeLimit(100);
		
		this.setX(this.randomNumber(range.x1,range.x2));
		this.setY(range.y2);
	},
	
	setSpecialImageProperties: function() {
		this._image.setAlpha(96);
		this._image.setScale(100 - this.getTimePassed());	
	},
	
	getName: function() {
		return "Fire";
	},
	
	specialEffect: function() {
		var width = root.getGameAreaWidth();
		var height = Math.floor(root.getGameAreaHeight() / 2);

		var flare = {
			x: 0,
			y: 32,
			width: 32,
			height: 32
		}
		
		this._image.setAlpha(96);
		this._image.drawStretchParts(0, height, width, height, flare.x, flare.y, flare.width, flare.height);
		this._image.setAlpha(96);
		this._image.setDegree(180)
		this._image.drawStretchParts(0, 0, width, height, flare.x, flare.y, flare.width, flare.height);
	}
});