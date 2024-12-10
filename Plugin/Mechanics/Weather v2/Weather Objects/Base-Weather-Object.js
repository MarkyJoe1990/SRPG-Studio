var BaseWeatherObject = defineObject(BaseObject, {
    moveWeather: function() {
        return MoveResult.CONTINUE;
    },

    drawWeather: function() {

    },

    getImage: function() {

    },

    getName: function() {
        return "";
    },

    isScrollEnabled: function() {
        return true;
    },

    getScrollPixelX: function() {
        return this.isScrollEnabled() ? root.getCurrentSession().getScrollPixelX() : 0;
    },

    getScrollPixelY: function() {
        return this.isScrollEnabled() ? root.getCurrentSession().getScrollPixelY() : 0;
    },

    getFadeColor: function() {
        return 0xFFFFFF; // Pure white
    },

    getSoundHandle: function() {
        var isRuntime = this.isRuntimeSound();
        var id = this.getSoundId();
        var handle = root.createResourceHandle(isRuntime, id, 0, 0, 0);
        if (handle != null) {
            return handle;
        }

        return root.createEmptyHandle();
    },

    getSoundId: function() {
        return -1;
    },

    isRuntimeSound: function() {
        return true;
    }
});