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
	_nameEntryMode: null,
	_currentString: null,
	_selfSwitch: null,
	_lengthLimit: null,
	
	setUp: function(title, keys, selfSwitch, lengthLimit, unit, defaultName) {
		this._title = title;
		this._keys = keys;
		this._selfSwitch = selfSwitch;
		this._lengthLimit = lengthLimit;
		this._unit = unit;
		this._currentString = defaultName;
		
		this._nameEntryMode = 0;
		//Set up the windows
		this._nameEntryWindow = createObject(NameEntryWindow);
		this._nameEntryWindow.setUp(this._keys, this._title, this._lengthLimit, this._currentString);
		
		this._nameEntryPreview = createObject(NameEntryPreview);
		this._nameEntryPreview.setUp(this._currentString);
		
		this._nameEntryConfirm = createObject(NameEntryConfirm);
		this._nameEntryConfirm.setUp(this._unit);
		
		
	},
	
	moveWindowManager: function() {
		result = MoveResult.CONTINUE;
		
		if (this._nameEntryMode == NameEntry.ENTRY) {
			result = this._nameEntryWindow.moveWindow();
			this._currentString = this._nameEntryWindow.getCurrentString();
			this._nameEntryPreview.setCurrentString(this._currentString);
			if (result == MoveResult.END) {
				this._nameEntryMode = NameEntry.CONFIRM;
				this._nameEntryConfirm.setCurrentString(this._currentString);
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
		} else if (this._nameEntryMode == NameEntry.CONFIRM) {
			result = this._nameEntryConfirm.moveWindow();
			if (result == MoveResult.CANCEL) {
				this._nameEntryMode = NameEntry.ENTRY;
				result = MoveResult.CONTINUE;
			}
		}
		
		return result;
	},
	drawWindowManager: function() {
		var dy, dx;
		var x = 320;
		var y = 240 - Math.floor(this._nameEntryWindow.getWindowHeight() / 2);
		
		var dx = Math.floor(this._nameEntryWindow.getWindowWidth() / 2);
		
		this._nameEntryWindow.drawWindow(x - dx, y);
		
		dx = Math.floor(this._nameEntryPreview.getWindowWidth() / 2);;
		
		this._nameEntryPreview.drawWindow(x - dx, y + this._nameEntryWindow.getWindowHeight());
		
		if (this._nameEntryMode == NameEntry.CONFIRM) {
			dx = Math.floor(this._nameEntryConfirm.getWindowWidth() / 2);
			dy = Math.floor(this._nameEntryConfirm.getWindowHeight() / 2)
			this._nameEntryConfirm.drawWindow(x - dx, y - dy);
		}
	}
	
});