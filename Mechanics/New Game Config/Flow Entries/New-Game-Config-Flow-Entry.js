var NewGameConfigFlowEntry = defineObject(BaseFlowEntry, {
	_windowManager: null,
	_questionWindow: null,
	
	enterFlowEntry: function(newGameCommand) {
		this._windowManager = createObject(NewGameConfigWindowManager);
		this._questionWindow = createObject(QuestionWindow);
		this._questionWindow.setQuestionMessage("Move forward with these settings?");
		
		this.changeCycleMode(0);
		return EnterResult.OK;
	},
	
	moveFlowEntry: function() {
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
	
	drawFlowEntry: function() {
		root.getGraphicsManager().fill(0x0);
		
		var mode = this.getCycleMode();
		
		this._drawWindowManager();
		
		if (mode == 1) {
			this._drawQuestionWindow();
		}
	},
	
	_applySettings: function() {
		//Grab array of config objects
		//enact their "setConfigValue" function
		var scrollBar = this._getScrollbar();
		var i, count = scrollBar.getObjectCount();
		
		for (i = 0; i < count; i++) {
			var currentObject = scrollBar.getObjectFromIndex(i);
			var currentValue = currentObject._configScrollbar.getIndex();
			currentObject.setConfigValue(currentValue);
		}
	},
	
	_getScrollbar: function() {
		return this._windowManager._scrollbar;
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
	}
});