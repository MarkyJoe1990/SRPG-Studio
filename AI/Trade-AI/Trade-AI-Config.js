(function () {
	var alias1 = AutoActionBuilder._pushCustom;
	AutoActionBuilder._pushCustom= function(unit, autoActionArray, combination) {
		alias1.call(this, unit, autoActionArray, combination);
		
		if (combination.searchMode != null) {
			this._pushTrade(unit, autoActionArray, combination);
			
			if (combination.bestItem != null) {
				combination.item = combination.bestItem;
				combination.targetUnit = unit;
				this._pushItem(unit, autoActionArray, combination);
			} else if (combination.bestTarget != null) {
				combination.targetUnit = combination.bestTarget;
				this._pushAttack(unit, autoActionArray, combination);
			}
		}
	}
}) ();