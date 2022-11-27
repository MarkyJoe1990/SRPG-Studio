/*
	Version 1.1
	Made by MarkyJoe1990
	
	This plugin adds the Rally skill from the Fire Emblem series.
	It also adds the effect of rallies as an item you can use.
	If you have a skill with the custom keyword "Rally", you gain
	a command that allows you to inflict one or multiple status
	effects on units that fit your skill's affiliation criteria.
	
	This plugin also adds AI implementation for Rallies, which
	means that if an enemy has a Rally Skill or item, they can
	and will use it. While the enemy doesn't have access to features
	such as rally comboing, it's easy enough to work around this by
	creating enemy exclusive rallies that fill the same role.
	
	NOTE 1 - If you are making a Rally Item, you can only use the
	stateId and includeSelf custom parameters. All other properties
	are either unavailable or handled via the editor such as start
	range.
	
	NOTE 2 - If you're using a Rally Item, you will want to set your
	scope to specify. The value you put in determines the range
	of the Rally.
	
	Custom Parameters:
	
	stateId:
	Determines the status effect to inflict. Make sure you have
	your database set to show Ids. You can go to tools ->
	options -> data -> display Id next to data name if you haven't
	done so already. You can either put in a number, or an
	array of numbers. Both will work.
	
	canCombo:
	If set to true, then the rally will be used at the same
	time as other rallies the unit has, so long as they have
	the same unitFilter value, and both are set to true.

	forceCombo:
	If set to true, then this rally will combo with any
	other rally, regardless of whether they have the same
	unitFilter or not. This allows for mixed rally combos.
	
	rangeType:
	Do you choose a single target in range, or does it get everyone?
	RallyRangeType.SINGLE makes the Rally only target one unit.
	RallyRangeType.MUTLI hits every unit in range that meets the
	unitFilter requirements.
	
	includeSelf:
	Can you use it on yourself? Set to true or false
	
	unitFilter:
	Specify what affiliations this rally works on.
	RallyFilterType.PLAYER allows allies to be hit with the Rally.
	RallyFilterType.ENEMY allows enemies to be hit with the Rally.
	RallyFilterType.ALL hits everyone in range, regardless of affiliation.
	
	startRange:
	Number. Starting range of rally.
	
	endRange:
	Number. End range of rally
	
	
	Hopeful Future Updates:
	- Animating status infliction
*/