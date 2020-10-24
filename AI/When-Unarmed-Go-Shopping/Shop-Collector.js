var ShopCollector = defineObject(BaseCombinationCollector, {
	collectCombination: function(misc) {
		var unit = misc.unit;
		
		//If unit has a weapon to fight with, don't bother
		if (ItemControl.getEquippedWeapon(unit) != null) {
			return;
		}
		
		//In order to make our lives easy, we need to use the
		//this._setPlaceRangeCombination function.
		//This function will take every shop's position on the
		//map, and push it into a combination array.
		//But to use this function, we need rangeMetrics, which
		//tells the function whether we need to check the chosen
		//position, or the spots AROUND it.
		//We also need a filter, which will make the positions
		//we get only be shops.
		var rangeMetrics = StructureBuilder.buildRangeMetrics();
		rangeMetrics.rangeType = SelectionRangeType.SELFONLY;
		var filter = PlaceEventFilterFlag.SHOP;
		
		this._setPlaceRangeCombination(misc, filter, rangeMetrics);
		//Now we have a combination array of every shop on the map,
		//but they are only stored as positions. The information
		//about each shop is not known yet.
		//We will need to fetch the shop data in the AIScorer
	},
	
	_setPlaceRangeCombination: function(misc, filter, rangeMetrics) {
		var i, x, y, event, indexArray, combination, flag, placeInfo;
		var list = root.getCurrentSession().getPlaceEventList();
		var count = list.getCount();
		
		for (i = 0; i < count; i++) {
			event = list.getData(i);
			if (event.getExecutedMark() === EventExecutedType.EXECUTED || !event.isEvent()) {
				continue;
			}
			
			placeInfo = event.getPlaceEventInfo();
			flag = placeInfo.getPlaceEventFilterFlag();
			if (!(flag & filter)) {
				continue;
			}
			
			if (placeInfo.getPlaceEventType() == PlaceEventType.SHOP) {
				currentShop = placeInfo.getShopData();
				
				//Check for equippable weapons in the shop
				//If there are none, don't even consider this as an option
				
				if (!this._shopHasEquippableWeapon(misc.unit, currentShop)) {
					continue;
				}
			}
			
			x = placeInfo.getX();
			y = placeInfo.getY();
			indexArray = IndexArray.createRangeIndexArray(x, y, rangeMetrics);
			
			misc.targetUnit = null;
			misc.indexArray = indexArray;
			misc.rangeMetrics = rangeMetrics;
			
			misc.costArray = this._createCostArray(misc);
			if (misc.costArray.length !== 0) {
				// There is a movable position, so create a combination.
				combination = this._createAndPushCombination(misc);
				combination.targetPos = createPos(x, y);
				combination.shop = currentShop;
				// Aim the place event in a priority.
				combination.isPriority = true;
			}
		}
	},
	
	_shopHasEquippableWeapon: function(unit, shop) {
		var i;
		var arr = shop.getShopitemArray();
		var amountArray = shop.getInventoryNumberArray();
		
		for (i = 0; i < arr.length; i++) {
			currentItem = arr[i];
			
			//If all of that weapon is gone, skip it
			if (amountArray[i].getAmount() == -1) {
				continue;
			}
			
			//Is it usable?
			if (ItemControl.isWeaponAvailable(unit, currentItem)) {
				return true;
			}
		}
		
		return false;
	}
});