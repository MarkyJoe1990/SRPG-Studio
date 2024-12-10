var PetalWeather = defineObject(BaseWeatherObject, {
    _timePassed: 0,
    _particleArray: null,

    initialize: function() {
        this._timePassed = 0;
        this._particleArray = [];
    },

    moveWeather: function() {
        if (this._timePassed % 5 === 0) {
            if (this._isQuantityReached() !== true) {
                var particle = createObjectEx(PetalParticle, this);
                particle.setX(Math.floor(Math.random() * root.getGameAreaWidth()));
                particle.setY(this.getScrollPixelY());
                this._particleArray.push(particle);
            }
        }

        var i, count = this._particleArray.length;
        for (i = count - 1; i >= 0; i--) {
            if (this._particleArray[i].moveParticle() !== MoveResult.CONTINUE) {
                this._particleArray.splice(i, 1);
            };
        }

        this._timePassed++;

        return MoveResult.CONTINUE;
    },

    drawWeather: function() {
        root.getGraphicsManager().fillRange(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), 0xE9B0D7, 32);

        var i, count = this._particleArray.length;
        for (i = 0; i < count; i++) {
            this._particleArray[i].drawParticle();
        }
    },

    getFadeColor: function() {
        return 0xE9B0D7;
    },

    getName: function() {
        return "Petal";
    },

    _isQuantityReached: function() {
        return this._particleArray.length >= 30;
    }
});