var SnowLooper = defineObject(BaseWeatherLooper, {
    getVariationX: function() {
        return -Math.floor(this.getWidth() / 2);
    },

    getImage: function() {
        return root.getMaterialManager().createImage("weather", "snow-looper.png");
    }
});