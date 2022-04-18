/*
	Version 1.1
	Made by MarkyJoe1990

	This plugin designates the rewards you get at the end of
	a chapter when you meet the turn conditions (IE: Complete
	the chapter within X turns). You can view what rewards you
	get - as well as the conditions to obtain them - by
	looking at the "Objective" screen.
	
	If all prizes have the same turn conditions, they will be
	displayed in a simplified format that allows room for more
	rewards to be shown.

	How To Use:
	- Go to your chapter's "Map Information"
	- Click custom parameters.
	- Create a set of curly braces {} and put "turnRewards: " inside it
	- After the :, put a set of brackets []
	- Inside the brackets, create a set of curly braces {} and put your
	properties inside. For multiple rewards, separate each {} with a ,
	- It should look something like this:
	
	{
		turnRewards: [
			{
				type: TurnRewardType.ITEM,
				id: 3,
				turn: 9
			},
			{
				type: TurnRewardType.WEAPON,
				id: 41,
				turn: 9
			},
			{
				type: TurnRewardType.GOLD,
				amount: 1000,
				turn: 9
			},
			{
				type: TurnRewardType.BONUS,
				amount: 100,
				turn: 9
			}
		]
	}
	
	Custom Parameters:
	
	turnRewards
	Required. Designates an array of rewards to give to the player.
	
	type
	The type of reward. Can be an item, weapon, gold or bonus. The
	types are as follows:
	- TurnRewardType.ITEM
	- TurnRewardType.WEAPON
	- TurnRewardType.GOLD
	- TurnRewardType.BONUS

	id
	ID of the weapon or item being given. You can get the id by
	going to Tools -> Options -> Data, then checking "Display id
	next to data name". Then go into your database and check the number
	next to your items and weapons.
	
	amount
	Amount of gold or bonus to give.
	
	turn
	Required. Designates the turn count the player must meet or be
	under in order to receive the reward at the end of the chapter.
	Set this to -1 to make the reward unconditional.

	This plugin overrides the original functions for:
	ObjectiveWindow._drawObjectiveArea
	ObjectiveWindow._drawArea
	
	ObjectiveFaceZone.drawFaceZone
	ObjectiveFaceZone._drawInfo

	Be wary of any new plugins that change these functions, as they
	might not be compatible with this plugin.
	
	Possible Future Features:
	- Allow for use of switches and variables instead of turns.
		- Allow >=, >, ==, !=, <=, and < for variable conditions.
	- Allow option to hide identity of rewards while showing reward conditions.
	- Add a checkmark or cross to indicate when a player has succeeded or failed
	a condition.
*/