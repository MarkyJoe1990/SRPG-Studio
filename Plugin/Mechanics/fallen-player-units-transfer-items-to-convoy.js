/*
    Fallen player units transfer items to convoy
    By MarkyJoe1990 v1.0

    If a unit dies (as in DEATH, not injury), all of their
    items will be transferred to the convoy. A notification
    window will tell the player this as well so they are
    not blindsided by this information.

    However, if you wish to disable the notification window,
    simply set ENABLE_ITEM_TRANSFER_NOTIFICATION below to false.
*/

var ENABLE_ITEM_TRANSFER_NOTIFICATION = true;

( function () {
    // Treats all items as important and thus transfers them to
    // the convoy.
    var alias1 = ImportantItemFlowEntry._checkImportantItem;
    ImportantItemFlowEntry._checkImportantItem = function(unit, generator) {
		var i, item;
		var count = UnitItemControl.getPossessionItemCount(unit);
		var isDataAdd = false;
		var isSkipMode = true;
		
		// If the player unit is dead, check if the unit has important items.
		// The reason is if losing important items, there is a possibility that the game cannot be completed.
		// So if having important items, add them into a stock.
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			// Check if items are important items.
			if (item !== null/* && item.isImportance()*/) {
				// Send it to the stock only if it's not prohibited to trade.
				// Otherwise, the trade is satisfied through the items which have been set to the stock.
				if (!item.isTradeDisabled()) {
					isDataAdd = true;
					generator.stockItemChange(item, IncreaseType.INCREASE, isSkipMode);
					generator.unitItemChange(unit, item, IncreaseType.DECREASE, isSkipMode);
				}
			}
		}

        if (isDataAdd && ENABLE_ITEM_TRANSFER_NOTIFICATION) {
            generator.infoWindow(unit.getName() + "'s items have been transferred to the convoy.", InfoWindowType.INFORMATION, 0, 0, true);
        }
		
		return isDataAdd;
    }
}) ();