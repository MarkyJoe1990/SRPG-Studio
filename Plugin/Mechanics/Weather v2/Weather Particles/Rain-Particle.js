var RainParticle = defineObject(BaseWeatherParticle, {
    initialize: function() {
        this.setVelocityX(Math.floor(Math.random() * -1) - 4);
        this.setVelocityY(Math.floor(Math.random() * 5) + 15);
    },

    getXSrc: function() {
        return 1;
    },

    getYSrc: function() {
        return 0;
    },

    getVelocityY: function() {
        return this._velocityY;
    },

    getVelocityX: function() {
        return this._velocityX;
    }
});