var CheatCodeWindowManager = defineObject(BaseWindowManager, {
    
    setUp: function() {
        this._cheatCodeWindow = createObject(CheatCodeWindow);
    },

    getObject: function() {
        return this._cheatCodeWindow.getObject();
    },

	moveWindowManager: function() {
		return this._cheatCodeWindow.moveWindow();
	},
	
	drawWindowManager: function() {
        var x = LayoutControl.getCenterX(-1, this._cheatCodeWindow.getWindowWidth());
        var y = LayoutControl.getCenterY(-1, this._cheatCodeWindow.getWindowHeight());

        this._cheatCodeWindow.drawWindow(x, y);
	}
});