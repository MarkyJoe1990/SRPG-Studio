//The two modes of the bouncy ball
var BallState = {
	BALL: 0,
	SQUARE: 1
}

//Bouncey Ball object. It has the following properties
//_canvas: an object used to draw stuff. In this case, a ball or rectangle
//_x: represents the horizantal position of the ball
//_y: represents the vertical position of the ball
//_degree: the ball's angle
//_zoomMod: makes the ball bigger or smaller

//Upon being created with the createObject function, the
//ball executes its initialize function.
//This creates a canvas for the ball to draw itself with,
//sets its zoomMod factor, as well as its spawn location
//Then the ball's cycle mode gets set to BallState.BALL.

//In many cases, objects don't use their initialization
//function, and instead will have some sort of "setUp"
//function you're supposed to use instead after creating
//the object. Usually, you would have to put in some parameters.
//While my ball object sets itself via initialize, it
//doesn't need to be this way.

//This object allows for two separate shapes. It will
//become a rectangle if its BallState is BallState.SQUARE.

//The move function of this object, moveBall, does all the
//main calculations and processing. Did the ball hit a wall?
//Has the player pressed any buttons? What will it do when
//these conditions are met?

//move functions are processed once per frame in the game,
//just like draw functions.

//All move functions must return a value from the MoveResult
//enumeration, which you can find in Script -> Constants -> constants-enumeratedtype.js
//They are the following values

//MoveResult.CONTINUE - tells the game to keep processing this object
//MoveResult.END - tells the game to end processing for this object
//MoveResult.SELECT - tells the game the object has "selected" something.
//MoveResult.CANCEL - tells the game the object has "canceled"

//In most cases, END and CANCEL will make the object stop being draw or processed.

//As for draw functions, they don't need to return any value. They simply
//draw graphics on the screen. This bouncey ball is able to shift between
//being a ball and a rectangle, and thus will check what BallState it is in.

//Most objects in SRPG Studio have move and draw functions. For example,
//window objects have moveWindow and drawWindow. Event Commands have
//moveEventCommandCycle and drawEventCommandCycle. However, it's worth
//Noting that unlike this object, others will have some kind of "Enter"
//function as well. This will usually return a value such as EnterResult.OK,
//which tells the program it's okay to start processing and doing the move
//and draw functions. Though, sometimes there exists conditions where
//the result will be EnterResult.NOTENTER, which tells the program to
//not bother.

//While this object is only used when you use the "Ball" custom event
//command in the Execute Script event command, some objects like additional
//unit commands can be "appended" to existing lists via some kind of
//"configure" function. For example, the event command that "summons"
//this ball only works because I edited the "ScriptExecuteEventCommand._configureOriginalEventCommand"
//function to include it as an option. Keep this in mind when adding your
//own custom content to your game.

var BounceyBall = defineObject(BaseObject,{
	//Personal properties
	_canvas: null,
	_x: 0,
	_y: 0,
	_velX: 0,
	_velY: 0,
	_degree: 0,
	_zoomMod: 0,
	
	//Sets up some properties and objects this ball uses.
	initialize: function() {
		this._canvas = root.getGraphicsManager().getCanvas();
		this._canvas.setFillColor(0xFF0000, 255);
		this._zoomMod = 1;
		
		var spawnWidth = root.getWindowWidth() - this.getWidth();
		var spawnHeight = root.getWindowHeight() - this.getHeight();
		
		this._x = Math.floor(Math.random() * spawnWidth);
		this._y = Math.floor(Math.random() * spawnHeight);
		this._velX = 2;
		this._velY = 2;
		
		//Important for when the move and draw functions check
		//the ball's mode for later
		this.changeCycleMode(BallState.BALL);
	},
	
	//Handles most of the ball's processing and calculations
	moveBall: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		//Change from ball to square and vice versa if you press cancel
		//Make a cancel sound as well.
		//Also changes its color
		if (InputControl.isCancelAction()) {
			MediaControl.soundDirect('commandcancel');
			if (mode == BallState.BALL) {
				this._canvas.setFillColor(0x0000FF, 255);
				this.changeCycleMode(BallState.SQUARE);
			} else {
				this._canvas.setFillColor(0xFF0000, 255);
				this.changeCycleMode(BallState.BALL);
			}
		}
		
		//End object when pressing option key (C)
		if (InputControl.isOptionAction()) {
			result = MoveResult.END;
		}
		
		//If the ball hits the left or right borders of the
		//window, play a damage sound effect, and reverse
		//horizantal velocity
		if (this.isHorizantalBounce()) {
			MediaControl.soundDirect('damage');
			this._velX *= -1;
		}
		
		//Change vertical velocity if the top or bottom
		//borders of the window are touched.
		if (this.isVerticalBounce()) {
			MediaControl.soundDirect('damage');
			this._velY *= -1;
		}
		
		//Rotate the ball counter clockwise when holding left
		if (InputControl.getInputType() == InputType.LEFT) {
			this._degree -= 10;
		}
		
		//Rotate the ball clockwise when holding right
		if (InputControl.getInputType() == InputType.RIGHT) {
			this._degree += 10;
		}
		
		//Speed up the ball when holding up
		if (InputControl.getInputType() == InputType.UP) {
			this._velX += this._velX > 0 ? 0.1 : - 0.1;
			this._velY += this._velY > 0 ? 0.1 : - 0.1;;
		}
		
		//Slow the ball down when holding down
		if (InputControl.getInputType() == InputType.DOWN) {
			this._velX -= this._velX > 0 ? 0.1 : - 0.1;
			this._velY -= this._velY > 0 ? 0.1 : - 0.1;;
		}
		
		//If the ball is zoomed in, quickly reverse the effect
		//over the next few frames
		if (this._zoomMod > 1) {
			this._zoomMod -= 0.5
		}
		
		//When pressing select, the ball will zoom in
		if (InputControl.isSelectAction()) {
			this._zoomMod = 3;
			MediaControl.soundDirect('commandselect');
		}
		
		//Ensure the ball's angle never exceeds 360 or -360,
		//since numbers beyond those aren't allowed
		this._degree %= 360;
		
		//Move the ball's x and y positions based on its
		//velocity
		this._x += this._velX;
		this._y += this._velY;
		
		//move functions always result a MoveResult enumeration
		//that tells the game if it should continue processing,
		//end, or do something else.
		return result;
	},
	
	//Draws the ball. Draws a rectangle instead if mode == BallState.SQUARE
	drawBall: function() {
		var mode = this.getCycleMode();
		var width = this.getWidth();
		var height = this.getHeight();
		var x = this.getX();
		var y = this.getY();
		
		this._canvas.setDegree(this._degree);
		this._canvas.setScale(Math.floor(100 * this._zoomMod));
		if (mode == BallState.BALL) {
			this._canvas.drawEllipse(x, y, width, height);
		} else {
			this._canvas.drawRectangle(x, y, width, height);
		}
		
		//Draws data and instructions on the screen
		this._drawInfo();
	},
	
	//Draws data and instructions on the screen
	_drawInfo: function() {
		var mode = this.getCycleMode();
		var textui = root.queryTextUI("default_window");
		var font = textui.getFont();
		var color = textui.getColor();
		var x = 2;
		var y = 0;
		
		//This uses the TextRenderer object for convenience
		TextRenderer.drawText(x, y, "Z = Blink, X = Change Shape, C = Cancel, Up = Speed Up, Down = Slow Down", -1, color, font);
		
		//make the next text draw lower on the screen
		y += 16;
		TextRenderer.drawText(x, y, "Left & Right = Rotate", -1, color, font);
		y += 16;
		TextRenderer.drawText(x, y, "Coordinates: (" + this.getX() + ", " + this.getY() + ")", -1, color, font);
		y += 16;
		if (mode == BallState.BALL) {
			TextRenderer.drawText(x, y, "Mode: BallState.BALL", -1, color, font);
		} else {
			TextRenderer.drawText(x, y, "Mode: BallState.SQUARE", -1, color, font);
		}
		y += 16;
		TextRenderer.drawText(x, y, "Velocity: (" + this.getVelocityX() + ", " + this.getVelocityY() + ")", -1, color, font);
		y += 16;
		TextRenderer.drawText(x, y, "Degree: " + this._degree, -1, color, font);
		y += 16;
	},
	
	//Checks if the ball has hit the left or right sides of the screen
	isHorizantalBounce: function() {
		if (this.getX() < 0 && this.getVelocityX() < 0) {
			return true;
		}
		
		if (this.getX() > root.getWindowWidth() - this.getWidth()) {
			return true;
		}
		
		return false;
	},
	
	//Checks if the ball has hit the top or bottom sides of the screen
	isVerticalBounce: function() {
		if (this.getY() < 0 && this.getVelocityY() < 0) {
			return true;
		}
		
		if (this.getY() > root.getWindowheight() - this.getHeight()) {
			return true;
		}
		
		return false;
	},
	
	//Gets the ball's X position
	getX: function() {
		return this._x;
	},
	
	//gets the ball's Y position
	getY: function() {
		return this._y;
	},
	
	//gets the ball's X velocity
	getVelocityX: function() {
		return this._velX;
	},
	
	//gets the ball's Y velocity
	getVelocityY: function() {
		return this._velY;
	},
	
	//gets the ball's width
	getWidth: function() {
		return 32;
	},
	
	//gets the ball's height
	getHeight: function() {
		return 32;
	}
});