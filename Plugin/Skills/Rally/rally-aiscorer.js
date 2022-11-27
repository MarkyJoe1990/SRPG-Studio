AIScorer.Rally = defineObject(BaseAIScorer,{
	getScore: function(unit, combination) {
		var score = 50;
		
		if (!RallyControl.isRallySkill(combination) && !RallyControl.isRallyItem(combination)) {
			return 0;
		} else if (RallyControl.isRallySkill(combination) && combination.skill.custom.rangeType != RallyRangeType.MULTI) {
			return 0;
		}
		destIndex = combination.posIndex;
		var x = CurrentMap.getX(destIndex);
		var y = CurrentMap.getY(destIndex);
		var rangeMetrics = combination.rangeMetrics;
		
		indexArray = IndexArray.getBestIndexArray(x, y, rangeMetrics.startRange, rangeMetrics.endRange);
		for (i = 0; i < indexArray.length; i++) {
			currentIndex = indexArray[i];
			currentX = CurrentMap.getX(currentIndex);
			currentY = CurrentMap.getY(currentIndex);
			
			currentUnit = PosChecker.getUnitFromPos(currentX, currentY);
			if (currentUnit != null) {
				score += 10;
			}
		}
		return score + this._getPlusScore(unit, combination);
	}
});

var alias1 = CombinationSelector._configureScorerSecond;
CombinationSelector._configureScorerSecond = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendObject(AIScorer.Rally);
	
}