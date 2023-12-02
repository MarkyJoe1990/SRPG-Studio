( function () {
    // Additional CurrentMap Methods
    CurrentMap._enemyRangeCollector = null;
    var alias2 = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function() {
        alias2.call(this);
        this._enemyRangeCollector = null;
    };

    CurrentMap.getEnemyRangeCollector = function() {
        return this._enemyRangeCollector;
    }

    CurrentMap.resetEnemyRangeCollector = function() {
        this._enemyRangeCollector = createObject(EnemyRangeCollector);
    }

    CurrentMap.isEnemyRangeCollectorActive = function() {
        return this._enemyRangeCollector != null;
    }
}) ();