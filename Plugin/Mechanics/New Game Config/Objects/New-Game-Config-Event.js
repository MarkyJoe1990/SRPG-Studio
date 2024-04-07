var NewGameConfigEventCommand = defineObject(BaseEventCommand, {
	_windowManager: null,
	_questionWindow: null,
	
	enterEventCommandCycle: function() {
		var args = root.getEventCommandObject().getEventCommandArgument();
		var variableConfig = args.variableConfig;
		var localSwitchConfig = args.localSwitchConfig;
		var globalSwitchConfig = args.globalSwitchConfig;
		var name = args.configName || "Configuration Event";
		
		this._windowManager = createObject(NewGameConfigWindowManager);
		this._windowManager.setUp(variableConfig, localSwitchConfig, globalSwitchConfig, name);
		
		if (this._windowManager.getConfigArray().length == 0) {
			root.msg("You have not properly set up your Config Menu parameters.\n\nPlease look at $readme.txt for more information.");
			return EnterResult.NOTENTER;
		}
		
		this._questionWindow = createObject(QuestionWindow);
		this._questionWindow.setQuestionMessage("Move forward with these settings?");
		
		this.changeCycleMode(0);
		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode == 0) {
			result = this._moveWindowManager();
		} else if (mode == 1) {
			result = this._moveQuestionWindow();
		}
		
		return result;
	},
	
	_moveWindowManager: function() {
		if (this._windowManager.moveWindowManager() == MoveResult.END) {
			this._questionWindow.setQuestionActive(true);
			this.changeCycleMode(1);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveQuestionWindow: function() {
		var result = this._questionWindow.moveWindow();
		
		if (result != MoveResult.CONTINUE) {
			var ans = this._questionWindow.getQuestionAnswer();
			if (ans == QuestionAnswer.YES) {
				this._applySettings();
				return MoveResult.END;
			} else if (ans == QuestionAnswer.NO) {
				this._questionWindow.setQuestionActive(false);
				this.changeCycleMode(0);
			}
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawEventCommandCycle: function() {
		//root.getGraphicsManager().fill(0x0);
		
		var mode = this.getCycleMode();
		
		this._drawWindowManager();
		
		if (mode == 1) {
			this._drawQuestionWindow();
		}
	},
	
	_drawWindowManager: function() {
		this._windowManager.drawWindowManager();
	},
	
	_drawQuestionWindow: function() {
		var width = this._questionWindow.getWindowWidth();
		var height = this._questionWindow.getWindowHeight();
		
		var x = LayoutControl.getCenterX(-1, width)
		var y = LayoutControl.getCenterY(-1, height)
		
		this._questionWindow.drawWindow(x, y);
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI('single_window');
	},
	
	backEventCommandCycle: function() {
		return MoveResult.CONTNUE;
	},
	
	mainEventCommand: function() {
	},
	
	isEventCommandContinue: function() {
		// Currently, if the event is a skip state, end by executing only main processing.
		// Even if graphics are not needed to be displayed, end by executing only a main processing.
		if (this.isSystemSkipMode()) {
			this.mainEventCommand();
			// Notify that event command processing should not be continued with the return false because main processing has ended.
			return false;
		}
		
		return true;
	},
	
	stopEventSkip: function() {
		root.setEventSkipMode(false);
	},
	
	isEventCommandSkipAllowed: function() {
		return false;
	},
	
	isSystemSkipMode: function() {
		// Skip has 2 kinds, event skip and turn skip.
		// Event skip occurs when skip key is pressed in the event and is to skip the event only.
		// It means that turn itself is not skipped.
		
		// Meanwhile, turn event is to skip the enemy's and player's turn themselves.
		// So each player's unit motion as well as the event occurs within the turn are skipped.
		// It means that turn skip includes the event skip, so specifies the isEventSkipMode.  
		return root.isEventSkipMode() || CurrentMap.isTurnSkipMode();
	},
	
	_applySettings: function() {
		//Grab array of config objects
		//enact their "setConfigValue" function
		var scrollBar = this._getScrollbar();
		var i, count = scrollBar.getObjectCount();
		
		for (i = 0; i < count; i++) {
			var currentConfig = scrollBar.getObjectFromIndex(i);
			var currentValue = currentConfig.getConfigValue();
			var currentIndex = currentConfig.getConfigIndex();
			var currentValueType = typeof currentValue;
			
			if (currentValueType == "number") {
				currentConfig.setConfigValue(currentValue);
			} else if (currentValueType == "string") {
				currentConfig.setConfigValue(currentIndex);
			} else if (currentValueType == "function") {
				currentConfig.setConfigValue(currentValue());
			} else {
				currentConfig.setConfigValue(currentValue.value);
			}
		}
	},
	
	_getScrollbar: function() {
		return this._windowManager._scrollbar;
	},
	
	getEventCommandName: function() {
		// If implement original event command, return the name.
		return 'Config';
	}
});

(function () {
	var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
	ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(NewGameConfigEventCommand);
	}
}) ();