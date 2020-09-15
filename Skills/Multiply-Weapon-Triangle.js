/*
	Made by MarkyJoe1990
	Version 2.0
	
	This script adds a custom skill that - when equipped - multiplies the bonuses
	the user gets when they have weapon advantage. The amount it gets multiplied
	is determined by the custom parameter "amount"
	
	To use, go to your game's database, then skills. Click "Create Skill" and
	give it the "Custom" effect. Then click keyword<> and put "Triangle".
	
	From here, click "Custom Parameters" and type {amount:X}, where X is
	the amount you want the weapon advantage to be multiplied. 0 removes the
	weapon advantage bonuses entirely. 1 makes it function like normal, -1
	reverses the effects, and numbers higher or lower than those increase the
	degree in which the bonuses are applied.
	
	With this in mind, you can create the "Reaver" weapons from the GBA Fire Emblem
	games that reverse the weapon triangle, or the "Gem" weapons from Fire Emblem
	Heroes.
	
*/

(function() {
	//Aliases
	var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
	var alias2 = CompatibleCalculator.getPower;
	var alias3 = CompatibleCalculator.getDefense;
	var alias4 = CompatibleCalculator.getHit;
	var alias5 = CompatibleCalculator.getAvoid;
	var alias6 = CompatibleCalculator.getCritical;
	var alias7 = CompatibleCalculator.getCriticalAvoid;
	
	//Function used in all calculations
	var multiplyCompatibleBonus = function(active, passive, value) {
		var currentSkill;
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, 'Triangle');
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'Triangle');
		var result = value;
		
		for (i = 0; i < activeSkill.length; i++) {
			currentSkill = activeSkill[i].skill;
			if (SkillRandomizer.isCustomSkillInvokedInternal(active, passive, currentSkill, 'Triangle')) {
				result *= currentSkill.custom.amount;
			}
		}
		for (i = 0; i < passiveSkill.length; i++) {
			currentSkill = passiveSkill[i].skill;
			if (SkillRandomizer.isCustomSkillInvokedInternal(passive, active, currentSkill, 'Triangle')) {
				result *= currentSkill.custom.amount;
			}
		}
		
		return result;
	}
	
	//Make skill work with aggregations
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		if (keyword === 'Triangle') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		return alias1.call(this, active, passive, skill, keyword);
	};
	
	//Multiple compatibility bonus by the skill amount
	CompatibleCalculator.getPower = function(active, passive, weapon) {
		var pow = alias2.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, pow);
	}
	
	CompatibleCalculator.getDefense = function(active, passive, weapon) {
		var def = alias3.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, def);
	}
	
	CompatibleCalculator.getHit = function(active, passive, weapon) {
		var hit = alias4.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, hit);
	}
	
	CompatibleCalculator.getAvoid = function(active, passive, weapon) {
		var avo = alias5.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, avo);
	}
	
	CompatibleCalculator.getCritical = function(active, passive, weapon) {
		var crt = alias6.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, crt);
	}
	
	CompatibleCalculator.getCriticalAvoid = function(active, passive, weapon) {
		var cavo = alias7.call(this, active, passive, weapon);
		return multiplyCompatibleBonus(active, passive, cavo);
	}
}) ();