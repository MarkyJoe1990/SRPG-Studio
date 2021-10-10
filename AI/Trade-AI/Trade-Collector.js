var ItemSearchMode = {
	NONE: 0x00,
	WEAPON: 0x01,
	HEALING: 0x02,
	BOTH: 0x04
}

CombinationCollector.Trade = defineObject(BaseCombinationCollector, {
	collectCombination: function(misc) {
		var unit = misc.unit;
		var weapon = ItemControl.getEquippedWeapon(unit);
		var filter, rangeMetrics;
		var searchMode = ItemSearchMode.NONE;
		
		var name = unit.getName();
		
		//If unit lacks a weapon, enable weapon search mode
		if (weapon == null) {
			searchMode = searchMode | ItemSearchMode.WEAPON;
		}
		
		//If unit lacks an item with the item types
		//for healing, enable item search mode
		if (unit.getHp() <= 10 && !this._hasHealingItem(unit, unit)) {
			searchMode = searchMode | ItemSearchMode.HEALING;
			
		}
		
		//If neither of these are true, return
		if (typeof searchMode != "number" || searchMode == ItemSearchMode.NONE) {
			return;
		}
		
		rangeMetrics = StructureBuilder.buildRangeMetrics();
		rangeMetrics.startRange = 1;
		rangeMetrics.endRange = 1;
		
		var unitType;
		
		if (typeof NeutralControl !== 'undefined') {
			unitType = NeutralControl.getUnitType(unit);
		} else {
			unitType = unit.getUnitType();
		}
		
		filter = FilterControl.getNormalFilter(unitType);
		misc.searchMode = searchMode
		
		this._setTradeRangeCombination(misc, filter, rangeMetrics);
	},
	
	_setTradeRangeCombination: function(misc, filter, rangeMetrics) {
		var i, j, indexArray, list, targetUnit, importance, targetCount, score, combination, aggregation, additionalIndexArray;
		var unit = misc.unit;
		var filterNew = this._arrangeFilter(unit, filter);
		var listArray = this._getTargetListArray(filterNew, misc);
		var listCount = listArray.length;
		var searchMode = misc.searchMode;
		
		//You need to create a series of indexes based on where other units are
		
		var indexArray = [];
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			targetCount = list.getCount();
			for (j = 0; j < targetCount; j++) {
				targetUnit = list.getData(j);
				importance = targetUnit.getImportance();
				
				if (unit === targetUnit) {
					continue;
				}
				
				if (importance != ImportanceType.MOB) {
					continue;
				}
				
				if (searchMode == ItemSearchMode.WEAPON && !this._hasSpareWeapons(unit, targetUnit)) {
					continue;
				}
				
				if (searchMode == ItemSearchMode.HEALING && !this._hasHealingItem(unit, targetUnit)) {
					continue;
				}
				
				if (searchMode == ItemSearchMode.BOTH && !this._hasSpareWeapons(unit, targetUnit) && !this._hasHealingItem(unit, targetUnit)) {
					continue;
				}
				
				score = this._checkTargetScore(unit, targetUnit);
				if (score < 0) {
					continue;
				}
				
				// Calculate a series of ranges based on the current position of targetUnit (not myself, but the opponent).
				//You need to push the indexes into the indexArray
				additionalIndexArray = IndexArray.createRangeIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), rangeMetrics);
				
				this._combineIndexArrays(indexArray, additionalIndexArray);
			}
		}
		
		//misc.targetUnit = targetUnit;
		misc.indexArray = indexArray;
		misc.rangeMetrics = rangeMetrics;
		
		// Get an array to store the position to move from a series of ranges.
		misc.costArray = this._createCostArray(misc);
		var costArrayCount = misc.costArray.length;
		
		if (costArrayCount !== 0) {
			// There is a movable position, so create a combination.
			combination = this._createAndPushCombination(misc);
			combination.plusScore = score;
			combination.searchMode = misc.searchMode;
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
				continue;
			}
			
			if (ItemControl.isWeaponAvailable(unit, currentItem)) {
				hasSpareWeapons = true;
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
	},
	
	_combineIndexArrays: function(indexArray, additionalIndexArray) {
		var i, count = additionalIndexArray.length;
		
		for (i = 0; i < count; i++) {
			this._nonRedundantAdd(additionalIndexArray[i], indexArray);
		}
	},
	
	_nonRedundantAdd: function(element, array) {
		var low, mid, high;
		for (low = 0, high = array.length; low < high;) {
			mid = low + high >>> 1
			if (array[mid] < element) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}
		
		if (element != array[low]) {
			array.splice(low, 0, element)
		}
	}
});