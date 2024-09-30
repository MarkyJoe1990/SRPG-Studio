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

        var graphicsManager = root.getGraphicsManager();
        var session = root.getCurrentSession();
        var textui = root.queryTextUI("default_window");
        var color = textui.getColor();
        var font = textui.getFont();

        // Draw Enemy ScrollAutoAction Validation Boundary
        var tileWidth = GraphicsFormat.MAPCHIP_WIDTH;
        var tileHeight = GraphicsFormat.MAPCHIP_HEIGHT;
        var gameWidth = root.getGameAreaWidth();
        var gameHeight = root.getGameAreaHeight();
        var scrollX = session.getScrollPixelX();
        var scrollY = session.getScrollPixelY();
        var extraTileX = scrollX % tileWidth > 0 ? 1 : 0;
        var extraTileY = scrollY % tileHeight > 0 ? 1 : 0;
        var tileHighlightCountX = Math.ceil(gameWidth / tileWidth) - 4 + extraTileX;
        var tileHighlightCountY = Math.ceil(gameHeight / tileHeight) - 4 + extraTileY;

        var width = tileHighlightCountX * tileWidth;
        var height = tileHighlightCountY * tileHeight;
        var x = (tileWidth * 2) - (scrollX % tileWidth);
        var y = (tileHeight * 2) - (scrollY % tileHeight);
        graphicsManager.fillRange(x, y, width, height, 0x0000FF, 0x20);
        TextRenderer.drawText(x, y, "Boundary Screen Pos: " + x + ", " + y +
            "\nBoundary Dimensions: " + width + ", " + height +
            "\nTile Pos: " + (2 + Math.floor(scrollX / tileWidth)) + ", " + (2 + Math.floor(scrollY / tileHeight)) +
            "\nTile Dimensions: " + tileHighlightCountX + ", " + tileHighlightCountY,
             -1, color, font);

        // Draw true screen center setDestinationTrueTileCenter
        x = Math.floor(gameWidth / 2);
        y = Math.floor(gameHeight / 2);
        graphicsManager.fillRange(x - (Math.floor(tileWidth / 2)), y - (Math.floor(tileHeight / 2)), tileWidth, tileHeight, 0xFFFFFF, 0x80);

        // Draw screen center based on setDestinationTileCenter
        x = (Math.floor(x / tileWidth) * tileWidth) + (x % tileWidth);
        y = (Math.floor(y / tileHeight) * tileHeight) + (y % tileHeight);
        graphicsManager.fillRange(x, y, tileWidth, tileHeight, 0xFF0000, 0x80);
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