( function () {
    var alias1 = BaseCombinationCollector._createAndPushCombination;
    BaseCombinationCollector._createAndPushCombination = function(misc) {
        var combination = alias1.call(this, misc);
        combination.event = misc.event;
        return combination;
    }

    var alias2 = AutoActionBuilder._pushCustom;
    AutoActionBuilder._pushCustom = function(unit, autoActionArray, combination) {
        alias2.call(this, unit, autoActionArray, combination);

        if (combination.event != null) {
            this._pushEvent(unit, autoActionArray, combination);
        }
    }

    AutoActionBuilder._pushEvent = function(unit, autoActionArray, combination) {
		var autoAction = createObject(UnitEventAutoAction);
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	}
}) ();