var CameraPan = defineObject(BaseObject, {
    _startX: -1,
    _startY: -1,
    _destX: -1,
    _destY: -1,
    _diffX: -1,
    _diffY: -1,
    _easeMethod: null,
    _timeMethod: null,
    _isCameraFinished: false,
    _isDebugEnabled: false,

    initialize: function() {
        this._counter = createObject(SpeedCounter);
        this._startX = -1;
        this._startY = -1;
        this._destX = -1;
        this._destY = -1;
        this._diffX = -1;
        this._diffY = -1;
        this._timeMethod = CameraPanControl.defaultTimeMethod;
        this._easeMethod = CameraPanControl.defaultEaseMethod;
        this._isCameraFinished = true;
        this._isDebugEnabled = CameraPanConfig.enableDebug === true;
    },

    setDestination: function(x, y) {
        var minX = 0;
        var minY = 0;
        var maxX = (CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH) - root.getGameAreaWidth();
        var maxY = (CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT) - root.getGameAreaHeight();

        if (x < minX) {
            x = minX;
        } else if (x > maxX) {
            x = maxX;
        }

        if (y < minY) {
            y = minY;
        } else if (y > maxY) {
            y = maxY;
        }

        this._destX = x;
        this._destY = y;
    },

    setDestinationCenter: function(x, y) {
        this.setDestination(x - Math.floor(root.getGameAreaWidth() / 2), y - Math.floor(root.getGameAreaHeight() / 2))
    },

    setDestinationTile: function(x, y) {
        this.setDestination(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT);
    },

    // Centers the camera on the MIDDLE of the tile
    setDestinationTrueTileCenter: function(x, y) {
        this.setDestinationCenter((x * GraphicsFormat.MAPCHIP_WIDTH) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2), (y * GraphicsFormat.MAPCHIP_HEIGHT) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2));
    },

    // Centers the camera on the TOP LEFT corner of the tile
    setDestinationTileCenter: function(x, y) {
        this.setDestinationCenter(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT);
    },

    startCameraPan: function() {
        var session = root.getCurrentSession();
        this._startX = session.getScrollPixelX();
        this._startY = session.getScrollPixelY();

        this._diffX = this._destX - this._startX;
        this._diffY = this._destY - this._startY;

        var time = this._timeMethod(this);
        this._counter.setCounterInfo(time);
        this._isCameraFinished = false;
    },

    endCameraPan: function() {
        var session = root.getCurrentSession();
        session.setScrollPixelX(this._destX);
        session.setScrollPixelY(this._destY);
        this._isCameraFinished = true;
    },

    moveCameraPan: function() {
        if (this._isCameraFinished === true) {
            return MoveResult.END;
        }

        if (this._counter.moveCycleCounter() === MoveResult.CONTINUE) {
            var time = this._counter.getCounter();
            var max = this._counter._max;
            var session = root.getCurrentSession();

            session.setScrollPixelX(this._easeMethod(time, this._startX, this._diffX, max));
            session.setScrollPixelY(this._easeMethod(time, this._startY, this._diffY, max));
            return MoveResult.CONTINUE;
        }

        this.endCameraPan();
        return MoveResult.END;
    },

    drawDebug: function() {
        if (this._isDebugEnabled !== true) {
            return;
        }

        CameraPanControl.drawScrollBoundary();
    },

    disableGameAcceleration: function() {
        this._counter.disableGameAcceleration();
    },

    setTimeMethod: function(func) {
        this._timeMethod = func;
    },

    setEaseMethod: function(func) {
        this._easeMethod = func;
    }
});