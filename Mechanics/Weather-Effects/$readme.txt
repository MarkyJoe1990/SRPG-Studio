Weather Plugin Version 1.0
By MarkyJoe1990

What does this do?
It implements weather and other effects in SRPG Studio. You can finally have effects such as rain, snow, and more in your games!

How do I use it?
- take the folder this readme was in and put it in your plugins folder
- take the weather-material folder that's in this folder and put it in your material folder
	- If you don't have a material folder in the root of your SRPG Studio project, make one
	- Then put the weather-material folder in it
- Go to the map you want to have weather on, and set its custom parameter "weather" to the name of the weather you want.
	- Alternatively, create an execute script event command that executes the code: changeWeather("NAME OF WEATHER")
- You can view the names of the available weathers by looking at the js files within the WeatherObject folder

How do I make my own weather?
Here's a few very useful pointers to hopefully help you figure it out. Note that you need some javascript programming knowledge to make your own weather.
- WeatherObject is the base object for weather effects and graphics.
- Your weather object should be an instance of WeatherObject
- Your new weather object should overwrite certain functions from the base WeatherObject. refer to 00_weather-base-object.js for more information
- Look at the other weather objects such as weather-rain.js to get an idea what your WeatherObject should look like
- Once you're done making your object, you can append it to the weather array by going to ZZ_weather-array.js
- weather-config.js allows you to turn on debug (very useful!) and set the default limit on how many weather objects can be on screen at once.