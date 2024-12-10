var FireParticle = defineObject(BaseWeatherParticle, {
    initialize: function() {
        this._timePassed = 0;
    },

    getXSrc: function() {
        return 4;
    },

    getYSrc: function() {
        return 0;
    },

    getVelocityY: function() {
        return -4;
    },

    getVelocityX: function() {
        return Math.round(Math.random() * 8) - 4;
    },

    moveParticle: function() {
        if (this.getY() <= root.getGameAreaHeight() - 120 + this.getScrollPixelY()) {
            return MoveResult.END;
        }

        return this._moveParticleInternal();
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

        if (particleCollisionType === ParticleCollisionType.LEFT) {
            this.setX(x + width);
            return MoveResult.CONTINUE;
        }

        if (particleCollisionType === ParticleCollisionType.BLOCK) {
            return MoveResult.END;
        }

        return MoveResult.END;
    },

    getAlpha: function() {
        var y = this.getY();
        var destY = root.getGameAreaHeight() + this.getScrollPixelY() - 120;
        var diff = y - destY;
        
        var percent = 1;
        if (diff < 0) {
            return 0;
        } else if (diff <= 120) {
            percent = diff / 120;
        }

        return 255 * percent;
    }
});