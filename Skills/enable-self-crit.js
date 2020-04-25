/*
	Version 1.0
	Made by MarkyJoe1990
	
	Normally, in a game where critical hits are not enabled automatically,
	being able to land critical hits on an enemy requires a skill with the
	"Allow Criticals" effect. This skill, instead of enabling crits against
	enemies, enables crits on the user. This might be useful for certain
	harmful status effects.
	
	How to use:
	- Create a skill with the "custom" radio checked
	- Set the keyword to "CritVulnerable"
	- Done
*/

(function () {
	var alias1 = Miscellaneous.isCriticalAllowed;
	Miscellaneous.isCriticalAllowed = function(active, passive) {
		critAllow = alias1.call(this, active, passive);
		
		if (passive != null) {
			if (SkillControl.getPossessionCustomSkill(passive, "CritVulnerable") != null) {
				return true;
			}
		}
		
		return critAllow;
	}
}) ();
