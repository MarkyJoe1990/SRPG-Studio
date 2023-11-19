/*
    Version 1.0
    Made by MarkyJoe1990

    This simple plugin allows for the option to convert an item
    into another item when traded from a player unit into an
    enemy unit's inventory.

    How to use:
    - Make sure you've downloaded and installed my "Expanded-Item-Control.js" file from my github. It's in the Wrapper folder.
    - Place both this file and Expanded-Item-Control.js in your plugins folder.
    - Go to your desired weapon or item.
    - Click Custom Parameters
    - add a new property "itemIdOnEnemyTrade"
    - Set it to the same ID as the weapon or item you want the item to transform into.
    - If the item is NOT a weapon, add "+ 0x10000" to the id.
    - Example:
        {
            itemIdOnEnemyTrade: 0 + 0x10000
        }
    - That will convert the item into an item with the ID of 0 in the database item list.
    - If you want it to become a weapon instead, remove "+ 0x10000"
*/

( function() {
    var alias1 = UnitItemTradeScreen._exchangeItem;
    UnitItemTradeScreen._exchangeItem = function() {
		var unitSrc = this._getTargetUnit(this._isSrcSelect);
		var unitDest = this._getTargetUnit(this._isSrcScrollbarActive);
		var srcIndex = this._selectIndex;
		var destIndex = this._getTargetIndex();
		var itemSrc = unitSrc.getItem(srcIndex);
		var itemDest = unitDest.getItem(destIndex);

        // Run original code.
        alias1.call(this);

        // If the target unit is an enemy.
        if (unitDest.getUnitType() == UnitType.ENEMY) {

            // Check if the item traded to them can be converted
            var itemIdOnEnemyTrade = itemSrc.custom.itemIdOnEnemyTrade;
            if (typeof itemIdOnEnemyTrade == "number") {
                var newItemSrc = ExpandedItemControl.getItemFromId(itemIdOnEnemyTrade);
                if (newItemSrc != null) {
                    // Replace the enemy's original obtained item with the new one.
                    UnitItemControl.setItem(unitDest, destIndex, root.duplicateItem(newItemSrc));
                }
            }
        }
    }
}) ();