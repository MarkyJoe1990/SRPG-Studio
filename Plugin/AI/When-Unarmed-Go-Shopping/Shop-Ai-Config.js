(function () {
	var alias1 = CombinationBuilder._configureCombinationCollector;
	CombinationBuilder._configureCombinationCollector = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(ShopCollector);
	}
	
	var alias2 = CombinationSelector._configureScorerFirst;
	CombinationSelector._configureScorerFirst = function(groupArray) {
		alias2.call(this, groupArray);
		groupArray.appendObject(AIScorer.Shop);
	}
	
	var alias3 = AutoActionBuilder._pushCustom;
	AutoActionBuilder._pushCustom = function(unit, autoActionArray, combination) {
		alias3.call(this, unit, autoActionArray, combination);
		var x, y;
		
		if (combination.bestWeapon != null) {
			x = combination.targetPos.x;
			y = combination.targetPos.y;
			
			
			if (PosChecker.getUnitFromPos(x, y) == null) {
				this._pushShop(unit, autoActionArray, combination);
			}
		}
	}
}) ();