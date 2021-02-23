//This is an event command that allows the BounceyBall object to
//show up on screen. Notice that it has an "enter" function.
//Many objects have this. It basically sets the object up,
//and returns an EnterResult enumeration to tell the game
//whether it's okay to start processing the object or not.
//Some objects have conditions that determine if the object's
//processing should be skipped, such as when you skip an event.
//However, it can also be used to create error handling where
//you set the game to not process the object if the user's
//input has caused a potential error.

var BounceyBallEventCommand = defineObject(BaseEventCommand, {
	_ball: null,
	
	enterEventCommandCycle: function() {
		this._ball = createObject(BounceyBall);
		
		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
		result = this._ball.moveBall();
		
		return result;
	},
	
	drawEventCommandCycle: function() {
		this._ball.drawBall();
	},
	
	isEventCommandSkipAllowed: function() {
		return false;
	},
	
	//Type this into the Execute Script event command's "object"
	//field to make the ball show up.
	getEventCommandName: function() {
		return "Ball";
	}
});

//Some objects need to be appended to an existing array to be detected
//by the game. Here, you need to append this Bouncey Ball event command
//To this function or else the game doesn't detect it.
(function () {
	//Adds our event object to the list of custom events
	var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
	ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
			alias1.call(this, groupArray);
			groupArray.appendObject(BounceyBallEventCommand);
	};
}) ();