var ItemSearchMode = {
	NONE: 0x00,
	WEAPON: 0x01,
	HEALING: 0x02
}

CombinationCollector.Trade = defineObject(BaseCombinationCollector, {
	collectCombination: function(misc) {
		var unit = misc.unit;
		var weapon = ItemControl.getEquippedWeapon(unit);
		var filter, rangeMetrics;
		var searchMode = ItemSearchMode.NONE;
		
		var name = unit.getName();
		root.log("==============");
		root.log("Current Unit: " + name);
		//If unit lacks a weapon, enable weapon search mode
		if (weapon == null) {
			searchMode = searchMode | ItemSearchMode.WEAPON;
			root.log(name + " lacks a weapon!");
		}
		
		//If unit lacks an item with the item types
		//for healing, enable item search mode
		if (unit.getHp() <= 10 && !this._hasHealingItem(unit, unit)) {
			searchMode = searchMode | ItemSearchMode.HEALING;
			root.log(name + " lacks a healing item and is low!");
		}
		
		root.log(name + "'s mode: " + searchMode);
		
		//If neither of these are true, return
		if (typeof searchMode != "number" || searchMode == ItemSearchMode.NONE) {
			root.log("Fuck off, " + name + "!");
			return;
		}
		
		rangeMetrics = StructureBuilder.buildRangeMetrics();
		rangeMetrics.startRange = 1;
		rangeMetrics.endRange = 1;
		filter = FilterControl.getNormalFilter(unit.getUnitType());
		misc.searchMode = searchMode
		
		this._setUnitRangeCombination(misc, filter, rangeMetrics);
	},
	
	_setUnitRangeCombination: function(misc, filter, rangeMetrics) {
		var i, j, indexArray, list, targetUnit, targetCount, score, combination, aggregation;
		var unit = misc.unit;
		var filterNew = this._arrangeFilter(unit, filter);
		var listArray = this._getTargetListArray(filterNew, misc);
		var listCount = listArray.length;
		var searchMode = misc.searchMode;
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			targetCount = list.getCount();
			for (j = 0; j < targetCount; j++) {
				targetUnit = list.getData(j);
				root.log("Checking... " + targetUnit.getName());
				if (unit === targetUnit) {
					root.log("Nope Unit");
					continue;
				}
				
				if (searchMode & ItemSearchMode.WEAPON && !this._hasSpareWeapons(unit, targetUnit)) {
					root.log("Nope Weapon");
					continue;
				}
				
				if (searchMode & ItemSearchMode.HEALING && !this._hasHealingItem(unit, targetUnit)) {
					root.log("Nope Heal");
					continue;
				}
				
				score = this._checkTargetScore(unit, targetUnit);
				if (score < 0) {
					root.log("Noper");
					continue;
				}
				
				// Calculate a series of ranges based on the current position of targetUnit (not myself, but the opponent).
				indexArray = IndexArray.createRangeIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), rangeMetrics);
				
				misc.targetUnit = targetUnit;
				misc.indexArray = indexArray;
				misc.rangeMetrics = rangeMetrics;
				
				// Get an array to store the position to move from a series of ranges.
				misc.costArray = this._createCostArray(misc);
				
				if (misc.costArray.length !== 0) {
					// There is a movable position, so create a combination.
					combination = this._createAndPushCombination(misc);
					combination.plusScore = score;
					combination.searchMode = misc.searchMode;
				}
			}
		}
	},
	
	_hasSpareWeapons: function(unit, targetUnit) {
		var i, count;
		count = UnitItemControl.getPossessionItemCount(targetUnit);
		var offLimitsWeapon = ItemControl.getEquippedWeapon(targetUnit);
		hasSpareWeapons = false;
		
		if (count == 0) {
			return false;
		}
		
		for (i = 0; i < count; i++) {
			currentItem = UnitItemControl.getItem(targetUnit, i);
			
			if (currentItem == offLimitsWeapon) {
				root.log("Current item matches!");
				continue;
			}
			root.log("Current item NOT match!");
			root.log("Is it available? " + ItemControl.isWeaponAvailable(unit, currentItem));
			
			if (ItemControl.isWeaponAvailable(unit, currentItem)) {
				hasSpareWeapons = true;
				root.log("Weapon is available!");
				break;
			}
		}
		
		return hasSpareWeapons;
	},
	
	_hasHealingItem: function(unit, targetUnit) {
		var i, count;
		count = UnitItemControl.getPossessionItemCount(targetUnit);
		hasHealingItems = false;
		
		if (count == 0) {
			return false;
		}
		
		for (i = 0; i < count; i++) {
			currentItem = UnitItemControl.getItem(targetUnit, i);
			
			//if you can't use it, no.
			if (!ItemControl.isItemUsable(unit, currentItem)) {
				continue;
			}
			
			//If it's MULTI range type, no
			if (currentItem.getRangeType() == SelectionRangeType.MULTI) {
				continue;
			}
			
			itemType = currentItem.getItemType();
			if (itemType == ItemType.RECOVERY || itemType == ItemType.ENTIRERECOVERY) {
				hasHealingItems = true;
				break;
			}
			
		}
		
		return hasHealingItems;
	}
});

(function () {
	var alias1 = CombinationBuilder._configureCombinationCollector;
	CombinationBuilder._configureCombinationCollector = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(CombinationCollector.Trade);
	}
	
}) ();