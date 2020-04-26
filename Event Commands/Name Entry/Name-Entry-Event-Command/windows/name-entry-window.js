var NameEntryWindow = defineObject(BaseWindow, {
	_title: null,
	_keys: null,
	_keyArray: null,
	_isUpperCase: false,
	_scrollbar: null,
	_currentString: null,
	
	setUp: function(keys, title, lengthLimit) {
		this._keys = keys;
		this._title = title;
		this._lengthLimit = lengthLimit;
		this._currentString = '';
		this._isUpperCase = true;
		
		this.createKeyArray();
		
		this._scrollbar = createScrollbarObject(KeysScrollbar, this);
		this._scrollbar.setScrollFormation(10, 4);
		this._scrollbar.setObjectArray(this._keyArray);
		this._scrollbar.getSpecialKeys();
		this._scrollbar.enableSelectCursor(true);
	},
	
	moveWindowContent: function() {
		result = MoveResult.CONTINUE;
		
		var input = this._scrollbar.moveInput();
		
		//If move result is select, append the selected character to the global string
		
		if (input == ScrollbarInput.SELECT) {
			if (this._scrollbar.getObject() == "DONE") {
				result = MoveResult.END;
			} else if (this._scrollbar.getObject() == "BACK") {
				this._currentString = this._currentString.substring(0, this._currentString.length - 1)
			} else if (this._scrollbar.getObject() == "LWR") {
				this.toggleUpperCase();
			} else {
				if (this._currentString.length < this._lengthLimit) {
					this._currentString += this._scrollbar.getObject();
				}
			}
		}
		if (input == ScrollbarInput.CANCEL) {
			result = MoveResult.CANCEL;
		}
		
		return result;
	},
	
	drawWindowContent: function(x, y) {
		this._scrollbar.drawScrollbar(x, y);
	},
	
	toggleUpperCase: function() {
		if (this._isUpperCase == true) {
			this._keys = this._keys.toLowerCase();
			this._isUpperCase = false;
		} else {
			this._keys = this._keys.toUpperCase();
			this._isUpperCase = true;
		}
		
		this.createKeyArray();
		this._scrollbar.setObjectArray(this._keyArray);
	},
	
	createKeyArray: function() {
		this._keyArray = [];
		
		for (i = 0; i < this._keys.length; i++) {
			this._keyArray.push(this._keys.charAt(i));
		}
		
		this._keyArray.push("LWR");
		this._keyArray.push("BACK");
		this._keyArray.push("DONE");
	},
	
	getCurrentString: function() {
		return this._currentString;
	},
	
	getWindowTitleText: function() {
		return this._title;
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI('default_window');
	},
	
	getWindowTitleTextUI: function() {
		return root.queryTextUI('eventmessage_title');
	},
	
	getWindowWidth: function() {
		var columns = Math.ceil(this._keys.length / 10) * 10;
		var rows = columns / 10;
		
		var objWidth = this._scrollbar.getObjectWidth() * Math.ceil(columns / rows);
		
		var width = objWidth + (this.getWindowXPadding()*2)
		
		return width;
	},
	
	getWindowHeight: function() {
		//You need window y padding times 2
		//you need the total height, which is the number of rows times the height of the objects
		var columns = Math.ceil(this._keys.length / 10);
		
		var objHeight = this._scrollbar.getObjectHeight() * columns;
		
		var height = objHeight + (this.getWindowYPadding()*2);
		
		return height;
	}
	
});