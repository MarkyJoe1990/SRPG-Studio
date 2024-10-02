var SnowWeather = defineObject(BaseWeatherObject, {
    _looperArray: null,

    initialize: function() {
        this._looperArray = [];
        var looper, count = 2;
        for (var i = 0; i < count; i++) {
            looper = createObject(SnowLooper);
            looper.setX(i * 50);
            looper.setVelocityX(0.5 + (i * 0.5));
            looper.setVelocityY(2 - (i * 0.5));
            this._looperArray.push(looper);
        }
    },

    moveWeather: function() {
        var i, count = this._looperArray.length;
        for (i = 0; i < count; i++) {
            this._looperArray[i].moveLooper();
        }

        return MoveResult.CONTINUE;
    },

    drawWeather: function() {
        var i, count = this._looperArray.length;
        for (i = 0; i < count; i++) {
            this._looperArray[i].drawLooper();
        }
    },
    
    getFadeColor: function() {
        return 0x0000FF;
    },

    getName: function() {
        return "Snow";
    }
});