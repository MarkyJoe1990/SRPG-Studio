var SandLooper = defineObject(BaseWeatherLooper, {
    getVariationY: function() {
        return -Math.floor(this.getHeight() / 2);
    },

    getImage: function() {
        return root.getMaterialManager().createImage("weather", "sand-looper.png");
    }
});