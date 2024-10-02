var RainWeather = defineObject(BaseWeatherObject, {
    _looperArray: null,

    initialize: function() {
        this._looperArray = [];

        var looper = createObject(RainLooperOne);
        looper.setVelocityX(-3);
        looper.setVelocityY(12);
        this._looperArray.push(looper);

        looper = createObject(RainLooperTwo);
        looper.setVelocityX(-6);
        looper.setVelocityY(9);
        this._looperArray.push(looper);
    },

    moveWeather: function() {
        var i, count = this._looperArray.length;
        for (i = 0; i < count; i++) {
            this._looperArray[i].moveLooper();
        }

        return MoveResult.CONTINUE;
    },

    drawWeather: function() {
        root.getGraphicsManager().fillRange(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), 0x0000FF, 32);

        var i, count = this._looperArray.length;
        for (i = 0; i < count; i++) {
            this._looperArray[i].drawLooper();
        }
    },
    
    getFadeColor: function() {
        return 0x0000FF;
    },

    getName: function() {
        return "Rain";
    }
});