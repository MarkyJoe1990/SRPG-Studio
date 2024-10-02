//Creates weather objects on the screen, calculates their physics,
//and draws them. Also keeps a cache of previously loaded weather
//graphics.
var WeatherGenerator = defineObject(BaseObject, {
	_rainArray: [],
	_weatherType: null,
	_windCurrent: 0,
	_timePassed: 0,
	_weatherArray: null,
	_imageCache: null,
	
	initialize: function() {
		this._weatherArray = [];
		this._imageCache = [];
		this._timePassed = 0;
		this.configureWeatherArray(this._weatherArray);
	},
	
	createWeatherObject: function() {
		var weatherObject = createObjectEx(this._weatherType, this)
		weatherObject.setUp(this._imageCache[this._weatherType._id].image); //should use an index instead to indicate the array
		return weatherObject;
	},
	
	//Does the frame-by-frame rain calculations
	moveWeatherGenerator: function() {
		var result = MoveResult.CONTINUE;
		
		this._windCurrent += (Math.random() * 0.2) - 0.1;
		
		if (this._windCurrent >= 1) {
			this._windCurrent = 1;
		} else if (this._windCurrent <= -1) {
			this._windCurrent = -1;
		}
		
		var weather = root.getCurrentSession().getCurrentMapInfo().custom.weather;
		this._weatherType = createObjectEx(WeatherNothing, this);
		if (weather != undefined) {
			for (i = 0; i < this._weatherArray.length; i++) {
				if (weather.toLowerCase() == this._weatherArray[i].getName().toLowerCase()) {
					this._weatherType = createObjectEx(this._weatherArray[i], this);
					//newImage = this._weatherType.createImage();
					this.setWeatherId(this._weatherType);
					this._weatherType.setImage(this._imageCache[this._weatherType._id].image);
					break;
				}
			}
		}
		
		var checkSpawnRate = this._timePassed % this._weatherType.getSpawnRate() == 0;
		
		if (this._rainArray.length < this._weatherType.getMaxCount() && this._weatherType.getName() != WeatherNothing.getName() && checkSpawnRate) {
			this._rainArray.appendObject(this.createWeatherObject());
		}
		
		for (i = 0; i < this._rainArray.length; i++) {
			if (this._rainArray[i].checkOffScreen() == true) {
				if (this._rainArray.length > this._weatherType.getMaxCount()) {
					this._rainArray.splice(i, 1);
					i--
					continue;
				} else if (this._weatherType.getName() != this._rainArray[i].getName()) {
					this._rainArray[i] = this.createWeatherObject();
				} else {
					this._rainArray[i].fullReset();
				}
			}
			this._rainArray[i].moveWeatherObject();
		}
		this._timePassed++;
		
		return result;
	},
	
	drawWeatherGenerator: function() {
		var width = root.getWindowWidth();
		var height = root.getWindowHeight();
		var alpha = 32;
		
		if (this._weatherType != null) {
		this._weatherType.specialEffect();
		}
		for (i = 0; i < this._rainArray.length; i++) {
			this._rainArray[i].drawWeatherObject();
		}
	},
	
	setWeatherId: function(weatherObject) {
		var index = 0;
		var objectFound = false;
		
		for (i = 0; i < this._imageCache.length; i++) {
			if (this._imageCache[i].name == weatherObject.getName()) {
				index = i;
				objectFound = true;
				break;
			}
		}
		
		if (!objectFound) {
			cacheObject = {name: weatherObject.getName(), image: weatherObject.createImage()}
			this._imageCache.push(cacheObject);
			index = this._imageCache.length - 1;
		}
		weatherObject._id = index;
		return index;
	},
	
	configureWeatherArray: function(groupArray) {
	}
});