var UnitEventAIControl = {
    _combination: null,

    getUnitEventList: function() {
        var playerList = root.getBaseData().getPlayerList();
        var i, unit, count = playerList.getCount();
        var isGlobalFound = true;
        var list = StructureBuilder.buildDataList();
        var arr = [];
        list.setDataArray(arr);

        for (i = 0; i < count; i ++) {
            unit = playerList.getData(i);
            if (unit.custom.global === true) {
                isGlobalFound = true;
                break;
            }
        }

        if (isGlobalFound !== true) {
            return list;
        }

        count = unit.getUnitEventCount();
        var event = null, info = null;
        for (i = 0; i < count; i++) {
            event = unit.getUnitEvent(i);
            info = event.getUnitEventInfo();
            if (info.getUnitEventType() === UnitEventType.COMMAND) {
                arr.push(event);
            }
        }

        return list;
    },

    setCurrentCombination: function(combination) {
        this._combination = combination;
    },

    getCurrentCombination: function() {
        return this._combination;
    }
};