var RallySelectWindow = defineObject(BaseWindow ,{
	_rallyScrollbar: null,
	
	setUp: function(rallyArray) {
		this._rallyScrollbar = createScrollbarObject(RallySelectScrollbar, this);
        this._rallyScrollbar.setScrollFormation(1, 5);
        this._rallyScrollbar.setObjectArray(rallyArray);
        this._rallyScrollbar.enableSelectCursor(true);
	},
	
	moveWindowContent: function() {
        var result = MoveResult.CONTINUE;
        var input = this._rallyScrollbar.moveInput();
        
        if (input == ScrollbarInput.SELECT) {
            result = MoveResult.SELECT;
        }
        else if (input == ScrollbarInput.CANCEL) {
            result = MoveResult.CANCEL;
        }

        return result;
	},
	
	drawWindowContent: function(x, y) {
		this._rallyScrollbar.drawScrollbar(x, y);
	},
	
	getWindowWidth: function() {
		return this._rallyScrollbar.getObjectWidth() + (this.getWindowXPadding() * 2);;
	},
	
	getWindowHeight: function() {
		result = (this._rallyScrollbar.getObjectCount() * this._rallyScrollbar.getObjectHeight()) + (this.getWindowYPadding() * 2);
		
		if (result > 182) {
			result = 182;
		}
		
		return result; 
	}
	
});