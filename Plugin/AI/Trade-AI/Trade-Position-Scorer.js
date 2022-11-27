AIScorer.TradePosScorer = defineObject(BaseAIScorer, {
	getScore: function(unit, combination) {
		var score = 0;
		
		if (combination.tradeQueue == null) {
			return score;
		}
		
		currentIndex = combination.posIndex;
		
		if (currentIndex == combination.idealIndex) {
			score += 50;
		} else {
			score -= 50;
		}
		
		return score;
	}
})

var alias4 = CombinationSelector._configureScorerSecond;
CombinationSelector._configureScorerSecond = function(groupArray) {
	alias4.call(this, groupArray);
	groupArray.appendObject(AIScorer.TradePosScorer);
}