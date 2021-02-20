var StatInfluencerControl = {
	getStatInfluencerArray: function(object) {
		if (object.custom.statInfluencerArray == undefined) {
			object.custom.statInfluencerArray = this.createStatInfluencerArray();
		}
		
		return object.custom.statInfluencerArray;
	},
	
	createStatInfluencerArray: function() {
		var count = ParamGroup.getParameterCount();
		var i = 0;
		var arr = [];
		
		for (i = 0; i < count; i++) {
			arr.push(0);
		}
		
		return arr;
	},
	
	getAllItemStatInfluencerArrays: function(virtualActive, virtualPassive, attackEntry) {
		var i, x, currentItem, currentSlot;
		var active = virtualActive.unitSelf;
		
		var itemCount = UnitItemControl.getPossessionItemCount(active);
		var itemStatInfluencerArray = this.createStatInfluencerArray();
		var statInfCount = itemStatInfluencerArray.length;
		var checkerArray = []
		var equippedWeapon = ItemControl.getEquippedWeapon(active);
		
		for (i = 0; i < itemCount; i++) {
			currentItem = UnitItemControl.getItem(active, i);
			
			if (!currentItem.isWeapon() && !ItemControl.isItemUsable(active, currentItem)) {
				continue;
			}
			
			if (currentItem.isWeapon() && currentItem != equippedWeapon) {
				continue;
			}
			
			currentItemInfArray = StatInfluencerControl.getStatInfluencerArray(currentItem);
			
			for (x = 0; x < statInfCount; x++) {
				itemStatInfluencerArray[x] += currentItemInfArray[x];
			}
		}
		
		return itemStatInfluencerArray;
	}
};