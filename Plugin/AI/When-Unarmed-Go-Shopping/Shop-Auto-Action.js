var ShopAutoActionMode = {
	CURSORSHOW: 0,
	SHOP: 1
}

AutoActionBuilder._pushShop = function(unit, autoActionArray, combination) {
	var autoAction = createObject(ShopAutoAction);
	
	autoAction.setAutoActionInfo(unit, combination);
	autoActionArray.push(autoAction);
}

var ShopAutoAction = defineObject(BaseAutoAction, {
	_unit: null,
	_weapon: null,
	_targetPos: null,
	_waitCounter: null,
	_autoActionCursor: null,
	_dynamicEvent: null,
	
	setAutoActionInfo: function(unit, combination) {
		this._unit = unit;
		this._weapon = combination.bestWeapon;
		this._targetPos = combination.targetPos;
		this._waitCounter = createObject(CycleCounter);
		this._autoActionCursor = createObject(AutoActionCursor);
		this._dynamicEvent = createObject(DynamicEvent);
		this._shop = combination.shop;
		this._itemIndex = combination.itemIndex;
	},
	
	enterAutoAction: function() {
		var isSkipMode = this.isSkipMode();
		
		//Execute item event
		if (isSkipMode) {
			if (this._enterShop() === EnterResult.NOTENTER) {
				return EnterResult.NOTENTER;
			}
			
			this.changeCycleMode(ShopAutoActionMode.SHOP);
		}
		else {
			this._changeCursorShow();
			this.changeCycleMode(ShopAutoActionMode.CURSORSHOW);
		}
		
		return EnterResult.OK;
	},
	
	moveAutoAction: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		if (mode === ShopAutoActionMode.CURSORSHOW) {
			result = this._moveCursorShow();
		}
		else if (mode === ShopAutoActionMode.SHOP) {
			result = this._moveShop();
		}
		
		return result;
	},
	
	drawAutoAction: function() {
		var mode = this.getCycleMode();
		
		if (mode === ShopAutoActionMode.CURSORSHOW) {
			this._drawCurosrShow();
		}
		else if (mode === ShopAutoActionMode.SHOP) {
			this._drawPreAttack();
		}
	},
	
	_moveCursorShow: function() {
		var isSkipMode = this.isSkipMode();
		
		if (isSkipMode || this._autoActionCursor.moveAutoActionCursor() !== MoveResult.CONTINUE) {
			if (isSkipMode) {
				this._autoActionCursor.endAutoActionCursor();
			}
			
			if (this._enterShop() === EnterResult.NOTENTER) {
				return MoveResult.END;
			}
		
			this.changeCycleMode(WeaponAutoActionMode.SHOP);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveShop: function() {
		if (this._dynamicEvent.moveDynamicEvent() !== MoveResult.CONTINUE) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_drawCurosrShow: function() {
		this._autoActionCursor.drawAutoActionCursor();
	},
	
	_drawShop: function() {
	},
	
	_changeCursorShow: function() {
		this._autoActionCursor.setAutoActionPos(this._targetPos.x, this._targetPos.y, true);
	},
	
	_enterShop: function() {
		var generator = this._dynamicEvent.acquireEventGenerator();
		generator.unitItemChange(this._unit, this._weapon, IncreaseType.INCREASE, this.isSkipMode());
		this._dynamicEvent.executeDynamicEvent();
		
		//Reduce item in store
		//If item has no more in it, remove the item from the store
		this._decrementShopItem(this._itemIndex, this._shop);
		
		return EnterResult.NOTENTER;
	},
	
	_decrementShopItem: function(index, shop) {
		var n;
		var itemArray = shop.getShopItemArray();
		var invNumberArray = shop.getInventoryNumberArray();
		
		var obj = invNumberArray[index];
		
		//Decrement shop item
		if (obj.getAmount() <= 0) {
			return;
		}
		
		n = obj.getAmount() - 1;
		
		
		if (n === 0) {
			obj.setAmount(-1);
			itemArray.splice(index, 1);
			invNumberArray.splice(index, 1);
		} else {
			obj.setAmount(n);
		}
	},
	
	isSkipAllowed: function() {
		return true;
	}
});