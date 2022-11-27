//This object prevents weather objects from spawning
//and despawns whatever weather objects leave the screen
//(or meet their despawn conditions)

var WeatherNothing = defineObject(WeatherObject,{
	getName: function() {
		return "Nothing";
	},
	
	getMaxCount: function() {
		return 0;
	}
});