var NewGameConfigWindowManager = defineObject(BaseWindowManager, {
	_scrollbar: null,
	_variableConfig: null,
	_localSwitchConfig: null,
	_globalSwitchConfig: null,
	_name: null,
	
	setUp: function(variableConfig, globalSwitchConfig, localSwitchConfig, name) {
		this._variableConfig = variableConfig;
		this._localSwitchConfig = localSwitchConfig;
		this._globalSwitchConfig = globalSwitchConfig;
		this._name = name;
		
		this._configArray = [];
		this._configureArray(this._configArray);
		
		this._scrollbar = createScrollbarObject(NewGameConfigScrollbar, this);
		this._scrollbar.setScrollFormation(1, 6);
		this._scrollbar.setObjectArray(this._configArray);
		
		this._scrollbar.setActiveSingle(true);
	},
	
	moveWindowManager: function() {
		var result = this._moveScrollbars();
		
		if (result == MoveResult.END) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawWindowManager: function() {
		var totalWidth = this.getTotalWindowWidth();
		var totalHeight = this.getTotalWindowHeight();

		var x = LayoutControl.getCenterX(-1, totalWidth);
		var y = LayoutControl.getCenterY(-1, totalHeight);
		
		// draw press start
		var startX = (x + totalWidth) - (TitleRenderer.getTitlePartsWidth() * 5);
		var startY = y - TitleRenderer.getTitlePartsHeight();
		this._drawStartTitle(startX, startY);

		this._scrollbar.drawScrollbar(x, y);
		
		var screen = root.queryScreen("Config");
		var textui = screen.getBottomFrameTextUI();
		var textuiTop = screen.getTopFrameTextUI();
		
		// var object = this.getObject();
		var description = this.getDescription();//object.getConfigDescription();
		
		TextRenderer.drawScreenTopTextCenter(this.getConfigMenuTitle(), textuiTop);
		TextRenderer.drawScreenBottomText(description, textui);
	},

	_drawStartTitle: function(x, y) {
		var range = this._getStartTitleRange(x, y);
		var textui = root.queryTextUI('start_title');
		var color = textui.getColor();
		var font = textui.getFont();
		var pic = textui.getUIImage();

		if (pic !== null) {
			TextRenderer.drawFixedTitleText(range.x, range.y, StringTable.UnitSortie_Start, color, font, TextFormat.CENTER, pic, 3);
		}
	},

	_getStartTitleRange: function(x, y) {
		return createRangeObject(x, y, TitleRenderer.getTitlePartsWidth() * 5, TitleRenderer.getTitlePartsHeight());
	},
	
	getObject: function() {
		return this._scrollbar.getObject()
	},

	getDescription: function() {
		var object = this.getObject();
		var index = object.getConfigIndex();
		index = object._configScrollbar.getIndex();
		var descriptions = object.getConfigDescriptions();
		var description = descriptions[index];

		if (description == undefined) {
			description = object.getConfigDescription();
		}

		return description;
	},
	
	getConfigArray: function() {
		return this._configArray;
	},
	
	getConfigMenuTitle: function() {
		return this._name;
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

		if (this._isStartTitlePressed()) {
			result = MoveResult.END;
		}
		
		return result;
	},

	_isStartTitlePressed: function() {
		var totalWidth = this.getTotalWindowWidth();
		var totalHeight = this.getTotalWindowHeight();

		var x = LayoutControl.getCenterX(-1, totalWidth);
		var y = LayoutControl.getCenterY(-1, totalHeight);
		
		// draw press start
		var startX = (x + totalWidth) - (TitleRenderer.getTitlePartsWidth() * 5);
		var startY = y - TitleRenderer.getTitlePartsHeight();
		
		if (MouseControl.isRangePressed(this._getStartTitleRange(startX, startY))) {
			MediaControl.soundDirect('commandselect');
			return true;
		}
		
		return false;
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
		
		if (this._localSwitchConfig != null) {
			this._addLocalSwitches(groupArray);
		}
	},
	
	_addVariables: function(groupArray) {
		var variableConfig = this._variableConfig;
		
		if (variableConfig == undefined) {
			return;
		}
		
		var i, count = variableConfig.length;
		for (i = 0; i < count; i++) {
			var currentVariable = variableConfig[i];
			var table = currentVariable.table;
			var id = currentVariable.id;
			var options = currentVariable.options;
			var descriptions = currentVariable.descriptions;
			
			var variableConfigObject = createVariableConfig(table, id, options, descriptions);
			
			groupArray.appendObject(variableConfigObject);
		}
	},
	
	_addGlobalSwitches: function(groupArray) {
		var globalSwitchConfig = this._globalSwitchConfig;
		
		if (globalSwitchConfig == undefined) {
			return;
		}
		
		var i, count = globalSwitchConfig.length;
		for (i = 0; i < count; i++) {
			var currentGlobalSwitch = globalSwitchConfig[i];
			groupArray.appendObject(createGlobalSwitchConfig(currentGlobalSwitch));
		}
	},
	
	_addLocalSwitches: function(groupArray) {
		var localSwitchConfig = this._localSwitchConfig;
		
		if (localSwitchConfig == undefined) {
			return;
		}
		
		var i, count = localSwitchConfig.length;
		for (i = 0; i < count; i++) {
			var currentLocalSwitch = localSwitchConfig[i];
			groupArray.appendObject(createLocalSwitchConfig(currentLocalSwitch));
		}
	}
});