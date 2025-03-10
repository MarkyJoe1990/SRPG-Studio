/*
    Enemy is encouraged to walk to tiles
    that minimize movement spent.
*/

( function () {
    AIScorer.ShortWalk = defineObject(BaseAIScorer, {
        getScore: function(unit, combination) {
            return AIValue.MAX_MOVE - combination.movePoint;
        }
    });

    var alias1 = CombinationSelector._configureScorerSecond;
	CombinationSelector._configureScorerSecond = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.ShortWalk);
	}
}) ();