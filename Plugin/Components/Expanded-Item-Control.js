var ExpandedItemControl = {
    getItemFromId: function(itemId) {
        if (itemId >= 0x10000) {
            return root.getBaseData().getItemList().getDataFromId(itemId - 0x10000);
        }

        return root.getBaseData().getWeaponList().getDataFromId(itemId);
    }
}