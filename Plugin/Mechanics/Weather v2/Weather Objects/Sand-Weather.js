var SandWeather = defineObject(BaseWeatherObject, {
    _looperArray: null,

    initialize: function() {
        this._looperArray = [];

        var looper = createObject(SandLooper);
        looper.setVelocityX(-20);
        looper.setVelocityY(4);
        this._looperArray.push(looper);

        looper = createObject(SandLooper);
        looper.setVelocityX(-15);
        looper.setVelocityY(-3);
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
        root.getGraphicsManager().fillRange(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), 0x5B2F00, 32);

        var i, count = this._looperArray.length;
        for (i = 0; i < count; i++) {
            this._looperArray[i].drawLooper();
        }
    },
    
    getFadeColor: function() {
        return 0x5B2F00;
    },

    getName: function() {
        return "Sand";
    }
});