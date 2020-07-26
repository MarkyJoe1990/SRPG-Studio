var WeatherBall = defineObject(WeatherObject, {
	resetSelf: function() {
		var range = this.getBox();
		var direction = this.randomNumber(0,3);
		this._ballColor = Math.floor(this.randomNumber(0,2));
		this._bounceCount = 0;
		
		switch(direction) {
			default:
			case 0:
				this.setY(range.y1);
				this.setVelocityY(5);
				this.setX(this.randomNumber(range.x1,range.x2));
				this.setVelocityX(this.randomNumber(-5,5));
				break;
			case 2:
				this.setY(range.y2);
				this.setVelocityY(-5);
				this.setX(this.randomNumber(range.x1,range.x2));
				this.setVelocityX(this.randomNumber(-5,5));
				break;
			case 1:
				this.setX(range.x1);
				this.setVelocityX(5);
				this.setY(this.randomNumber(range.y1,range.y2));
				this.setVelocityY(this.randomNumber(-5,5));
				break;
			case 3:
				this.setX(range.x2);
				this.setVelocityX(-5);
				this.setY(this.randomNumber(range.y1,range.y2));
				this.setVelocityY(this.randomNumber(-5,5));
				break;
		}
		this.setAccelerationY(0.2);
	},
	
	getImageParts: function() {
		return {
			x: this._ballColor * 32,
			y: 0,
			width: 32,
			height: 32
		}
	},
	
	moveSpecificWeatherObject: function() {
		var range = {
			x1: 0,
			y1: 0,
			x2: root.getWindowWidth() - 32,
			y2: root.getWindowHeight() - 32
		}
		
		if (this._bounceCount < 5) {
			if (this.getX() <= range.x1 && this.getVelocityX() < 0) {
				this._velX *= -1;
				this._bounceCount++;
			}
			if (this.getX() >= range.x2 && this.getVelocityX() > 0) {
				this._velX *= -1;
				this._bounceCount++;
			}
			if (this.getY() <= range.y1 && this.getVelocityY() < 0) {
				this._velY *= -1;
				this._velY++;
				this._bounceCount++;
			}
			if (this.getY() >= range.y2 && this.getVelocityY() > 0) {
				this._velY *= -1;
				this._velY++;
				this._bounceCount++;
			}
		}
	},
	
	getName: function() {
		return "Ball";
	},
	
	getMaxCount: function() {
		return 10;
	}
	
});