( function () {
    AIScorer.UnitEvent = defineObject(BaseCombinationCollector, {
        getScore: function(unit, combination) {
            if (combination.event == null) {
                return AIValue.MIN_SCORE;
            }

            return combination.event.custom.aiSteps[0].getScore(unit, combination);
        }
    });

    var alias1 = CombinationSelector._configureScorerFirst;
	CombinationSelector._configureScorerFirst = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.UnitEvent);
	}
}) ();