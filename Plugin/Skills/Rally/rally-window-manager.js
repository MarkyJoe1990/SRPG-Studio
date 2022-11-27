var RallyWindowManager = defineObject(BaseWindowManager, {
	_window: null,
	
	setUp: function(rallyArray) {
		this._window = createObject(RallySelectWindow);
		this._window.setUp(rallyArray);
	},
	
	moveWindowManager: function() {
		return this._window.moveWindow();
	},
	
	drawWindowManager: function() {
		var gameWidth = root.getWindowWidth();
		var gameHeight = root.getWindowHeight();
		
		var windowWidth = this.getTotalWindowWidth();
		var windowHeight = this.getTotalWindowHeight();
		
		var x = Math.floor(gameWidth/2) - Math.floor(windowWidth/2);
		var y = Math.floor(gameHeight/2) - Math.floor(windowHeight/2);
		
		this._window.drawWindow(x, y);
	},
	
	getTotalWindowHeight: function() {
		return this._window.getWindowHeight();
	},
	
	getTotalWindowWidth: function() {
		return this._window.getWindowWidth();
	}
});