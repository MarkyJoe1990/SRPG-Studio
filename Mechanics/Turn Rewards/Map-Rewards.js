( function() {
	TurnRewardType = {
		ITEM: 0,
		WEAPON: 1,
		GOLD: 2,
		BONUS: 3
	}
	
	var alias1 = MapResultFlowEntry._setScrollData;
	MapResultFlowEntry._setScrollData = function() {
		//Current Session
		var session = root.getCurrentSession();
		var baseData = root.getBaseData();
		
		//Total Trophy List
		var list = session.getTrophyPoolList();
		var editor = session.getTrophyEditor();
		
		//Map Info
		var mapData = session.getCurrentMapInfo();
		var turnRewards = mapData.custom.turnRewards;
		
		if (turnRewards != undefined) {
			var i, count = turnRewards.length;
			for (i = 0; i < count; i++) {
				var currentReward = turnRewards[i];
				
				var currentTurn = currentReward.turn;
				var id = currentReward.id;
				var type = currentReward.type;
				var amount = currentReward.amount;
				
				var turnCount = session.getTurnCount();
				
				if (turnCount <= currentTurn || currentTurn == -1) {
					switch (type) {
						case TurnRewardType.ITEM:
						var item = baseData.getItemList().getDataFromId(id)
						if (item == null) {
							root.msg("INVALID ITEM ID\n\nPlease check the IDs your set for turn rewards and your Map Information's custom parameters");
						} else {
							editor.addItem(list, item, false);
						}
						break;
						case TurnRewardType.WEAPON:
						var item = baseData.getWeaponList().getDataFromId(id);
						if (item == null) {
							root.msg("INVALID WEAPON ID\n\nPlease check the IDs your set for turn rewards and your Map Information's custom parameters");
						} else {
							editor.addItem(list, item, false);
						}
						break;
						case TurnRewardType.GOLD: editor.addGold(list, amount, false);
						break;
						case TurnRewardType.BONUS: editor.addBonus(list, amount, false);
						break;
					}
				}
			}
		}
		
		alias1.call(this);
	}
}) ();