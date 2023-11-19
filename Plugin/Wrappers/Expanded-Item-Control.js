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
    },

    filterItemIdArray: function(itemIdArray, func) {
        var newArr = [];
        var i, currentItemId, currentItem, count = itemIdArray.length;

        // Defaults
        itemIdArray = itemIdArray || [];
        func = func || function(item) {
            return true;
        };

        // Filter
        for (i = 0; i < count; i++) {
            currentItemId = itemIdArray[i];
            currentItem = this.getItemFromId(currentItemId);

            if (currentItem == null) {
                continue;
            }

            if (func(currentItem) === true) {
                newArr.push(currentItemId);
            }
        }

        return newArr;
    },

    createItemList: function(itemIdArray, func) {
        if (func != undefined) {
            itemIdArray = this.filterItemIdArray(itemIdArray, func);
        }

        var list = this.buildDataList();
        list.getDataFromId = function(id) {
            var i, currentObject, count = this._arr.length;
            for (i = 0; i < count; i++) {
                currentObject = this.getData(i);

                if (currentObject.getId() === id) {
                    return currentObject;
                }
            }

            return null;
        }

        list.setDataArray(itemIdArray || []);
        return list;
    },

    filterItemList: function(itemList, func) {
        var list = this.buildDataList();
        var newArr = [];
        var i, currentItem, count = itemList.getCount();
        for (i = 0; i < count; i++) {
            currentItem = itemList.getData(i);
            if (func(currentItem) === true) {
                newArr.push(currentItem);
            }
        }

        list.setDataArray(newArr);
        return list;
    },

    // Normally, StructureBuilder.buildDataList lacks getDataFromId method.
    // This adds it so the list functions properly in certain contexts.
    buildDataList: function() {
        var list = StructureBuilder.buildDataList();
        list.getDataFromId = function(id) {
            var i, currentObject, count = this._arr.length;
            for (i = 0; i < count; i++) {
                currentObject = this.getData(i);

                if (currentObject.getId() === id) {
                    return currentObject;
                }
            }

            return null;
        }

        return list;
    }
}

// Shortcut Function
var EIC = ExpandedItemControl;