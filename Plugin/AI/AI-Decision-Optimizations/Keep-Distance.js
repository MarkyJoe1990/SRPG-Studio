/*
    Enemy is encouraged to walk to tiles
    that maximize the distance between them
    and their target.
*/

( function () {
    AIScorer.KeepDistance = defineObject(BaseAIScorer, {
        getScore: function(unit, combination) {
            var targetUnit = combination.targetUnit;
            if (targetUnit == null) {
                return 0;
            }

            var index = combination.posIndex;
            var unitX = CurrentMap.getX(index);
            var unitY = CurrentMap.getY(index);
            var targetX = targetUnit.getMapX();
            var targetY = targetUnit.getMapY();

            var distX = Math.abs(unitX - targetX);
            var distY = Math.abs(unitY - targetY);

            return (distX + distY) * 2;
        }
    });

    var alias1 = CombinationSelector._configureScorerSecond;
	CombinationSelector._configureScorerSecond = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.KeepDistance);
	}
}) ();