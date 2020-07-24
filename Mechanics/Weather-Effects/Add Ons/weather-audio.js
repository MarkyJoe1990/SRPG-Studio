/*
Made by Piketrcechillas

Weather's Sound, a standalone add-on to MarkyJoe's weather plugin pack
Can work alone, doesn't require Marky's weather, but works best with his weather.
Usage:
	- add this plugin into Plugin folder
	- open the desired map and add custom parameter to the map: 
	{
	weather: true,
	weatherSound: <id>
	}

	where id is the id of your imported sound. Note: pick a sound that's at least 5s long.
	Example:

	{
	weather: true,
	weatherSound: 1
	}
	


*/


(function () {
var count = 0;

var alias101 = MapLayer.drawUnitLayer;
MapLayer.drawUnitLayer = function() {
	alias101.call(this);
		if(root.getCurrentSession().getCurrentMapInfo().custom.weather!=null){
			if(root.getCurrentSession().getCurrentMapInfo().custom.weatherSound!=null){
				var id = root.getCurrentSession().getCurrentMapInfo().custom.weatherSound;
				WeatherSoundGenerator.play(id);
			}

		}

	
	}


var WeatherSoundGenerator = {	
	play: function(id) {
		if(count==0) {
			var handle = root.createResourceHandle(false,id , 0, 0, 0);
			var generator = root.getEventGenerator();
			generator.soundPlay(handle, 0);
			generator.execute();
			count=500;
		}
		else{
			count--;
		}

	}
}
})();
