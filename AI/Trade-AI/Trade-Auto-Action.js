var TradeAutoAction = defineObject(BaseAutoAction, {
	setAutoActionInfo: function(unit, combination) {
		this._unit = unit;
		this._tradeTarget = combination.targetUnit;
		this._weaponToGet = combination.bestWeapon;
		this._weaponIndex = combination.bestWeaponIndex;
		this._itemToGet = combination.bestItem;
		this._itemIndex = combination.bestItemIndex;
	},
	
	enterAutoAction: function() {
		if (this._weaponToGet != null && this._itemToGet != null) {
			//Determine which one to get first
			root.log("Weapon Index: " + this._weaponIndex);
			root.log("Item Index: " + this._itemIndex);
			
			if (this._weaponIndex < this._itemIndex) {
				root.log("Take item first");
				this._takeItem();
				this._takeWeapon();
			} else {
				root.log("Take weapon first");
				this._takeWeapon();
				this._takeItem();
			}
			
			root.log("Took both");
			return EnterResult.NOTENTER;
		}
		
		if (this._weaponToGet != null) {
			root.log("Take only weapon?");
			this._takeWeapon();
		}
		if (this._itemToGet != null) {
			root.log("Take only item?");
			this._takeItem();
		}
		
		return EnterResult.NOTENTER;
	},
	
	_takeWeapon: function() {
		//Remove weapon from target's inventory
		UnitItemControl.cutItem(this._tradeTarget, this._weaponIndex);
		
		//If inventory full...
		if (!UnitItemControl.pushItem(this._unit, this._weaponToGet)) {
			//Give target unit item in position 0
			var giveItem = UnitItemControl.cutItem(this._unit, 0);
			UnitItemControl.pushItem(this._tradeTarget, giveItem)
			UnitItemControl.pushItem(this._unit, this._weaponToGet)
		}
	},
	
	_takeItem: function() {
		//Remove item from target's inventory
		UnitItemControl.cutItem(this._tradeTarget, this._itemIndex);
		
		//If inventory full...
		if (!UnitItemControl.pushItem(this._unit, this._itemToGet)) {
			//Give target unit item in position 1
			var giveItem = UnitItemControl.cutItem(this._unit, 1);
			UnitItemControl.pushItem(this._tradeTarget, giveItem)
			UnitItemControl.pushItem(this._unit, this._itemToGet)
			
		}
	},
	
	moveAutoAction: function() {
		return MoveResult.END;
	},
	
	drawAutoAction: function() {
	},
	
	isSkipMode: function() {
		return CurrentMap.isTurnSkipMode();
	},
	
	isSkipAllowed: function() {
		return true;
	}
});

AutoActionBuilder._pushTrade = function(unit, autoActionArray, combination) {
	var autoAction = createObject(TradeAutoAction);
	
	autoAction.setAutoActionInfo(unit, combination);
	autoActionArray.push(autoAction);
}