var NameEntry = {
	ENTRY: 0,
	CONFIRM: 1
}

var NameEntryWindowManager = defineObject(BaseWindowManager, {
	_title: null,
	_keys: null,
	_nameEntryWindow: null,
	_nameEntryPreview: null,
	_nameEntryConfirm: null,
	_currentString: null,
	_selfSwitch: null,
	_lengthLimit: null,
	
	setUp: function(title, keys, selfSwitch, lengthLimit, unit, defaultName) {
		this._title = title;
		this._keys = keys;
		this._currentString = defaultName;

		root.log("GRAND DAD IS: " + this._currentString);

		this._selfSwitch = selfSwitch;
		this._lengthLimit = lengthLimit;
		this._unit = unit;
		
		//Set up the windows
		this._nameEntryWindow = createObject(NameEntryWindow);
		this._nameEntryWindow.setUp(this._keys, this._title, this._lengthLimit, defaultName);
		
		this._nameEntryPreview = createObject(NameEntryPreview);
		this._nameEntryPreview.setUp(this._currentString);
		
		this._nameEntryConfirm = createObject(QuestionWindow);

		this.changeCycleMode(NameEntry.ENTRY);
		//this._nameEntryConfirm.setUp(this._unit);
	},
	
	moveWindowManager: function() {
		result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		if (mode == NameEntry.ENTRY) {
			result = this._nameEntryWindow.moveWindow();
			this._currentString = this._nameEntryWindow.getCurrentString();
			this._nameEntryPreview.setCurrentString(this._currentString);
			if (result == MoveResult.END) {
				this.changeCycleMode(NameEntry.CONFIRM);
				//this._nameEntryConfirm.setCurrentString(this._currentString);
				this._nameEntryConfirm.setQuestionMessage("Is " + this._currentString + " okay?");
				this._nameEntryConfirm.setQuestionActive(true);

				result = MoveResult.CONTINUE;
			} else if (result == MoveResult.CANCEL) {
				if (typeof this._selfSwitch != "number") {
					result = MoveResult.CONTINUE;
				} else {
					root.setSelfSwitch(this._selfSwitch,true);
					UnitEventChecker.setCancelFlag(true);
					MediaControl.soundDirect('commandcancel');
				}
			}
		} else if (mode == NameEntry.CONFIRM) {
			if (this._nameEntryConfirm.moveWindow() !== MoveResult.CONTINUE) {
				var ans = this._nameEntryConfirm.getQuestionAnswer();
				if (ans === QuestionAnswer.YES) {
					result = MoveResult.END;
				} else {
					this.changeCycleMode(NameEntry.ENTRY);
					result = MoveResult.CONTINUE;
				}
			}
		}
		
		return result;
	},

	setNameEntry: function(string) {
		this._currentString = string;
	},

	getNameEntry: function() {
		return this._currentString;
	},

	getNameEntryWindow: function() {
		return this._nameEntryWindow;
	},

	drawWindowManager: function() {
		var dy, dx;
		var x = this.getPositionWindowX();
		var y = Math.floor(root.getGameAreaHeight() / 2) - Math.floor(this._nameEntryWindow.getWindowHeight() / 2);
		var mode = this.getCycleMode();
		
		this._nameEntryWindow.drawWindow(x, y);

		dx = LayoutControl.getCenterX(-1, this._nameEntryPreview.getWindowWidth());
		
		this._nameEntryPreview.drawWindow(dx, y + this._nameEntryWindow.getWindowHeight());
		if (mode == NameEntry.CONFIRM) {
			dx = LayoutControl.getCenterX(-1, this._nameEntryConfirm.getWindowWidth());
			dy = LayoutControl.getCenterY(-1, this._nameEntryConfirm.getWindowHeight());
			this._nameEntryConfirm.drawWindow(dx, dy);
		}
	},

	getPositionWindowX: function() {
		return LayoutControl.getCenterX(-1, this._nameEntryWindow.getWindowWidth());
	},

	getPositionWindowY: function() {
		return 0;
	}
	
});