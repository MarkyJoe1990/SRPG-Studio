var ParticleCollisionType = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
    BLOCK: 4
}

var BaseWeatherParticle = defineObject(BaseObject, {
    _x: 0,
    _y: 0,
    _velocityX: 0,
    _velocityY: 0,

    setX: function(x) {
        this._x = x;
    },

    setY: function(y) {
        this._y = y;
    },

    getX: function() {
        return this._x;
    },

    getY: function() {
        return this._y;
    },

    setVelocityX: function(velocityX) {
        this._velocityX = velocityX;
    },

    setVelocityY: function(velocityY) {
        this._velocityY = velocityY;
    },

    getVelocityX: function() {
        return 0;
    },

    getVelocityY: function() {
        return 0;
    },

    getXSrc: function() {
        return 0;
    },

    getYSrc: function() {
        return 0;
    },

    getAlpha: function() {
        return 255;
    },

    moveParticle: function() {
        return this._moveParticleInternal();
    },

    drawParticle: function() {
        this._drawParticleInternal();
    },

    _moveParticleInternal: function() {
        var scrollX = this.getScrollPixelX();
        var scrollY = this.getScrollPixelY();

        var x = this.getX() + this.getVelocityX();
        var y = this.getY() + this.getVelocityY();

        if (x - scrollX < 0) {
            return this.borderCollision(ParticleCollisionType.LEFT);
        }

        if (y - scrollY < 0) {
            return this.borderCollision(ParticleCollisionType.TOP);
        }
        
        if (x - scrollX > root.getGameAreaWidth()) {
            return this.borderCollision(ParticleCollisionType.RIGHT);
        }

        if (y - scrollY > root.getGameAreaHeight()) {
            return this.borderCollision(ParticleCollisionType.BOTTOM);
        }

        // Check for wall collision
        var mapChipWidth = GraphicsFormat.MAPCHIP_WIDTH;
        var mapChipHeight = GraphicsFormat.MAPCHIP_HEIGHT;
        var tileX = Math.floor(x / mapChipWidth);
        var tileY = Math.floor(y / mapChipHeight);
        var terrain = PosChecker.getTerrainFromPos(tileX, tileY)
        if (terrain != null) {
            if (terrain.custom.weatherBlock === true) {
                return this.borderCollision(ParticleCollisionType.BLOCK)
            }
        }

        this.setX(x);
        this.setY(y);

        return MoveResult.CONTINUE;
    },

    borderCollision: function(particleCollisionType) {
        var width = root.getGameAreaWidth();
        var height = root.getGameAreaHeight();
        var x = this.getX();
        var y = this.getY();

        if (particleCollisionType === ParticleCollisionType.TOP) {
            this.setY(y + height);
            return MoveResult.CONTINUE;
        }

        if (particleCollisionType === ParticleCollisionType.RIGHT) {
            this.setX(x - width);
            return MoveResult.CONTINUE;
        }

        if (particleCollisionType === ParticleCollisionType.BOTTOM) {
            this.setY(y - height);
            return MoveResult.CONTINUE;
        }

        if (particleCollisionType === ParticleCollisionType.LEFT) {
            this.setX(x + width);
            return MoveResult.CONTINUE;
        }

        if (particleCollisionType === ParticleCollisionType.BLOCK) {
            return MoveResult.END;
        }

        return MoveResult.END;
    },

    _drawParticleInternal: function() {
        var width = GraphicsFormat.WEATHER_PARTICLE_WIDTH;
        var height = GraphicsFormat.WEATHER_PARTICLE_HEIGHT;
        var x = this.getX() - Math.floor(width / 2);
        var y = this.getY() - Math.floor(height / 2);
        var pic = this.getImage();
        var xSrc = this.getXSrc();
        var ySrc = this.getYSrc();
        var alpha = this.getAlpha();
        var scrollX = this.getScrollPixelX();
        var scrollY = this.getScrollPixelY();

        pic.setAlpha(alpha);
        pic.drawParts(x - scrollX, y - scrollY, xSrc * width, ySrc * height, width, height);
    },

    isScrollEnabled: function() {
        return this.getParentInstance().isScrollEnabled();
    },

    getScrollPixelX: function() {
        return this.isScrollEnabled() ? root.getCurrentSession().getScrollPixelX() : 0;
    },

    getScrollPixelY: function() {
        return this.isScrollEnabled() ? root.getCurrentSession().getScrollPixelY() : 0;
    },

    getImage: function() {
        return WeatherControl.getImage();
    }
});