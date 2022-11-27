var RallyItemSelectionObject = defineObject(BaseItemSelection, {
	
});

var RallyItemAvailabilityObject = defineObject(BaseItemAvailability, {
	
});

var RallyItemUseObject = defineObject(BaseItemUse, {
	enterMainUseCycle: function(itemUseParent) {
		var result = EnterResult.NOTENTER
		
		var itemTargetInfo = itemUseParent.getItemTargetInfo();
		
		this._itemUseParent = itemUseParent;
		
		if (result == EnterResult.NOTENTER) {
			this.mainAction();
		}
		
		return result;
	},
	
	moveMainUseCycle: function() {
		var result = MoveResult.END;
		
		if (result != MoveResult.CONTINUE) {
			this.mainAction();
		}
		
		return result;
	},
	
	mainAction: function() {
		//Make all enemies nearby have state
		var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
		var item = itemTargetInfo.item;
		var unit = itemTargetInfo.unit;
		var targetUnit = itemTargetInfo.targetUnit;
		var stateId = item.custom.stateId;
		var unitX = unit.getMapX();
		var unitY = unit.getMapY();
		var startRange = 1;
		var endRange = item.getRangeValue();
		var currentFilter = item.getFilterFlag();
		var currentIndexArray = IndexArray.getBestIndexArray(unitX, unitY, startRange, endRange);
		
		if (item.custom.includeSelf == true) {
			currentIndexArray.push(CurrentMap.getIndex(unitX, unitY));
		}
		
		for (x = 0; x < currentIndexArray.length; x++) {
			var currentIndex = currentIndexArray[x];
			var currentX = CurrentMap.getX(currentIndex);
			var currentY = CurrentMap.getY(currentIndex);
			
			var possibleUnit = PosChecker.getUnitFromPos(currentX, currentY);
			
			if (possibleUnit == null) {
				continue;
			}
			
			if (FilterControl.isBestUnitTypeAllowed(unit.getUnitType(), possibleUnit.getUnitType(), currentFilter)) {
				if (typeof stateId == "number") {
					currentState = root.getBaseData().getStateList().getDataFromId(stateId);
					StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
				} else {
					for (i = 0; i < stateId.length; i++) {
						currentState = root.getBaseData().getStateList().getDataFromId(stateId[i]);
						StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
					}
				}
			}
		}
	},
	
	_isFilterMatch: function(targetUnitType, filterFlag) {
		if ((filterFlag & UnitFilterFlag.PLAYER) && (targetUnitType === UnitType.PLAYER)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ALLY) && (targetUnitType === UnitType.ALLY)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ENEMY) && (targetUnitType === UnitType.ENEMY)) {
			return true;
		}
		
		return false;
	}
});

var RallyItemPotencyObject = defineObject(BaseItemPotency, {
	
});

(function() {
	var alias1 = ItemPackageControl.getCustomItemSelectionObject;
	ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
		if (keyword == "Rally") {
			return RallyItemSelectionObject
		}
		return alias1.call(this, item, keyword);
	}
	
	var alias2 = ItemPackageControl.getCustomItemUseObject;
	ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
		if (keyword == "Rally") {
			return RallyItemUseObject
		}
		return alias2.call(this, item, keyword);
	}
	
	var alias3 = ItemPackageControl.getCustomItemPotencyObject;
	ItemPackageControl.getCustomItemPotencyObject = function(item, keyword) {
		if (keyword == "Rally") {
			return RallyItemPotencyObject
		}
		return alias3.call(this, item, keyword);
	}
	
	var alias4 = ItemPackageControl.getCustomItemAvailabilityObject;
	ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
		if (keyword == "Rally") {
			return RallyItemAvailabilityObject;
		}
		return alias4.call(this, item, keyword);
	}
	
	var alias5 = ItemPackageControl.getCustomItemAIObject;
	ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
		if (keyword == "Rally") {
			return RallyAI;
		}
		return alias5.call(this, item, keyword);
	}
	
}) ();