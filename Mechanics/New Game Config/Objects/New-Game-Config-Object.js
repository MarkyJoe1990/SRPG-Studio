var BaseNewGameConfig = defineObject(BaseObject, {
	_configScrollbar: null,
	
	initialize: function() {
		this._configScrollbar = createScrollbarObject(NewGameConfigOptionScrollbar, this);
		this._configScrollbar.setScrollFormation(2, 1);
		this._configScrollbar.setObjectArray(this.getConfigOptions());
		this.setConfigValue(0);
	},
	
	moveConfig: function() {
		var result = this._configScrollbar.moveInput();
		
		if (result == ScrollbarInput.SELECT) {
			this.setConfigValue(this._configScrollbar.getIndex());
		}
		
		if (result == ScrollbarInput.CANCEL) {
			return MoveResult.CANCEL;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawConfig: function(x, y) {
		var text = this.getConfigTitle();
		var textui = root.queryTextUI("default_window");
		var color = textui.getColor();
		var font = textui.getFont();
		
		TextRenderer.drawText(x, y, text, -1, color, font);
		
		this._configScrollbar.drawScrollbar(x + 240, y);
	},
	
	getConfigTitle: function() {
		return "No Name";
	},
	
	getConfigDescription: function() {
		return "No Description";
	},
	
	getConfigOptions: function() {
		return [];
	},
	
	setConfigValue: function(value) {
		//You must set things here on your own
	},
	
	getConfigValue: function() {
		return 0; //You must also set this;
	}
})

var GlobalSwitchConfig = defineObject(BaseNewGameConfig, {
	_globalSwitchId: 0,
	
	setGlobalSwitchId: function(value) {
		this._globalSwitchId = value;
	},
	
	getGlobalSwitchIndex: function() {
		return this.getGlobalSwitchTable().getSwitchIndexFromId(this.getGlobalSwitchId());
	},
	
	getGlobalSwitchId: function() {
		return this._globalSwitchId;
	},
	
	getGlobalSwitchTable: function() {
		return root.getMetaSession().getGlobalSwitchTable();
	},
	
	getConfigTitle: function() {
		return this.getGlobalSwitchTable().getSwitchName(this.getGlobalSwitchIndex());
	},
	
	getConfigOptions: function() {
		return ["Yes", "No"];
	},
	
	getConfigDescription: function() {
		return this.getGlobalSwitchTable().getSwitchDescription(this.getGlobalSwitchIndex());
	},
	
	setConfigValue: function(value) {
		if (value == 0) {
			this.getGlobalSwitchTable().setSwitch(this.getGlobalSwitchIndex(), true);
		} else {
			this.getGlobalSwitchTable().setSwitch(this.getGlobalSwitchIndex(), false);
		}
	},
	
	getConfigValue: function() {
		var value = this.getGlobalSwitchTable().isSwitchOn(this.getGlobalSwitchIndex());
		if (value == true) {
			return 0;
		} else {
			return 1;
		}
	}
});

var VariableConfig = defineObject(BaseNewGameConfig, {
	_variableTable: 0,
	_variableId: 0,
	_configOptions: null,
	
	getVariableTable: function() {
		return root.getMetaSession().getVariableTable(this._variableTable)
	},
	
	getVariableIndex: function() {
		return this.getVariableTable().getVariableIndexFromId(this.getVariableId());
	},
	
	getVariableId: function() {
		return this._variableId;
	},
	
	setVariableTable: function(value) {
		this._variableTable = value;
	},
	
	setVariableId: function(value) {
		this._variableId = value;
	},
	
	getConfigTitle: function() {
		return this.getVariableTable().getVariableName(this.getVariableIndex());
	},
	
	getConfigOptions: function() {
		return this._configOptions;
	},
	
	setConfigOptions: function(value) {
		this._configOptions = value;
		this._configScrollbar.setObjectArray(value);
	},
	
	getConfigDescription: function() {
		return this.getVariableTable().getVariableDescription(this.getVariableIndex());
	},
	
	setConfigValue: function(value) {
		this.getVariableTable().setVariable(this.getVariableIndex(), value);
	},
	
	getConfigValue: function() {
		return this.getVariableTable().getVariable(this.getVariableIndex());
	}
})

var createGlobalSwitchConfig = function(id) {
	var globalSwitchConfig = createObject(GlobalSwitchConfig);
	globalSwitchConfig.setGlobalSwitchId(id);
	
	return globalSwitchConfig;
}

var createVariableConfig = function(table, id, options) {
	var variableConfig = defineObject(VariableConfig, {
		initialize: function() {
			this._variableTable = table;
			this._variableId = id;
			this._configOptions = options;
			
			BaseNewGameConfig.initialize.call(this);
		}
	});
	
	return variableConfig;
}