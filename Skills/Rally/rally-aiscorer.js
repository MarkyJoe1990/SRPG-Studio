AIScorer.Rally = defineObject(BaseAIScorer,{
	getScore: function(unit, combination) {
		var score = 50;
		
		if (combination.skill == null) {
			return 0;
		}
		
		if (combination.skill.getSkillType() != SkillType.CUSTOM || combination.skill.getCustomKeyword() != "Rally") {
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
		return score;
	}
});

var alias1 = CombinationSelector._configureScorerSecond;
CombinationSelector._configureScorerSecond = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendObject(AIScorer.Rally);
	
}