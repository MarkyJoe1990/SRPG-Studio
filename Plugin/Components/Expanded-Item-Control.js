/*
    Version 1.1
    Made By MarkyJoe1990

    When using ID Variables, the editor needs a way to distinguish items from weapons.
    The way the SRPG Studio developers handled this was by adding 65,536 (0x10000 in hexidecimal)
    to the IDs of items when they are stored as variables, but keeping weapon IDs the same.

    What this means is that if you are trying to write code that stores items as variables
    for use in the editor - such as with Execute Script - you need to account for this.
    That's what this wrapper is for.
*/

var ExpandedItemControl = {
    getItemFromId: function(itemId) {
        var itemIdCompensation = this.getItemIdCompensation();
        if (itemId >= itemIdCompensation) {
            return root.getBaseData().getItemList().getDataFromId(itemId - itemIdCompensation);
        }

        return root.getBaseData().getWeaponList().getDataFromId(itemId);
    },

    getConvertedItemId: function(item) {
        if (item == null) {
            return -1;
        }

        if (item.isWeapon() === true) {
            return item.getId();
        }

        return item.getId() + this.getItemIdCompensation();
    },

    getItemIdCompensation: function() {
        return 0x10000;
    }
}

// Shortcut Function
var EIC = ExpandedItemControl;