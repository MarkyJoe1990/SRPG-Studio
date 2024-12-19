// Convenient functions that are used
// for the CameraPan object.

var CameraPanControl = {
    _tileX: -1,
    _tileY: -1,

    dependencyCheck: function() {
        if (typeof EaseControl == "undefined") {
            root.msg("WARNING: For the Camera Pan component to function, you need the Ease Control component as well. Please get it from MarkyJoe's GitHub:\n\nhttps://github.com/MarkyJoe1990/SRPG-Studio");
            root.endGame();
        }
    },

    defaultTimeMethod: function(cameraPan) {
        return Math.floor((Math.abs(cameraPan._diffX) + Math.abs(cameraPan._diffY)) / 36) + 12;
    },

    mouseTimeMethod: function(cameraPan) {
        return cameraPan.getParentInstance()._isAccelerate() ? 0 : 2;
    },

    snapTimeMethod: function(cameraPan) {
        var max = 10;
        var time = Math.floor((Math.abs(cameraPan._diffX) + Math.abs(cameraPan._diffY)) / 36) + 4;

        if (time > max) {
            time = max
        }

        return 8;
    },

    defaultEaseMethod: function(t, b, c, d) {
        return Math.floor(EaseControl.easeInOutQuad(t, b, c, d));
    },

    mouseEaseMethod: function(t, b, c, d) {
        return Math.floor(EaseControl.easeLinear(t, b, c, d))
    },

    // Checks for tile position, NOT pixel position
    isScrollTileAllowed: function(x, y, range) {
        if (range == undefined) {
            range = this.calculateScrollBoundary();
        }

        var session = root.getCurrentSession();
        var scrollX = session.getScrollPixelX();
        var scrollY = session.getScrollPixelY();
        var gameWidth = root.getGameAreaWidth();
        var gameHeight = root.getGameAreaHeight();
        var tileWidth = GraphicsFormat.MAPCHIP_WIDTH;
        var tileHeight = GraphicsFormat.MAPCHIP_HEIGHT;
        var mapPixelWidth = CurrentMap.getWidth() * tileWidth;
        var mapPixelHeight = CurrentMap.getHeight() * tileHeight;
        
        if (x < range.x) {
            if (scrollX > 0) {
                return true;
            }
        } else if (x > range.x + range.width - 1) {
            if (scrollX < mapPixelWidth - gameWidth) {
                return true;
            }
        }
        
        if (y < range.y) {
            if (scrollY > 0) {
                return true;
            }
        } else if (y > range.y + range.height - 1) {
            if (scrollY < mapPixelHeight - gameHeight) {
                return true;
            }
        }
        
        return false;
    },

    calculateScrollBoundary: function() {
        // Calculate validation boundary
		var session = root.getCurrentSession();
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

		var x = 2 + Math.floor(scrollX / tileWidth);
		var y = 2 + Math.floor(scrollY / tileHeight);
		var width = tileHighlightCountX;
		var height = tileHighlightCountY;

        return createRangeObject(x, y, width, height);
    },

    drawScrollBoundary: function() {
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

        var range = this.calculateScrollBoundary();
        var width = range.width * tileWidth;
        var height = range.height * tileHeight;

        // Draw scroll validation boundary
        var x = (tileWidth * range.x) - scrollX;
        var y = (tileHeight * range.y) - scrollY;
        graphicsManager.fillRange(x, y, width, height, 0x0000FF, 0x20);
        TextRenderer.drawText(x, y, "Boundary Pos: " + x + ", " + y +
            "\nBoundary Dimensions: " + width + ", " + height +
            "\nBoundary Pos (In tiles): " + range.x + ", " + range.y +
            "\nBoundary Dimensions (In tiles): " + range.width + ", " + range.height,
             -1, color, font);

        // Draw true screen center setDestinationTrueTileCenter
        x = Math.floor(gameWidth / 2);
        y = Math.floor(gameHeight / 2);
        graphicsManager.fillRange(x - (Math.floor(tileWidth / 2)), y - (Math.floor(tileHeight / 2)), tileWidth, tileHeight, 0xFFFFFF, 0x80);

        // Draw screen center based on setDestinationTileCenter
        x = (Math.floor(x / tileWidth) * tileWidth) + (x % tileWidth);
        y = (Math.floor(y / tileHeight) * tileHeight) + (y % tileHeight);
        graphicsManager.fillRange(x, y, tileWidth, tileHeight, 0xFF0000, 0x80);
    }
}