/*
	Version 1.0
	Made by MarkyJoe1990

	This adds a new system to your game where killing enemies
	will influence the stats you gain on level up based on their
	class.
	
	The way this works is that your units have a custom parameter
	called statInfluencerArray. This is an array that tracks the
	amount of points your unit has accumulated towards a specific
	stat. Once the points for a certain stat exceeds 100, your
	next level up will gain an extra point in that stat, in addition
	to whatever stat gains you would get normally.
	
	The way you gain these points is by killing enemies. Enemies
	will give you a certain amount of points based on what class
	they are. The points given by a class are determined by you,
	by setting their statInfluencerArray custom parameter.
	
	Let's say you want an enemy fighter to give 10 "influence"
	points towards strength. You would set the fighter's
	custom parameters as follows:
	
	{
		statInfluencerArray: [0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	
	You may notice that the 10 is in the second field, not the first.
	The order of the fields corresponds to the order parameters are
	placed in within the game. For most games, parameters are ordered
	like this:
	
	Max HP
	Strength
	Magic
	Skill
	Speed
	Luck
	Defense
	Resistance
	Move
	Weapon Level
	Build
	
	However, if you have more parameters than these, then you'll
	need to figure out what position they are in the parameter type array.
*/