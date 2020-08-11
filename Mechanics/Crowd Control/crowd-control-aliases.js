var CROWD_CONTROL_GAME_ID = "{149487CE-0123-17FE-7E8C-01D363C1942D}";

(function() {
	
	var alias1 = SetupControl.setup;
	SetupControl.setup = function() {
		alias1.call(this);
		ConnectionManager.initSingleton();
	}
	
	var alias2 = MapLayer.moveMapLayer;
	MapLayer.moveMapLayer = function() {
		var result = alias2.call(this);
		ConnectionManager.moveConnection();
		
		return result;
	}
	
	var alias3 = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function() {
		alias3.call(this);
		ConnectionManager.drawConnection();
	}
	
	var alias4 = CurrentMap.prepareMap;
	CurrentMap.prepareMap = function() {
		alias4.call(this);
		//root.log("Test");
		ConnectionManager.resetSelf();
	}
}) ();