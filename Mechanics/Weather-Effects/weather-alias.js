(function () {
	//Adds WeatherGenerator in ScriptCall_Setup
	var alias1 = ScriptCall_Setup;
	ScriptCall_Setup = function() {
		alias1.call(this);
		MyWeatherGenerator = createObject(WeatherGenerator);
	}
	
	//Adds WeatherGenerator's "move" cycle for calculations, physics
	//and generating weather objects. Allows the shift key to toggle
	//the weather when debug mode is enabled.
	var alias2 = MapLayer.moveMapLayer;
	MapLayer.moveMapLayer = function() {
		var result = alias2.call(this);
		var weather = root.getCurrentSession().getCurrentMapInfo().custom.weather;
		MyWeatherGenerator.moveWeatherGenerator();
		if (root.isInputAction(InputType.BTN4) && ENABLE_WEATHER_DEBUG) {
			toggleWeather(MyWeatherGenerator._weatherArray);
		}
		return result;
	}
	
	//Draws the weather generator's calculations, and draws debug info
	//on the screen with debug is enabled
	var alias3 = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function() {
		alias3.call(this);
		var weather = root.getCurrentSession().getCurrentMapInfo().custom.weather;
		MyWeatherGenerator.drawWeatherGenerator();
		if (ENABLE_WEATHER_DEBUG) {
			var textY = 0;
			var textX = 2;
			var font = root.queryTextUI("default_window").getFont();
			var color = 0xFFFFFF;
			
			TextRenderer.drawText(textX,textY,"FPS: " + root.getFPS(), -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Weather Object Count: " + MyWeatherGenerator._rainArray.length, -1, color, font)
			textY += 16;
			if (MyWeatherGenerator._weatherType != null) {
				TextRenderer.drawText(textX,textY,"Current Weather: " + MyWeatherGenerator._weatherType.getName(), -1, color, font)
				textY += 16;
				TextRenderer.drawText(textX,textY,"Spawn Rate: " + MyWeatherGenerator._weatherType.getSpawnRate(), -1, color, font)
				textY += 16;
				TextRenderer.drawText(textX,textY,"Max Limit: " + MyWeatherGenerator._weatherType.getMaxCount(), -1, color, font)
				textY += 16;
			}
			cacheString = "Weather Cache: "
			count = MyWeatherGenerator._imageCache.length
			for (i = 0; i < count; i++) {
				cacheString += MyWeatherGenerator._imageCache[i].name;
				if (i == count - 1) {" "} else {cacheString += ", "}
			}
			TextRenderer.drawText(textX,textY,cacheString, -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Wind Current: " + MyWeatherGenerator._windCurrent, -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"No. Of Weather Types: " + MyWeatherGenerator._weatherArray.length, -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,root.getWindowHeight() - 36,"PRESS OPTION 2 (DEFAULT: SHIFT) TO TOGGLE WEATHER", -1, color, font)
			TextRenderer.drawText(textX,root.getWindowHeight() - 20,"To turn off this debug stuff, go to weather-config.js", -1, color, font)
		}
	}
}) ();