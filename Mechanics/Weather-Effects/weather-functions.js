//Changes the weather to the next effect in the weather array
function toggleWeather(weatherArray) {
	var x = 0;
	
	var map = root.getCurrentSession().getCurrentMapInfo();
	if (map.custom.weather == undefined) {
		map.custom.weather = weatherArray[0].getName();
	}
	
	for (i = 0; i < weatherArray.length; i++) {
		var name = weatherArray[i].getName().toLowerCase();
		var currentWeather = map.custom.weather.toLowerCase()
		
		if (currentWeather == name) {
			x = i + 1;
			if (x >= weatherArray.length) {
				x = 0;
			}
			map.custom.weather = weatherArray[x].getName();
			break;
		}
	}
}

//Use this in the  execute script event command if you want to
//change the weather mid-chapter to something else.
function changeWeather(string) {
	var map = root.getCurrentSession().getCurrentMapInfo();
	map.custom.weather = string;
}