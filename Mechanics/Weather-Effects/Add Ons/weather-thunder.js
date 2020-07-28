/*
Thunder Weather, a standalone add-on to MarkyJoe's weather plugin pack
Can work alone, doesn't require Marky's weather, but works best with his weather.
Usage:
	- add this plugin into Plugin folder
	- open the desired map and add custom parameter to the map: {thunder: true}
	[OPTIONAL]
	- you can import thunder sound, and then add custom parameter {sound: <id>} where id
	is the id of the imported sound. For example, {sound: 0}
	- you can decide the (average) frequency of the thunder. Add custom parameter {max: <number>}
	where number is your desired value. The higher the number, the less frequent thunder will appear.
	Example: {max: 300}. Default value is 200.
	- Example of param with full options:

	{
		thunder: true,
		max: 300,
		sound: 0
	}

*/



(function () {
var alpha = 0;
var flag = false;

var alias100 = MapLayer.drawUnitLayer;
MapLayer.drawUnitLayer = function() {
	alias100.call(this);
	
		if(root.getCurrentSession().getCurrentMapInfo().custom.thunder){
			var val;
			var max;

			if(root.getCurrentSession().getCurrentMapInfo().custom.max!=null){
				var customMax = root.getCurrentSession().getCurrentMapInfo().custom.max;
				if(customMax<1)
					max = 200;
				else
					max = root.getCurrentSession().getCurrentMapInfo().custom.max;
			}
			else
				max = 200;


			if(!flag)
				val = Math.floor(Math.random() * max);
			else
				val = 1;
			
			if(val == 1){

				if(!flag){
					alpha = Math.floor(90 + Math.random() * 150);
					flag = true;
					if(root.getCurrentSession().getCurrentMapInfo().custom.sound!=null)
						ThunderGenerator.play(root.getCurrentSession().getCurrentMapInfo().custom.sound);

				}
				ThunderGenerator.generate(alpha);
				alpha = alpha - 10;
				if(alpha <= 0){
					flag = false;
					alpha = 0;
				}
			}		
		}
	}


var ThunderGenerator = {
	generate: function(alpha) {
		indexArray = [];
		for(i = 0; i < CurrentMap.getWidth(); i++){
			for(j = 0; j < CurrentMap.getHeight(); j++){
				indexArray.push(CurrentMap.getIndex(i, j));
			}
		}

			root.drawFadeLight(indexArray, 16777215, alpha);
	},

	play: function(id) {
			var handle = root.createResourceHandle(false,id , 0, 0, 0);
			var generator = root.getEventGenerator();
			generator.soundPlay(handle, 0);
			generator.execute();

	}
}
})();