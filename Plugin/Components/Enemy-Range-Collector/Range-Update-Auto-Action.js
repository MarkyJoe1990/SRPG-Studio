// This exists mostly to push range updating at the veeeery end
// of all enemy actions

var RangeUpdateAutoAction = defineObject(BaseAutoAction, {
	setAutoActionInfo: function(unit) {
		this._unit = unit;
	},
	
	enterAutoAction: function() {
        var unit = this._unit;
        var enemyRangeCollector = CurrentMap.getEnemyRangeCollector();
        var rangeData = enemyRangeCollector.getUnitRangeData(unit);
        if (rangeData != null) {
            enemyRangeCollector.removeFromCombinedIndexArray(rangeData);
            enemyRangeCollector.updateRangeData(rangeData);
            enemyRangeCollector.addToCombinedIndexArray(rangeData);
            enemyRangeCollector.updateVisuals();
        }

        return EnterResult.NOTENTER;
	}
});