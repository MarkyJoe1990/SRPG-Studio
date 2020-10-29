AIScorer.TradeAttack = defineObject(BaseAIScorer ,{
	getScore: function(unit, combination) {
		var searchMode = combination.searchMode;
		
		//If you lack a searchMode, or your search mode lacks weapon search
		if (searchMode == undefined || !(searchMode & ItemSearchMode.WEAPON)) {
			return AIValue.MIN_SCORE;
		}
		
		//If no weapon was found in first AIScorer
		if (combination.bestWeapon == null) {
			return AIValue.MIN_SCORE;
		}
		
		root.log("Is it?");
		
		//use posIndex to determine theoretical range from the new position
		var currentIndex = combination.posIndex;
		var x = CurrentMap.getX(currentIndex);
		var y = CurrentMap.getY(currentIndex);
		var rangeMetrics = StructureBuilder.buildRangeMetrics();
		rangeMetrics.startRange = combination.bestWeapon.getStartRange();
		rangeMetrics.endRange = combination.bestWeapon.getEndRange();
		var unitType = unit.getUnitType();
		//var filter = FilterControl.getReverseFilter(unitType);
		
		var attackIndexArray = IndexArray.getBestIndexArray(x, y, rangeMetrics.startRange, rangeMetrics.endRange);
		
		//For any target in range, score them.
		highestScore = 0;
		for (i = 0; i < attackIndexArray.length; i++) {
			currentAttackIndex = attackIndexArray[i];
			currentX = CurrentMap.getX(currentAttackIndex);
			currentY = CurrentMap.getY(currentAttackIndex);
			
			targetUnit = PosChecker.getUnitFromPos(currentX, currentY);
			
			//If this isn't an enemy unit, continue
			if (targetUnit == null || targetUnit == unit || !FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
				continue;
			}
			
			currentScore = 50;
			//Score currentUnit;
			//currentScore += 
			
			if (currentScore > highestScore) {
				highestScore = currentScore;
				combination.bestTarget = targetUnit;
			}
		}
		
		return highestScore;
	}
});

(function () {
	var alias1 = CombinationSelector._configureScorerSecond;
	CombinationSelector._configureScorerSecond = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.TradeAttack);
	}
}) ();