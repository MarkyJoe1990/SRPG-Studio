GraphicsFormat.WEATHER_PARTICLE_WIDTH = 32;
GraphicsFormat.WEATHER_PARTICLE_HEIGHT = 32;

var WeatherControl = {
    _weatherArray: null,

    init: function() {
        this._weatherArray = [];
        this._configureWeatherArray(this._weatherArray);
        this._image = root.getMaterialManager().createImage("weather", "weather.png");

        GraphicsFormat.WEATHER_PARTICLE_WIDTH = 32;
        GraphicsFormat.WEATHER_PARTICLE_HEIGHT = 32;
    },

    setWeather: function(name) {
        var session = root.getCurrentSession();
        if (session == null) {
            return;
        }

        var mapData = session.getCurrentMapInfo();
        if (mapData == null) {
            return;
        }

        mapData.custom.weather = name; // Used for reloads
        MapLayer.updateWeather();
    },

    setWeatherByIndex: function(index) {
        var session = root.getCurrentSession();
        if (session == null) {
            return;
        }

        var mapData = session.getCurrentMapInfo();
        if (mapData == null) {
            return;
        }

        mapData.custom.weather = this._weatherArray[index].getName();
        MapLayer.updateWeather();
    },

    getWeather: function() {
        return MapLayer.getWeather();
    },

    getWeatherByName: function(name) {
        if (name == undefined) {
            return null;
        }

        var lowerName = name.toLowerCase();
        var i, currentWeather, count = this._weatherArray.length;
        for (i = 0; i < count; i++) {
            currentWeather = this._weatherArray[i];
            if (currentWeather.getName().toLowerCase() === lowerName) {
                return currentWeather;
            }
        }

        return null;
    },

    drawDebug: function() {
        var textui = root.queryTextUI("default_window");
        var color = textui.getColor();
        var font = textui.getFont();

        var weather = this.getWeather();
        weather != null && TextRenderer.drawText(0, 0, weather.getName(), -1, color, font);
    },

    getImage: function() {
        return this._image;
    },

    _configureWeatherArray: function(arr) {
        arr.push(ClearWeather);
        arr.push(SnowWeather);
        arr.push(RainWeather);
        arr.push(SandWeather);
        arr.push(FireWeather);
        arr.push(PetalWeather);
        arr.push(BubbleWeather);
        arr.push(SnowWeatherDetailed);
        arr.push(RainWeatherDetailed);
    }
};