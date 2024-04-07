var VariableFinder = {
    _varCache: null,

    init: function() {
        this._varCache = {};
    },

    getVariableValue: function(variableString) {
        // Find the string, then cache it
        var varData = this._findVariable(variableString);
        if (varData == null) {
            return -1;
        }

        return root.getMetaSession().getVariableTable(varData.table).getVariable(varData.index);
    },

    setVariableValue: function(variableString, value) {
        var varData = this._findVariable(variableString);
        if (varData == null) {
            return;
        }

        root.getMetaSession().getVariableTable(varData.table).setVariable(varData.index, value);
    },

    _findVariable: function(variableString) {
        if (this._varCache[variableString] != undefined) {
            return this._varCache[variableString];
        }

        var varTable, meta = root.getMetaSession(), i, count = 6; // Number of variable tables
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
    }
};

var GlobalSwitchFinder = {
    _switchCache: null,

    init: function() {
        this._switchCache = {};
    },

    isGlobalSwitchOn: function(switchString) {
        var switchIndex = this._findSwitch(switchString);
        if (switchIndex == -1) {
            return false;
        }

        return root.getMetaSession().getGlobalSwitchTable().isSwitchOn(switchIndex);
    },

    setGlobalSwitch: function(switchString, value) {
        var switchIndex = this._findSwitch(switchString);
        if (switchIndex == -1) {
            return -1;
        }

        root.getMetaSession().getGlobalSwitchTable().setSwitch(switchIndex, value);
    },

    _findSwitch: function(switchString) {
        if (this._switchCache[switchString] != undefined) {
            return this._switchCache[switchString];
        }

        var meta = root.getMetaSession();
        var switchTable = meta.getGlobalSwitchTable();
        var i, count = switchTable.getSwitchCount();
        for (i = 0; i < count; i++) {
            if (switchTable.getSwitchName(i) == switchString) {
                this._switchCache[switchString] = i;
                return i;
            }
        }

        root.msg("Could not parse " + switchString + " into a switch.");
        return -1;
    }
};

// Does not use a cache currently, because local switches
// change from map to map, and change depending on if you
// are in the base or not.
// Accounting for these is tricky.
var LocalSwitchFinder = {
    isLocalSwitchOn: function(switchString) {
        var switchIndex = this._findSwitch(switchString);
        if (switchIndex == -1) {
            return false;
        }

        return this._getLocalSwitchTable().isSwitchOn(switchIndex);
    },

    setLocalSwitch: function(switchString, value) {
        var switchIndex = this._findSwitch(switchString);
        if (switchIndex == -1) {
            return -1;
        }

        this._getLocalSwitchTable().setSwitch(switchIndex, value);
    },

    _findSwitch: function(switchString) {
        var switchTable = this._getLocalSwitchTable();
        var i, count = switchTable.getSwitchCount();
        for (i = 0; i < count; i++) {
            if (switchTable.getSwitchName(i) == switchString) {
                return i;
            }
        }

        root.msg("Could not parse " + switchString + " into a switch.");
        return -1;
    },

    _getLocalSwitchTable: function() {
        var table;
		
		if (root.getBaseScene() === SceneType.REST) {
			table = root.getCurrentSession().getLocalSwitchTable();
		} else {
			table = root.getCurrentSession().getCurrentMapInfo().getLocalSwitchTable();
		}
		
		return table;
    }
};

( function() {
    var alias1 = SetupControl.setup;
    SetupControl.setup = function() {
        alias1.call(this);
        VariableFinder.init();
        GlobalSwitchFinder.init();
    }
}) ();
