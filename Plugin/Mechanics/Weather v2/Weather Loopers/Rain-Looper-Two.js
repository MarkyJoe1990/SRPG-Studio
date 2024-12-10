var RainLooperTwo = defineObject(BaseWeatherLooper, {
    getVariationY: function() {
        return -Math.floor(this.getHeight() / 2);
    },

    getImage: function() {
        return root.getMaterialManager().createImage("weather", "rain-looper-two.png");
    }
});