var EnemyRangeCollectorFlowEntry = defineObject(BaseFlowEntry, {
    _timer: 0,

    enterFlowEntry: function() {
        this._enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        this._timer = 0;
        return this._enemyRangeCollector.checkNextUnit() === true ? EnterResult.OK : EnterResult.NOTENTER;
    },

    moveFlowEntry: function() {
        if (this._enemyRangeCollector.checkNextUnit() === true) {
            return MoveResult.CONTINUE;
        }

        return EnterResult.END;
    },

    drawFlowEntry: function() {
        var width = 300;
        var height = 120;
        var x = LayoutControl.getCenterX(-1, width);
        var y = LayoutControl.getCenterY(-1, height);
        var textui = root.queryTextUI("default_window");

        var pic;
		if (textui !== null) {
			pic = textui.getUIImage();
		}
		
		if (pic !== null) {
            var length = -1;
            var color = textui.getColor();
            var font = textui.getFont();
            var range = createRangeObject(x, y, width, height);
            var enemiesLoaded = this._enemyRangeCollector.getCurrentIndex();
            var enemyTotal = this._enemyRangeCollector.getEnemyCount();
            var text = "Loading Enemy Ranges: " + enemiesLoaded + "/" + enemyTotal;

			WindowRenderer.drawStretchWindow(x, y, width, height, pic);
            TextRenderer.drawRangeText(range, TextFormat.CENTER, text, length, color, font);
		}
    }
})