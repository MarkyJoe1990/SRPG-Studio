var EnemyRangeSetUpFlowEntry = defineObject(BaseFlowEntry, {
    enterFlowEntry: function() {
        CurrentMap.resetEnemyRangeCollector();
        return EnterResult.NOTENTER;
    }
});