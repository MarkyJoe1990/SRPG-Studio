var BaseNewGameConfig = defineObject(BaseObject, {
	_configScrollbar: null,
	_index: -1,
	
	initialize: function() {
		this._configScrollbar = createScrollbarObject(NewGameConfigOptionScrollbar, this);

		var configInfo = root.getConfigInfo();

		var colCount = 2 + Math.floor((configInfo.getResolutionIndex() + 1) / 2)

		this._configScrollbar.setScrollFormation(colCount, 1);
		this._configScrollbar.setObjectArray(this.getConfigOptions());
		this.setConfigIndex(0);
	},
	
	moveConfig: function() {
		var result = this.getConfigScrollbar().moveInput();
		
		if (result == ScrollbarInput.SELECT) {
			this.setConfigIndex(this.getConfigScrollbar().getIndex());
		}
		
		if (result == ScrollbarInput.START) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawConfig: function(x, y) {
		var text = this.getConfigTitle();
		var textui = root.queryTextUI("default_window");
		var color = textui.getColor();
		var font = textui.getFont();
		var icon = this.getConfigIcon();
		var dx = x;
		
		if ( !icon.isNullHandle() ) {
			GraphicsRenderer.drawImage(dx, y-2, icon, GraphicsType.ICON);
			dx += 32;
		}
		
		TextRenderer.drawText(dx, y, text, -1, color, font);
		
		this.getConfigScrollbar().drawScrollbar(x + 280, y);
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

	getConfigDescriptions: function() {
		return [];
	},
	
	setConfigValue: function(value) {
		//You must set things here on your own
	},
	
	getConfigValue: function() {
		return this.getConfigScrollbar().getObjectFromIndex(this.getConfigIndex());
	},
	
	getConfigIndex: function() {
		return this._index;
	},
	
	setConfigIndex: function(value) {
		this._index = value;
	},
	
	getConfigScrollbar: function() {
		return this._configScrollbar;
	},
	
	getConfigIcon: function() {
		return null; //You have to set this
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

	getConfigDescriptions: function() {
		return [];
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
		return this.getConfigScrollbar().getObjectFromIndex(this.getConfigIndex());
	},
	
	getConfigIcon: function() {
		return this.getGlobalSwitchTable().getSwitchResourceHandle(this.getGlobalSwitchIndex());
	}
});

var LocalSwitchConfig = defineObject(BaseNewGameConfig, {
	_localSwitchId: 0,
	
	setLocalSwitchId: function(value) {
		this._localSwitchId = value;
	},
	
	getLocalSwitchIndex: function() {
		return this.getLocalSwitchTable().getSwitchIndexFromId(this.getLocalSwitchId());
	},
	
	getLocalSwitchId: function() {
		return this._localSwitchId;
	},
	
	getLocalSwitchTable: function() {
		var session = root.getCurrentSession();
		
		if (session == null) {
			root.msg("You cannot use local switches here.");
			root.endGame();
		}
		
		if (root.getBaseScene() === SceneType.REST) {
			return root.getCurrentSession().getLocalSwitchTable();
		}
		
		return root.getCurrentSession().getCurrentMapInfo().getLocalSwitchTable();
	},
	
	getConfigTitle: function() {
		return this.getLocalSwitchTable().getSwitchName(this.getLocalSwitchIndex());
	},
	
	getConfigOptions: function() {
		return ["Yes", "No"];
	},

	getConfigDescriptions: function() {
		return [];
	},
	
	getConfigDescription: function() {
		return this.getLocalSwitchTable().getSwitchDescription(this.getLocalSwitchIndex());
	},
	
	setConfigValue: function(value) {
		if (value == 0) {
			this.getLocalSwitchTable().setSwitch(this.getLocalSwitchIndex(), true);
		} else {
			this.getLocalSwitchTable().setSwitch(this.getLocalSwitchIndex(), false);
		}
	},
	
	getConfigValue: function() {
		return this.getConfigScrollbar().getObjectFromIndex(this.getConfigIndex());
	},
	
	getConfigIcon: function() {
		return this.getLocalSwitchTable().getSwitchResourceHandle(this.getLocalSwitchIndex());
	}
});

var VariableConfig = defineObject(BaseNewGameConfig, {
	_variableTable: 0,
	_variableId: 0,
	_configOptions: null,
	_configDescriptions: null,
	
	getVariableTable: function() {
		return root.getMetaSession().getVariableTable(this._variableTable)
	},
	
	getVariableIndex: function() {
		return this.getVariableTable().getVariableIndexFromId(this.getVariableId());
	},
	
	getVariableId: function() {
		return this._variableId;
	},

	getVariable: function() {
		return this.getVariableTable().getVariable(this.getVariableIndex());
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

	getConfigDescriptions: function() {
		return this._configDescriptions || [];
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
		return this.getConfigScrollbar().getObjectFromIndex(this.getConfigIndex());
	},
	
	getConfigIcon: function() {
		return this.getVariableTable().getVariableResourceHandle(this.getVariableIndex());
	}
})

var createGlobalSwitchConfig = function(id) {
	var globalSwitchConfig = createObject(GlobalSwitchConfig);
	globalSwitchConfig.setGlobalSwitchId(id);
	
	return globalSwitchConfig;
}

var createLocalSwitchConfig = function(id) {
	var localSwitchConfig = createObject(LocalSwitchConfig);
	localSwitchConfig.setLocalSwitchId(id);
	
	return localSwitchConfig;
}

var createVariableConfig = function(table, id, options, descriptions) {
	var variableConfig = defineObject(VariableConfig, {
		initialize: function() {
			this._variableTable = table;
			this._variableId = id;

			if (typeof options == "function") {
				this._configOptions = options();
			} else {
				this._configOptions = options;
			}

			if (typeof descriptions == "function") {
				this._configDescriptions = descriptions();
			} else {
				this._configDescriptions = descriptions;
			}
			
			BaseNewGameConfig.initialize.call(this);

			this.setConfigIndex(this.getVariable());
		}
	});
	
	return variableConfig;
}