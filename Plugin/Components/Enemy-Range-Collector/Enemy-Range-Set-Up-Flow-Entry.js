var EnemyRangeSetUpFlowEntry = defineObject(BaseFlowEntry, {
    enterFlowEntry: function() {
        CurrentMap.resetEnemyRangeCollector();
        return EnterResult.NOTENTER;
    }
});

( function () {
    var alias1 = BattleSetupScene._pushFlowBeforeEntries;
    BattleSetupScene._pushFlowBeforeEntries = function(straightFlow) {
        alias1.call(this, straightFlow);
        straightFlow.pushFlowEntry(EnemyRangeSetUpFlowEntry);
    }
}) ();