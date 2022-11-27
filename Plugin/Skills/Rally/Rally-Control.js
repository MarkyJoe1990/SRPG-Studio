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
	},
	
	isRallyItem: function(combination) {
		var item = combination.item;

		if (item == null) {
			return false;
		}

		if (item.isWeapon()){
			return false;
		}
		
		if (item.getItemType() != ItemType.CUSTOM) {
			return false;
		}
		
		return item.getCustomKeyword() == "Rally";
	},
	
	isRallySkill: function(combination) {
		var skill = combination.skill;
		
		if (skill == null) {
			return false;
		}
		
		if (skill.getSkillType() != SkillType.CUSTOM) {
			return false;
		}
		
		return skill.getCustomKeyword() == "Rally";
	}
	
}