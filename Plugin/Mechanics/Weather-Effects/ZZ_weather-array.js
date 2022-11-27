//This is the list of weather objects that are currently
//in the game. If you want to add yours, simply add this
//to the end of the object appends.

//groupArray.appendObject(NAME_OF_YOUR_WEATHER_OBJECT_VARIABLE);

//...Also, make sure the "ZZ_" remains at the start of this
//file's name. This makes this file be read last of the scripts
//in this folder.

WeatherGenerator.configureWeatherArray = function(groupArray) {
	groupArray.appendObject(WeatherNothing);
	groupArray.appendObject(WeatherRain);
	groupArray.appendObject(WeatherSnow);
	groupArray.appendObject(WeatherFire);
	groupArray.appendObject(WeatherPetal);
	groupArray.appendObject(WeatherSand);
	groupArray.appendObject(WeatherBubble);
	groupArray.appendObject(WeatherBall);
	groupArray.appendObject(WeatherTest);
	//YOUR WEATHER OBJECTS HERE
}