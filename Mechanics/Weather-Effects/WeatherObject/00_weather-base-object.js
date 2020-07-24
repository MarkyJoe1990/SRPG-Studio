//When making new weather objects, make sure it's an
//instance of this object right here.

//Also make sure that whatever functions you overwrite
//in your new instance are safe to overwrite.

//I'll indicate which functions REQUIRE overwriting,
//which ones are optional, and which ones shouldn't
//be touched.

var WeatherObject = defineObject(BaseObject, {
	_posX: 0,
	_posY: 0,
	_velX: 0,
	_velY: 0,
	_maxVelX: 0,
	_maxVelY: 0,
	_accelX: 0,
	_accelY: 0,
	_image: null,
	_timePassed: 0,
	_timeLimit: 0,
	
	//REQUIRED. Sets up position and physics of the weather object
	//this.getBox gives you a small object representing the boundaries
	//that despawn the object. Might be useful for determining spawn
	//points.
	
	//Functions you'll need: this.setX(), this.setY(), this.setVelocityX(),
	//this.setVelocityY(). The rest of the setter functions that determine
	//physics are optional
	resetSelf: function() {
	},
	
	//REQUIRED. Sets the name of the object. Make sure it doesn't match
	//the name of other weather objects.
	getName: function() {
		return '';
	},
	
	//DO NOT OVERWRITE. Resets timer, then does all the reset stuff you
	//set in resetSelf.
	fullReset: function() {
		this.resetTimer();
		this.resetSelf();
	},
	
	//DO NOT OVERWRITE. Just sets the image of the weather object
	//then starts the proper set up/reset up process
	setUp: function(image) {
		this.setImage(image);
		this.fullReset();
	},
	
	//DO NOT OVERWRITE. Checks if the weather object has left the
	//boundary box it's supposed to stay in (which you can change).
	//Also checks if the weather object has met any special
	//despawning conditions that you've set up.
	checkOffScreen: function() {
		var range = this.getBox();
		
		if (this.getX() < range.x1 || this.getX() > range.x2) {
			return true;
		}
		if (this.getY() < range.y1 || this.getY() > range.y2) {
			return true;
		}
		
		if (this.checkTimeLimit()) {
			return true;
		}
		
		return this.checkSpecialDespawnConditions();
	},
	
	//OPTIONAL. You can set the valid boundary box the weather
	//object is not allowed to leave here. By default, the
	//weather object is considered out of bounds when it's
	//entire 32x32 graphic is off the visible area of the map.
	getBox: function() {
		return {
			x1: this.getImageParts().width * -1,
			y1: this.getImageParts().height * -1,
			x2: root.getWindowWidth(),
			y2: root.getWindowHeight()
		}
	},
	
	//Checks if the weather object's despawn time limit has been reached.
	//If the time limit hasn't been set, this will always return false.
	checkTimeLimit: function() {
		return this.getTimeLimit() > 0 && this.getTimePassed() >= this.getTimeLimit();
	},
	
	//OPTIONAL. You can set any special conditions that cause
	//your weather object to despawn. Defaults to false, meaning
	//there are no despawn conditions.
	checkSpecialDespawnConditions: function() {
		return false;
	},
	
	//DO NOT OVERWRITE. Calculates the position of the weather
	//object based on the parameters you set in resetSelf(),
	//as well as in moveSpecificWeatherObject()
	moveWeatherObject: function() {
		this.moveSpecificWeatherObject();
		var windCurrent = this.getParentInstance()._windCurrent;
		
		this._posX += this._velX + windCurrent;
		this._posY += this._velY;
		this._velX += this._accelX;
		this._velY += this._accelY;
		
		if (this._maxVelX != 0) {
			if (this._velX > this._maxVelX) {
				this._velX = this._maxVelX
			}
			
			if (this._velX < (this._maxVelX * -1)) {
				this._velX = this._maxVelX * -1
			}
		}
		
		if (this._maxVelY != 0) {
			if (this._velY > this._maxVelY) {
				this._velY = this._maxVelY
			}
			
			if (this._velY < this._maxVelY * -1) {
				this._velY = this._maxVelY * -1
			}
		}
		
		this._timePassed++;
	},
	
	//OPTIONAL. You can set any additional physics for your
	//weather object here.
	moveSpecificWeatherObject: function() {
	},
	
	//OPTIONAL. You can set the spawn rate of your weather object.
	//1 (default) means the object will spawn every single frame.
	//2 means every 2 frames, and so on.
	getSpawnRate: function() {
		return 1;
	},
	
	//OPTIONAL. You can set the maximum number of weather objects
	//allowed to be on screen. Objects will start despawning if the
	//total number of objects exceeds the max limit of the currently
	//active weather. Defaults to whatever you have set as the max
	//in the weather-config.js file.
	getMaxCount: function() {
		return DEFAULT_MAX_WEATHER_COUNT;
	},
	
	//DO NOT OVERWRITE. Draws the weather object based on
	//the weather index, and draws any additional special
	//effects you've set.
	drawWeatherObject: function() {
		var x = Math.round(this._posX);
		var y = Math.round(this._posY);
		var imageParts = this.getImageParts();
		this.setSpecialImageProperties();
		
		this._image.drawParts(x, y, imageParts.x, imageParts.y, imageParts.width, imageParts.height);
	},
	
	//OPTIONAL. Sets the exact coordinates and dimensions of
	//the weather object's graphics inside weather.png of the
	//"weather-material" folder. By default, it treats weather.png
	//like a tilesetof 32x32 tiles, with getWeatherIndex being
	//used to select which tile on the first row to use.
	getImageParts: function() {
		return {
			x: 0,
			y: 0,
			width: 32,
			height: 32
		}
	},
	
	//DO NOT OVERWRITE. Goes into the material/weather-material folder,
	//and searches for an image file with the same name as the object
	//(set to lowercase). If you don't want to use .png files, go to
	//getFileType to change it.
	createImage: function() {
		//root.log(this.getName() + this.getFileType());
		return root.getMaterialManager().createImage("weather-material", this.getName().toLowerCase() + this.getFileType());
	},
	
	//OPTIONAL. Sets the file type of the weather object's corresponding image file.
	//Default is ".png".
	getFileType: function() {
		return ".png";
	},
	
	//OPTIONAL. You can set any additional special effects to
	//go off when your weather is active.
	specialEffect: function() {
	},
	
	//OPTIONAL. You can set any additional properties of the
	//image here, such as transparency and angle.
	setSpecialImageProperties: function(x, y, weatherIndex) {
	},
	
	//DO NOT OVERWRITE. Sets the horizantal position of the weather object.
	setX: function(x) {
		this._posX = x;
	},
	
	//DO NOT OVERWRITE. Sets the vertical position of the weather object.
	setY: function(y) {
		this._posY = y;
	},
	
	//DO NOT OVERWRITE. Gets the horizantal position of the weather object.
	getX: function() {
		return this._posX;
	},
	
	//DO NOT OVERWRITE. Gets the vertical position of the weather object.
	getY: function() {
		return this._posY;
	},
	
	//DO NOT OVERWRITE. Gets the horizantal velocity of the weather object.
	getVelocityX: function() {
		return this._velX;
	},
	
	//DO NOT OVERWRITE. Gets the vertical velocity of the weather object.
	getVelocityY: function() {
		return this._velY;
	},
	
	//DO NOT OVERWRITE. Sets the horizantal velocity of the weather object.
	setVelocityX: function(velX) {
		this._velX = velX;
	},
	
	//DO NOT OVERWRITE. Sets the vertical velocity of the weather object.
	setVelocityY: function(velY) {
		this._velY = velY;
	},
	
	//DO NOT OVERWRITE. Sets the horizantal acceleration speed of the weather object.
	setAccelerationX: function(accelX) {
		this._accelX = accelX;
	},
	
	//DO NOT OVERWRITE. Sets the vertical acceleration speed of the weather object.
	setAccelerationY: function(accelY) {
		this._accelY = accelY;
	},
	
	//DO NOT OVERWRITE. Sets the maximum horizantal velocity of the weather object.
	setMaximumVelocityX: function(maxVelX) {
		this._maxVelX = maxVelX;
	},
	
	//DO NOT OVERWRITE. Sets the maximum vertical velocity of the weather object.
	setMaximumVelocityY: function(maxVelY) {
		this._maxVelY = maxVelY;
	},
	
	//DO NOT OVERWRITE. Sets the weather object's image.
	setImage: function(image) {
		this._image = image;
	},
	
	//DO NOT OVERWRITE. Sets the time limit for the weather
	//object.
	setTimeLimit: function(value) {
		this._timeLimit = value;
	},
	
	//DO NOT OVERWRITE. Resets the timer for the weather object.
	//Used mainly for weather objects that have despawn time limits.
	resetTimer: function() {
		this._timePassed = 0;
	},
	
	//DO NOT OVERWRITE. Returns a number between start and end.
	randomNumber: function(start, end) {
		if (end <= start) {
			root.msg("ERROR: One of your this.randomNumber() functions has a maximum value that is less than or equal to the minimum value.\n\nCheck the weather object with the name " + this.getName());
			root.endGame();
		}
		
		var difference = end - start + 1;
		return Math.floor(Math.random() * difference) + start;
	},
	
	//DO NOT OVERWRITE. Fetches the number of frames the weather
	//object has existed
	getTimePassed: function() {
		return this._timePassed;
	},
	
	//DO NOT OVERWRITE. Fetches the weather object's time limit.
	getTimeLimit: function() {
		return this._timeLimit;
	},
	
	//DO NOT OVERWRITE. Fetches the weather object's image
	getImage: function() {
		return this._image;
	}
});