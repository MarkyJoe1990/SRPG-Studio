var NameEntryConfirm = defineObject(BaseWindow, {
	_currentString: null,
	_unit: null,
	
	setUp: function(unit) {
		this._unit = unit;
		
		this._scrollbar = createObject(ConfirmScrollbar);
		this._scrollbar.setScrollFormation(2, 1);
		this._scrollbar.setObjectArray(["Yes","No"]);
		this._scrollbar.enableSelectCursor(true);
	},
	
	moveWindowContent: function() {
		result = MoveResult.CONTINUE;
		
		input = this._scrollbar.moveInput();
		
		if (input == ScrollbarInput.SELECT) {
			if (this._scrollbar.getIndex() == 1) {
				result = MoveResult.CANCEL;
			} else {
				result = MoveResult.SELECT;
			}
		} else if (input == ScrollbarInput.CANCEL) {
			result = MoveResult.CANCEL;
		}
		
		if (result == MoveResult.SELECT) {
			if (this._unit.getUnitType() == UnitType.PLAYER) {
				playerList = root.getBaseData().getPlayerList();
				//Get the right unit
				for (i = 0; i < playerList.getCount(); i++) {
					currentUnit = playerList.getData(i);
					if (currentUnit.getBaseId() == this._unit.getBaseId()) {
						break;
					}
				}
				currentUnit.setName(this._currentString);
			}
			this._unit.setName(this._currentString);
		}
		
		return result;
	},
	
	drawWindowContent: function(x, y) {
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		TextRenderer.drawText(x, y, "Is " + this._currentString + " okay?", -1, color, font);
		
		scrollbarWidth = this._scrollbar.getObjectWidth() * 2;
		
		this._scrollbar.drawScrollbar(x + 70, y + 50);
	},
	
	getWindowWidth: function() {
		return 300;
	},
	
	setCurrentString: function(string) {
		this._currentString = string;
	}
});