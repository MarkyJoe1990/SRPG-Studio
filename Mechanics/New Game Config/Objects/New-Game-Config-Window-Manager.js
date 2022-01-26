var NewGameConfigWindowManager = defineObject(BaseWindowManager, {
	_scrollbar: null,
	
	initialize: function() {
		this._configArray = [];
		this._configureArray(this._configArray);
		
		this._scrollbar = createScrollbarObject(NewGameConfigScrollbar, this);
		this._scrollbar.setScrollFormation(1, 6);
		this._scrollbar.setObjectArray(this._configArray);
		
		this._scrollbar.setActiveSingle(true);
	},
	
	moveWindowManager: function() {
		var result = this._moveScrollbars();
		
		if (result == ScrollbarInput.CANCEL) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawWindowManager: function() {
		var x = LayoutControl.getCenterX(-1, this.getTotalWindowWidth());
		var y = LayoutControl.getCenterY(-1, this.getTotalWindowHeight());
		
		this._scrollbar.drawScrollbar(x, y);
		
		var screen = root.queryScreen("Config");
		var textui = screen.getBottomFrameTextUI();
		var textuiTop = screen.getTopFrameTextUI();
		
		var object = this.getObject();
		var description = object.getConfigDescription();
		
		TextRenderer.drawScreenTopText("New Game Configuration", textuiTop);
		TextRenderer.drawScreenBottomText(description, textui);
	},
	
	getObject: function() {
		return this._scrollbar.getObject()
	},
	
	getTotalWindowWidth: function() {
		return this._scrollbar.getObjectWidth();
	},
	
	getTotalWindowHeight: function() {
		var count = this._scrollbar.getObjectCount();
		var height = this._scrollbar.getObjectHeight();
		
		if (count > 6) {
			count = 6
		}
		
		return count * height;
	},
	
	getPositionWindowX: function() {
		return 0;
	},
	
	getPositionWindowY: function() {
		return 0;
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI("single_window")
	},
	
	_moveScrollbars: function() {
		var result = MoveResult.CONTINUE;
		
		if (InputControl.isInputState(InputType.UP) || MouseControl.isInputAction(MouseType.UPWHEEL)) {
			this._moveUpDown();
		} else if (InputControl.isInputState(InputType.DOWN) || MouseControl.isInputAction(MouseType.DOWNWHEEL)) {
			this._moveUpDown();
		} else {
			this._checkTracingScrollbar();
			
			result = this._scrollbar.getObject().moveConfig();
		}
		
		return result;
	},
	
	_moveUpDown: function() {
		var object = this._scrollbar.getObject();
		
		object._configScrollbar.setActiveSingle(false);
		this._scrollbar.moveScrollbarCursor();
		
		object = this._scrollbar.getObject();
		object._configScrollbar.setActiveSingle(true);
	},
	
	_checkTracingScrollbar: function() {
		var object;
		var objectPrev = this._scrollbar.getObject();
		
		if (MouseControl.moveScrollbarMouse(this._scrollbar)) {
			objectPrev._configScrollbar.setActiveSingle(false);
			object = this._scrollbar.getObject();
			object._configScrollbar.setActiveSingle(true);
			
			MouseControl.moveScrollbarMouse(object._configScrollbar);
		}
	},
	
	_configureArray: function(groupArray) {
		this._addVariables(groupArray);
		this._addGlobalSwitches(groupArray);
	},
	
	_addVariables: function(groupArray) {
		var metaSession = root.getMetaSession();
		
		var variableConfigArray = metaSession.global.variableConfig;
		var i, count = variableConfigArray.length;
		for (i = 0; i < count; i++) {
			var currentVariable = variableConfigArray[i];
			var table = currentVariable.table;
			var id = currentVariable.id;
			var options = currentVariable.options;
			
			var variableConfig = createVariableConfig(table, id, options);
			
			groupArray.appendObject(variableConfig);
		}
	},
	
	_addGlobalSwitches: function(groupArray) {
		var metaSession = root.getMetaSession();
		
		var globalSwitchConfigArray = metaSession.global.globalSwitchConfig;
		
		var i, count = globalSwitchConfigArray.length;
		for (i = 0; i < count; i++) {
			var currentGlobalSwitch = globalSwitchConfigArray[i];
			groupArray.appendObject(createGlobalSwitchConfig(currentGlobalSwitch));
		}
	}
});