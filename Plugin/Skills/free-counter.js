/*
	Version 1.0
	Made by MarkyJoe, inspired by HeyItsKyo's Close and Omni Counter scripts
	
	This script adds a skill that allows the user to counter attack
	depending on how far or close the opponent is. You can set the
	exact distance range by setting the custom parameters startRange
	and endRange.
	
	This script also allows you to utilize the
	"effective targets" field in the skill editor. In other words,
	you can make the counter activate depending on more specific
	circumstances.
	
	How to Use:
	- Create a skill with the "custom" radio checked
	- Click the Skill Effects field. This will bring up a window.
	- Set the keyword to "Free-Counter"
	- Click "OK" and then click custom parameters.
	- Set the startRange and endRange. For example, if I want this
	skill to activate from 2 to 3 tiles away, I would put this:
		{
			startRange: 2,
			endRange: 3
		}
	- Hit okay and then you're done!
	
	Custom Parameters:
	All custom parameters are required
	
	startRange
	Designates the minimum range that activates the counter
	
	endRange
	Designates the maximum range that activates the counter
*/

(function () {
	var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		if (keyword === 'Free-Counter') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		return alias1.call(this, active, passive, skill, keyword)
	}
	
	var alias2 = AttackChecker.isCounterattack;
	AttackChecker.isCounterattack = function(unit, targetUnit) {
		var result = alias2.call(this, unit, targetUnit);
		var skillArray = SkillControl.getDirectSkillArray(targetUnit, -1, 'Free-Counter');
		var currentSkill, startRange, endRange;
		
		for (i = 0; i < skillArray.length; i++) {
			currentSkill = skillArray[i].skill;
			startRange = currentSkill.custom.startRange;
			endRange = currentSkill.custom.endRange;
			
			activeX = unit.getMapX();
			activeY = unit.getMapY();
			passiveX = targetUnit.getMapX();
			passiveY = targetUnit.getMapY();
			
			distance = Math.abs(Math.abs(activeX - passiveX) + Math.abs(activeY - passiveY));
			
			if (distance >= startRange && distance <= endRange && SkillRandomizer.isCustomSkillInvoked(targetUnit, unit, currentSkill, "Free-Counter")) {
				return true;
			}
		}
		
		return result
	}
}) ();