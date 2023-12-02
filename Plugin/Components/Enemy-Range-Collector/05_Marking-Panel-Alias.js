
( function () {
    // ALL OF THESE ARE OVERWRITTEN
    MarkingPanel.drawMarkingPanel = function() {
		if (!this.isMarkingEnabled()) {
			return;
		}
        
        var combinedIndexArray = CurrentMap.getEnemyRangeCollector().getCombinedIndexArray();
		root.drawFadeLight(combinedIndexArray.indexArray, this._getColor(), this._getAlpha());
		root.drawFadeLight(combinedIndexArray.weaponIndexArray, this._getColor(), this._getAlpha());
	}
	
    // Disable MarkingPanel's unit range calculation functions
    MarkingPanel.updateMarkingPanel = function() {}
    MarkingPanel.updateMarkingPanelFromUnit = function(unit) {}
}) ();