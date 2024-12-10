var BaseWeatherLooper = defineObject(BaseObject, {
    _cacheImage: null,
    _x: 0,
    _y: 0,
    _velocityX: 0,
    _velocityY: 0,

    initialize: function() {
        this.createCacheImage();
    },

    createCacheImage: function() {
        var image = this.getImage();
        var width = this.getWidth();
        var height = this.getHeight();
        var xMax = root.getGameAreaWidth() + (width * 2);
        var yMax = root.getGameAreaHeight() + (height * 2);

        // Set render
        var graphicsManager = root.getGraphicsManager();
        this._cacheImage = graphicsManager.createCacheGraphics(xMax, yMax);
        graphicsManager.setRenderCache(this._cacheImage);

        // Draw
        var isVariationX = false;
        var isVariationY = false;
        var variationX = this.getVariationX();
        var variationY = this.getVariationY();
        var offsetX = 0;
        var offsetY = 0;
        for (var y = 0; y < yMax; y += height) {
            isVariationY = false;
            for (var x = 0; x < xMax; x += width) {
                offsetX = isVariationX === true ? variationX : 0;
                offsetY = isVariationY === true ? variationY : 0;
                image.draw(x + offsetX, y + offsetY);
                isVariationY = isVariationY === false;
            }
            isVariationX = isVariationX === false;
        }

        // Reset render
        graphicsManager.resetRenderCache();
    },

    moveLooper: function() {
        var width = this.getWidth();
        var height = this.getHeight();
        var x = this.getX() + this.getVelocityX();
        var y = this.getY() + this.getVelocityY();

        if (x < 0 - (width * 2)) {
            x += (width * 2);
        }

        if (y < 0 - (height * 2)) {
            y += (height * 2);
        }

        if (x > 0) {
            x -= width * 2;
        }

        if (y > 0) {
            y -= height * 2;
        }

        this.setX(x);
        this.setY(y);

        return MoveResult.CONTINUE;
    },

    drawLooper: function() {
        this._cacheImage.draw(this.getX(), this.getY());
    },

    getX: function() {
        return this._x;
    },

    getY: function() {
        return this._y;
    },

    setX: function(x) {
        this._x = x;
    },

    setY: function(y) {
        this._y = y;
    },

    getVariationY: function() {
        return 0;
    },

    getVariationX: function() {
        return 0;
    },

    getVelocityX: function() {
        return this._velocityX;
    },

    getVelocityY: function() {
        return this._velocityY;
    },

    setVelocityX: function(velocityX) {
        this._velocityX = velocityX;
    },

    setVelocityY: function(velocityY) {
        this._velocityY = velocityY;
    },

    getWidth: function() {
        return this.getImage().getWidth();
    },

    getHeight: function() {
        return this.getImage().getHeight();
    },

    getImage: function() {
        return null;
    }
});