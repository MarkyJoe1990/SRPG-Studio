var SelectorEventControl = {
    _varCache: null,
    _objectCache: null,

    init: function() {
        this._varCache = {};
        this._objectCache = {};
    },

    parseVariableString: function(variableString) { // Target Item
        if (this._varCache[variableString] != undefined) {
            return this._varCache[variableString];
        }

        var varTable, meta = root.getMetaSession(), count = 6; // Number of variable tables
        var x, count2;
        for (i = 0; i < count; i++) {
            varTable = meta.getVariableTable(i);
            count2 = varTable.getVariableCount();
            for (x = 0; x < count2; x++) {
                if (varTable.getVariableName(x) == variableString) {
                    var object = {
                        table: i,
                        index: x
                    };

                    this._varCache[variableString] = object;
                    return object;
                }
            }
        }

        root.msg("Could not parse " + variableString + " into a variable.");
        return null;
    },

    parseSelfSwitchString: function(selfSwitchString) {
        var result = selfSwitchString.toLowerCase();
        return result.charCodeAt(0) - 97;
    },

    createSelectorData: function(typeString) {
        return createObject(this.getSelectorData(typeString));
    },

    getSelectorData: function(typeString) {
        if (typeof typeString === "string") {
            var lowerCaseString = typeString.toLowerCase();
    
            if (this._objectCache[lowerCaseString] != undefined) {
                return this._objectCache[lowerCaseString];
            }
    
            var arr = [];
    
            this._configureSelectorDataArray(arr);
    
            var i, currentObject, count = arr.length;
            for (i = 0; i < count; i++) {
                currentObject = arr[i];
    
                if (currentObject.getSelectorDataName() === lowerCaseString) {
                    this._objectCache[lowerCaseString] = currentObject;
                    return currentObject;
                }
            }
        }

        return null;
    },

    getUnitStateList: function(unit) {
        var arr = [];

        var turnStateList = unit.getTurnStateList();
        var i, count = turnStateList.getCount();
        for (i = 0; i < count; i++) {
            arr.push(turnStateList.getData(i).getState());
        }

        var list = StructureBuilder.buildDataList();
        list.setDataArray(arr);
        return list;
    },

    getUnitSkillList: function(unit) {
        var arr = [];

        var skillArray = SkillControl.getDirectSkillArray(unit, -1, "");
        var i, count = skillArray.length;
        for (i = 0; i < count; i++) {
            arr.push(skillArray[i].skill);
        }

        var list = StructureBuilder.buildDataList();
        list.setDataArray(arr);
        return list;
    },

    getUnitItemList: function(unit) {
        var arr = [];

        var i, count = UnitItemControl.getPossessionItemCount(unit);
        for (i = 0; i < count; i++) {
            arr.push(UnitItemControl.getItem(unit, i));
        }

        var list = StructureBuilder.buildDataList();
        list.setDataArray(arr);
        return list;
    },

    getStockItemList: function() {
        var arr = [];

        var i, count = StockItemControl.getStockItemCount();
        for (i = 0; i < count; i++) {
            arr.push(StockItemControl.getStockItem(i));
        }

        var list = StructureBuilder.buildDataList();
        list.setDataArray(arr);
        return list;
    },

    getItemListFromIdArray: function(idArray, isRandomized, goalLength) {
        // Convert id array to object array
        var arr = [];
        var i, currentId, currentItem, count = idArray.length;
        var itemList = root.getBaseData().getItemList();
        var weaponList = root.getBaseData().getWeaponList();
        for (i = 0; i < count; i++) {
            currentId = idArray[i];
            if (currentId >= 0x10000) {
                currentItem = itemList.getDataFromId(currentId - 0x10000);
            } else {
                currentItem = weaponList.getDataFromId(currentId);
            }

            if (currentItem == null) {
                root.msg("Object Id: " + idArray[i] + " was not found in weapon/item list. Skipping.");
                continue;
            }

            arr.push(currentItem);
        }

        // Shuffle array if it's randomized
        var finalArr = [];
        if (isRandomized === true) {
            if (goalLength == undefined) {
                goalLength = arr.length;
            }

            finalArr = this.shuffle(arr.slice()).slice(0, goalLength);
        } else {
            finalArr = arr.slice();
        }

        // Convert array back to data list
        var list = StructureBuilder.buildDataList();
        list.setDataArray(finalArr);
        return list;
    },

    getUnitListFromIdArray: function(idArray, isRandomized, goalLength) {
        return this.getListFromIdArray(idArray, "unit", isRandomized, goalLength);
    },

    getClassListFromIdArray: function(idArray, isRandomized, goalLength) {
        return this.getListFromIdArray(idArray, "class", isRandomized, goalLength);
    },

    getStateListFromIdArray: function(idArray, isRandomized, goalLength) {
        return this.getListFromIdArray(idArray, "state", isRandomized, goalLength);
    },

    getSkillListFromIdArray: function(idArray, isRandomized, goalLength) {
        return this.getListFromIdArray(idArray, "state", isRandomized, goalLength);
    },

    getOriginalDataListFromIdArray: function(idArray, table, isRandomized, goalLength) {
        return this.getListFromIdArray(idArray, "originaldata" + table, isRandomized, goalLength)
    },

    getListFromIdArray: function(idArray, typeString, isRandomized, goalLength) {
        var selectorData = SelectorEventControl.getSelectorData(typeString);
        if (selectorData == null) {
            return null;
        }

        var typeName = selectorData.getSelectorDataName();
        var list = selectorData.getDefaultDataList();

        // Convert id array to object array
        var arr = [];
        var i, currentObject, count = idArray.length;
        for (i = 0; i < count; i++) {
            currentObject = list.getDataFromId(idArray[i]);
            if (currentObject == null) {
                root.msg("Object Id: " + idArray[i] + " was not found in " + typeName + " list. Skipping.");
                continue;
            }

            arr.push(currentObject);
        }

        // Shuffle array if it's randomized
        var finalArr = [];
        if (isRandomized === true) {
            if (goalLength == undefined) {
                goalLength = arr.length;
            }

            finalArr = this.shuffle(arr.slice()).slice(0, goalLength);
        } else {
            finalArr = arr.slice();
        }

        // Convert array to data list
        var newList = StructureBuilder.buildDataList();
        newList.setDataArray(finalArr);
        return newList;
    },

    getListFromOriginalContent: function(isRandomized, goalLength) {
        var content = root.getEventCommandObject().getOriginalContent();
        var aggregation = content.getTargetAggregation();

        // Convert data list to an array
        var arr = [];
        var i, count = aggregation.getObjectCount();
        for (i = 0; i < count; i++) {
            arr.push(aggregation.getObjectData(i));
        }

        // Shuffle array if it's randomized
        var finalArr = [];
        if (isRandomized === true) {
            if (goalLength == undefined) {
                goalLength = arr.length;
            }

            finalArr = this.shuffle(arr.slice()).slice(0, goalLength);
        } else {
            finalArr = arr.slice();
        }

        // Convert array back to a data list
        var list = StructureBuilder.buildDataList();
        list.setDataArray(finalArr);
        return list;
    },

    // Fisher-Yates Shuffle
    shuffle: function(arr) {
        var m = arr.length, t, i;

        while (m) {
          i = Probability.getRandomNumber() % m--;
          t = arr[m];
          arr[m] = arr[i];
          arr[i] = t;
        }
      
        return arr;
    },

    // Provides the scrollbar and the information displayer for
    // the object type in question.
    _configureSelectorDataArray: function(groupArray) {
        groupArray.push(SelectorData.Unit);
        groupArray.push(SelectorData.Class);
        groupArray.push(SelectorData.Item);
        groupArray.push(SelectorData.Weapon);
        groupArray.push(SelectorData.State);
        groupArray.push(SelectorData.Skill);
        groupArray.push(SelectorData.OriginalData1);
        groupArray.push(SelectorData.OriginalData2);
        groupArray.push(SelectorData.OriginalData3);
        groupArray.push(SelectorData.OriginalData4);
        groupArray.push(SelectorData.OriginalData5);
    }
};

// Selector Data objects serve both as containers for running selections
// and for grabbing specific kinds of data that's needed.

var SelectorData = {};

var BaseSelectorData = defineObject(BaseObject, {
    _unit: null,
    _dataList: null,

    getSelectorDataName: function() {
        return "";
    },

    setData: function(unit, dataList) {
        this._unit = unit;
        this._dataList = dataList;
        this._setAdditionalData(unit, dataList);
    },

    setRerollCount: function(rerollCount) {
        this._windowManager.setRerollCount(rerollCount);
    },

    isClickingRerollWindow: function() {
        return this._windowManager.isClickingRerollWindow();
    },

    getRerollCount: function() {
        return this._windowManager.getRerollCount();
    },

    getDefaultDataList: function() {
        root.msg("For some reason, the " + this.getSelectorDataName() + " select lacks a default data list to pull from.");
        return null;
    },

    getSessionDataList: function() {
        root.msg("When using the " + this.getSelectorDataName() + " select, you need to specify a data list.");
        return null;
    },

    getObject: function() {
        return this._windowManager.getObject();
    },

    getIndex: function() {
        return this._windowManager.getIndex();
    },

    getObjectId: function() {
        var object = this.getObject();

        if (object == null) {
            return -1;
        }

        return object.getId();
    },

    getObjectType: function() {
        return ObjectType.NULL;
    },
    
    moveSelectorData: function() {
        return this._windowManager.moveWindowManager();
    },

    drawSelectorData: function() {
        this._windowManager.drawWindowManager();
    },

    _getWindowManager: function() {
        return null;
    },

    _setAdditionalData: function(unit, dataList) {
        this._windowManager = createWindowObject(this._getWindowManager(), this)
        this._windowManager.setData(unit, dataList);
    }
});

SelectorData.Unit = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "unit";
    },

    getDefaultDataList: function() {
        return root.getBaseData().getPlayerList();
    },

    getSessionDataList: function() {
        return PlayerList.getSortieDefaultList();
    },

    getObjectType: function() {
        return ObjectType.UNIT;
    },

    _getWindowManager: function() {
        return SelectorEventUnitWindowManager;
    }
});

SelectorData.Class = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "class";
    },

    getDefaultDataList: function() {
        return root.getBaseData().getClassList();
    },

    getObjectType: function() {
        return ObjectType.CLASS;
    },

    _getWindowManager: function() {
        return SelectorEventClassWindowManager;
    }
});

SelectorData.Item = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "item";
    },

    getDefaultDataList: function() {
        root.msg("The data list parameter for the Select event is NOT optional for items and weapons. Try using SelectorEventControl.getItemListFromIdArray([ItemId1, ItemId2, ItemId3, ...]).");
        return null;
    },

    getSessionDataList: function() {
        var sceneType = root.getBaseScene();

        var unit;
        if (sceneType != sceneType.REST) {
            unit = root.getCurrentSession().getActiveEventUnit();
        } else {
            unit = root.getEventCommandObject().getOriginalContent().getUnit();
        }

        if (unit == null) {
            return null;
        }

        return SelectorEventControl.getUnitItemList(unit);
    },

    getObjectId: function() {
        var object = this.getObject();

        if (object == null) {
            return -1;
        }

        if (object.isWeapon() === false) {
            return object.getId() + 0x10000;
        }

        return object.getId();
    },

    _getWindowManager: function() {
        return SelectorEventItemWindowManager;
    }
});

SelectorData.Weapon = defineObject(SelectorData.Item, {
    getSelectorDataName: function() {
        return "weapon";
    }
});

SelectorData.State = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "state";
    },

    getDefaultDataList: function() {
        return root.getBaseData().getStateList();
    },

    getSessionDataList: function() {
        var sceneType = root.getBaseScene();

        var unit;
        if (sceneType != sceneType.REST) {
            unit = root.getCurrentSession().getActiveEventUnit();
        } else {
            unit = root.getEventCommandObject().getOriginalContent().getUnit();
        }

        if (unit == null) {
            return null;
        }

        return SelectorEventControl.getUnitStateList(unit);
    },

    getObjectType: function() {
        return ObjectType.STATE;
    },

    _getWindowManager: function() {
        return SelectorEventStateWindowManager;
    }
});

SelectorData.Skill = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "skill";
    },

    getDefaultDataList: function() {
        return root.getBaseData().getSkillList();
    },

    getSessionDataList: function() {
        var sceneType = root.getBaseScene();

        var unit;
        if (sceneType != sceneType.REST) {
            unit = root.getCurrentSession().getActiveEventUnit();
        } else {
            unit = root.getEventCommandObject().getOriginalContent().getUnit();
        }

        if (unit == null) {
            return null;
        }

        return SelectorEventControl.getUnitSkillList(unit);
    },

    getObjectType: function() {
        return ObjectType.SKILL;
    },

    _getWindowManager: function() {
        return SelectorEventSkillWindowManager;
    }
});

SelectorData.BaseOriginalData = defineObject(BaseSelectorData, {
    getSelectorDataName: function() {
        return "originaldata" + (this._getOriginalDataIndex());
    },

    getDefaultDataList: function() {
        return root.getBaseData().getOriginalDataList(this._getOriginalDataIndex());
    },

    _getOriginalDataIndex: function() {
        return -1;
    },

    _setAdditionalData: function(unit, dataList) {
        this._windowManager = createWindowObject(SelectorEventOriginalDataWindowManager, this);
        this._windowManager.setData(unit, dataList);
    }
})

SelectorData.OriginalData1 = defineObject(SelectorData.BaseOriginalData, {
    _getOriginalDataIndex: function() {
        return 0;
    }
});

SelectorData.OriginalData2 = defineObject(SelectorData.BaseOriginalData, {
    _getOriginalDataIndex: function() {
        return 1;
    }
});

SelectorData.OriginalData3 = defineObject(SelectorData.BaseOriginalData, {
    _getOriginalDataIndex: function() {
        return 2;
    }
});

SelectorData.OriginalData4 = defineObject(SelectorData.BaseOriginalData, {
    _getOriginalDataIndex: function() {
        return 3;
    }
});

SelectorData.OriginalData5 = defineObject(SelectorData.BaseOriginalData, {
    _getOriginalDataIndex: function() {
        return 4;
    }
});

// Short hand version
var SEC = SelectorEventControl;