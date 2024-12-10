var PetalParticle = defineObject(BaseWeatherParticle, {
    getXSrc: function() {
        return 2;
    },

    getYSrc: function() {
        return 0;
    },

    getVelocityY: function() {
        return 2;
    },

    getVelocityX: function() {
        return Math.round(Math.random() * 4) - 2;
    }
});