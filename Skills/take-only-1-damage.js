/*
	Version 1.0
	Made by MarkyJoe1990
	
	This adds a new skill called "1DMG". Units that equip
	this skill can only take 1 damage, even if the attack
	is a critical hit.
*/

(function () {
	var alias1 = DamageCalculator.calculateDamage;
	DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		passiveSkill = SkillControl.getPossessionCustomSkill(passive, "1DMG");
		
		if (passiveSkill != null) {
			return 1;
		}
		
		return alias1.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);;
	}
}) ();