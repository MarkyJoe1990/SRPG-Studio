AIScorer.TradeAttack = defineObject(BaseAIScorer ,{
	getScore: function(unit, combination) {
		var searchMode = combination.searchMode;
		
		//If you lack a searchMode, or your search mode lacks weapon search
		if (searchMode == undefined || !(searchMode & ItemSearchMode.WEAPON)) {
			return AIValue.MIN_SCORE;
		}
		
		//If no weapon was found in first AIScorer
		
		var bestWeapon = this._getWeaponFromQueue(combination.tradeQueue);
		
		if (bestWeapon == null) {
			return AIValue.MIN_SCORE;
		}
		
		//use posIndex to determine theoretical range from the new position
		var currentIndex = combination.posIndex;
		var x = CurrentMap.getX(currentIndex);
		var y = CurrentMap.getY(currentIndex);
		var rangeMetrics = StructureBuilder.buildRangeMetrics();
		rangeMetrics.startRange = bestWeapon.getStartRange();
		rangeMetrics.endRange = bestWeapon.getEndRange();
		var unitType = unit.getUnitType();
		//var filter = FilterControl.getReverseFilter(unitType);
		
		var attackIndexArray = IndexArray.getBestIndexArray(x, y, rangeMetrics.startRange, rangeMetrics.endRange);
		var count = attackIndexArray.length;
		
		//For any target in range, score them.
		highestScore = 0;
		for (i = 0; i < count; i++) {
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
		
		if (highestScore <= 0) {
			return AIValue.MIN_SCORE;
		}
		
		return highestScore;
	},
	
	_getWeaponFromQueue: function(tradeQueue) {
		var i, count = tradeQueue.length;
		var weapon = null;
		
		for (i = 0; i < count; i++) {
			var currentItem = tradeQueue[i].destItem;
			
			if (currentItem.isWeapon()) {
				weapon = currentItem;
				break;
			}
		}
		
		return weapon;
	}
});