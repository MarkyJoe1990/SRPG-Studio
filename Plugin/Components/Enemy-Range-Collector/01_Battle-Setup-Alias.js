( function () {
    var alias3 = BattleSetupScene.moveSceneCycle;
    BattleSetupScene.moveSceneCycle = function() {
        if (CurrentMap.isEnemyRangeCollectorActive() === true) {
            CurrentMap.getEnemyRangeCollector().moveEnemyRangeCollector();
        }

        return alias3.call(this);
    }
}) ();