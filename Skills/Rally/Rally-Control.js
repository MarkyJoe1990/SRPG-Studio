var RallyControl = {
	getUnitFilter: function(unit, rally) {
		var unitType = unit.getUnitType();
		var rallyFilter;
			
		rallyFilter = rally.custom.unitFilter;
			
		if (rallyFilter == RallyFilterType.PLAYER) {
			return FilterControl.getNormalFilter(unitType);
		} else if (rallyFilter == RallyFilterType.ENEMY) {
			return FilterControl.getReverseFilter(unitType);
		} else {
			return UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY;
		}
	},
	
	isFilterMatch: function(unitType, filterFlag) {
		if ((filterFlag & UnitFilterFlag.PLAYER) && (unitType === UnitType.PLAYER)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ALLY) && (unitType === UnitType.ALLY)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ENEMY) && (unitType === UnitType.ENEMY)) {
			return true;
		}
		
		return false;
	}
	
}