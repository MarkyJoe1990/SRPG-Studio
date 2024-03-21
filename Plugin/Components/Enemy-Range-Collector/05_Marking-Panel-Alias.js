
( function () {
    // ALL OF THESE ARE OVERWRITTEN
    MarkingPanel.drawMarkingPanel = function() {
        // if (this.isMarkingEnabled() !== true) {
        //     return;
        // }
        
        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        if (enemyRangeCollector == null) {
            return;
        }

        if (ENEMY_RANGE_COLLECTOR_CONFIG.disableCustomRangeDisplay !== true) {
            // EdgeRangeControl.drawEdgeRange(indexArrayObject.indexArray, switchArray, ENEMY_RANGE_IMAGE_SET);
            enemyRangeCollector.drawRangeDisplay();
            return;
        }
        
        var indexArrayObject = null;
        if (this._isVisible === true) {
            indexArrayObject = enemyRangeCollector.getCombinedIndexArray();
            switchArray = enemyRangeCollector.getSwitchArray();
        } else {
            indexArrayObject = enemyRangeCollector.getIndividualIndexArray();
            switchArray = enemyRangeCollector.getIndividualSwitchArray();
        }

        root.drawFadeLight(indexArrayObject.indexArray, this._getColor(), this._getAlpha());
        root.drawFadeLight(indexArrayObject.weaponIndexArray, this._getColor(), this._getAlpha());
	}
	
    // Disable MarkingPanel's unit range calculation functions
    MarkingPanel.updateMarkingPanel = function() {}
    MarkingPanel.updateMarkingPanelFromUnit = function(unit) {}
    MarkingPanel._getColor = function() { return ENEMY_RANGE_COLLECTOR_CONFIG.markingColor; }

    var alias1 = MarkingPanel.startMarkingPanel;
    MarkingPanel.startMarkingPanel = function() {
        alias1.call(this);

        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        if (enemyRangeCollector == null) {
            return;
        }

		enemyRangeCollector.updateRangeDisplay(this);
    }
}) ();