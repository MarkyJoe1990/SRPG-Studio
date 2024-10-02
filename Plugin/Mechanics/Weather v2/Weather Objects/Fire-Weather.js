var FireWeather = defineObject(BaseWeatherObject, {
    _timePassed: 0,
    _particleArray: null,

    initialize: function() {
        this._timePassed = 0;
        this._particleArray = [];
        this._fireBackground = root.getMaterialManager().createImage("weather", "fire-looper.png");
    },

    moveWeather: function() {
        if (this._timePassed % 3 === 0) {
            if (this._isQuantityReached() !== true) {
                var particle = createObjectEx(FireParticle, this);
                particle.setX(Math.floor(Math.random() * root.getGameAreaWidth()));
                particle.setY(root.getGameAreaHeight() + this.getScrollPixelY());
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
        this._drawFireBackground();
        var i, count = this._particleArray.length;
        for (i = 0; i < count; i++) {
            this._particleArray[i].drawParticle();
        }
    },

    _drawFireBackground: function() {
        var x = (this._timePassed * -5) % root.getGameAreaWidth();
        var x2 = x + root.getGameAreaWidth();

        this._fireBackground.setAlpha(128);
        this._fireBackground.drawStretchParts(x, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), 0, 0, 100, 100);
        this._fireBackground.setAlpha(128);
        this._fireBackground.drawStretchParts(x2, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), 0, 0, 100, 100);
    },

    isScrollEnabled: function() {
        return false;
    },

    getFadeColor: function() {
        return 0xFF0000;
    },

    getName: function() {
        return "Fire";
    },

    getSoundId: function() {
        return 600;
    },

    isRuntimeSound: function() {
        return true;
    },

    _isQuantityReached: function() {
        return this._particleArray.length >= 20;
    }
});