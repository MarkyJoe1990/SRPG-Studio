/*
	Version 1.0
	Made by MarkyJoe1990
	
	This adds a new skill called "Trick Room", based on the
	move from the Pokemon series. When a unit has this skill,
	the follow up formula is reversed: if you are slower than
	your opponent, you will attack twice instead of them.
	
	While this skill doesn't overwrite any functions, it may
	bypass the limitations of other plugins when a unit has
	the skill. For example, Goinza's Combat Art's prevent
	you from doing follow up attacks, but this plugin re-enables
	follow ups.

*/

(function () {
	var alias1 = Calculator.calculateRoundCount;
	Calculator.calculateRoundCount = function (active, passive, weapon) {
		var rndCnt = alias1.call(this, active, passive, weapon) ;
		
		activeSkill = SkillControl.getPossessionCustomSkill(active, "TrickRoom");
		passiveSkill = SkillControl.getPossessionCustomSkill(passive, "TrickRoom");
		
		if (activeSkill != null || passiveSkill != null) {
			var activeAgi;
			var passiveAgi;
			var value;
			
			if (!this.isRoundAttackAllowed(active, passive)) {
				return 1;
			}
			
			activeAgi = AbilityCalculator.getAgility(active, weapon);
			passiveAgi = AbilityCalculator.getAgility(passive, ItemControl.getEquippedWeapon(passive));
			value = this.getDifference();
			
			return (activeAgi - passiveAgi) <= (value*-1) ? 2 : 1;
		}
		
		return rndCnt;
	}
}) ();