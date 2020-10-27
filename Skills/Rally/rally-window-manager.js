var RallyWindowManager = defineObject(BaseWindowManager, {
	_window: null,
	
	setUp: function(rallyArray) {
		this._window = createObject(RallySelectWindow);
		this._window.setUp(rallyArray);
	},
	
	moveWindowManager: function() {
		return this._window.moveWindow();
	},
	
	drawWindowManager: function(x, y) {
		this._window.drawWindow(x, y);
	}
});