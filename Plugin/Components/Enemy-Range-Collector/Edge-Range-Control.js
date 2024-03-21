var EdgeRangeControl = {
    drawEdgeRange: function(indexArray, switchArray, pic, colorIndex) {
        var i, currentIndex, currentX, currentY, count = indexArray.length;
        var mapWidth = CurrentMap.getWidth();
        var width = GraphicsFormat.MAPCHIP_WIDTH;
        var height = GraphicsFormat.MAPCHIP_HEIGHT;
        for (i = 0; i < count; i++) {
            currentIndex = indexArray[i];
            currentX = CurrentMap.getX(currentIndex);
            currentY = CurrentMap.getY(currentIndex);
            pixelX = currentX * width;
            pixelY = currentY * height;
            xSrc = 0;

            if (switchArray[currentIndex - mapWidth] > 0) {
                xSrc += 0x01;
            }

            if (currentIndex % mapWidth !== mapWidth - 1 && switchArray[currentIndex + 1] > 0) {
                xSrc += 0x02;
            }

            if (switchArray[currentIndex + mapWidth] > 0) {
                xSrc += 0x04;
            }

            if (currentIndex % mapWidth !== 0 && switchArray[currentIndex - 1] > 0) {
                xSrc += 0x08;
            }

            ySrc = colorIndex != undefined ? colorIndex : 0;

            pic.drawParts(pixelX, pixelY, xSrc * width, ySrc * height, width, height);
        }
    }
};