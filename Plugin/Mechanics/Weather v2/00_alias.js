( function() {
    var alias4 = SetupControl.setup;
    SetupControl.setup = function() {
        WeatherControl.init();
        alias4.call(this);
    }

    var alias1 = MapLayer.moveMapLayer;
    MapLayer.moveMapLayer = function() {
        var result = alias1.call(this);
        var session = root.getCurrentSession();
        if (session.isMapState(MapStateType.DRAWMAP) === true) {
            this._weather.moveWeather();
        }

        return result;
    }

    var alias2 = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function() {
        alias2.call(this);

        var session = root.getCurrentSession();
        if (session.isMapState(MapStateType.DRAWMAP) === true) {
            this._weather.drawWeather();
            WeatherConfig.enableDebug === true && WeatherControl.drawDebug();
        }
    }

    var alias3 = MapLayer.prepareMapLayer;
    MapLayer.prepareMapLayer = function() {
        alias3.call(this);
        this.updateWeather();
    }

    var alias5 = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function() {
        alias5.call(this);

        var mapInfo = root.getCurrentSession().getCurrentMapInfo();
        if (mapInfo != null && mapInfo.custom.weather == undefined) {
            WeatherControl.setWeather("Clear");
        }
    }

    var alias6 = ScriptExecuteEventCommand._configureOriginalEventCommand;
	ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
			alias6.call(this, groupArray);
			groupArray.appendObject(WeatherEventCommand);
	};

    var alias7 = UIBattleLayout._drawCustomPicture;
    UIBattleLayout._drawCustomPicture = function(xScroll, yScroll) {
        alias7.call(this, xScroll, yScroll);
        WeatherControl.getWeather().drawWeather();
    }

    var alias8 = UIBattleLayout.moveBattleLayout;
    UIBattleLayout.moveBattleLayout = function() {
        WeatherControl.getWeather().moveWeather();
        return alias8.call(this);
    }

    MapLayer.updateWeather = function() {
        var session = root.getCurrentSession();
        if (session == null) {
            return;
        }
        
        var mapData = session.getCurrentMapInfo();
        if (mapData == null) {
            return;
        }
        
        var weatherObj = WeatherControl.getWeatherByName(mapData.custom.weather);
        if (weatherObj == null) {
            return;
        }
        
        this._weather = createObject(weatherObj);
    }

    MapLayer.getWeather = function() {
        return this._weather;
    }
}) ();