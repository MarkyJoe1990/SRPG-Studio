/*
	Crowd Control
	Made by MarkyJoe1990 with help from PurpleManDown
	
	This allows your game to accept crowd control commands made by users on fecentral.org. These commands
	include setting unit HP, and adding/removing items, weapons, status effects, skills and combat arts (if
	they are installed).
	
	How To Use:
	- If you are the player, you will need to go to https://fecentral.org and log in or register an account
	- Once you've done that, go to https://fecentral.org/?page=generatecrowdcontrol (make sure, you are still logged in!)
	- A GUID will be generated for you. Copy the code, starting from the first "{" to the last "}"
	- Go into crowd-control-aliases.js and set CROWD_CONTROL_GAME_ID to your GUID
	- Your game is now ready to accept requests
	
	- If you're a user who wants to send commands to the player's game, go to https://fecentral.org/?page=submitcrowdcontrol
	- In the "Whose Game?" field, set it to the username of the player.
	- The rest should be self explantory.
	
	KNOWN ERRORS:
	- Sometimes if no new commands are added to the queue, a whole bunch of error notifcations pop up on screen
	- If you get a game over, the game crashes
*/