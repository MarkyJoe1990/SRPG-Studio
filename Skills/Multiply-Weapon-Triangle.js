/*

	Made by MarkyJoe1990

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
	var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		if (keyword === 'Triangle') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		return alias1.call(this, active, passive, skill, keyword);
	};
	
	var alias2 = DamageCalculator.calculateAttackPower;
    DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		var pow = alias2.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Triangle");
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Triangle");
		
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			pow += (CompatibleCalculator.getPower(active, passive, weapon)*(activeSkill[i].skill.custom.amount-1));
		}
		
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			pow += (CompatibleCalculator.getPower(active, passive, weapon)*(passiveSkill[i].skill.custom.amount-1));
		}
		
		return pow;
	}
	
	var alias3 = DamageCalculator.calculateDefense;
	DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		def = alias3.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue)
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "Triangle");
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "Triangle");
		
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			def += (CompatibleCalculator.getDefense(passive, active, ItemControl.getEquippedWeapon(passive))*(passiveSkill[i].skill.custom.amount-1));
		}
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			def += (CompatibleCalculator.getDefense(passive, active, ItemControl.getEquippedWeapon(passive))*(activeSkill[i].skill.custom.amount-1));
		}
		return def;
	}
	
	var alias4 = HitCalculator.calculateSingleHit;
	HitCalculator.calculateSingleHit = function(active, passive, weapon, totalStatus) {
		hit = alias4.call(this, active, passive, weapon, totalStatus);
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, 'Triangle');
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'Triangle');
		
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			hit += (CompatibleCalculator.getHit(active, passive, weapon)*(activeSkill[i].skill.custom.amount-1));
		}
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			hit += (CompatibleCalculator.getHit(active, passive, weapon)*(passiveSkill[i].skill.custom.amount-1));
		}
		
		return hit;
	}
	
	var alias5 = HitCalculator.calculateAvoid;
	HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {
		avo = alias5.call(this, active, passive, weapon, totalStatus);
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, 'Triangle');
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'Triangle');
		
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			avo += (CompatibleCalculator.getAvoid(passive, active, ItemControl.getEquippedWeapon(passive))*(passiveSkill[i].skill.custom.amount-1));
		}
		
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			avo += (CompatibleCalculator.getAvoid(passive, active, ItemControl.getEquippedWeapon(passive))*(activeSkill[i].skill.custom.amount-1));
		}
		
		return avo;
	}
	
	var alias6 = CriticalCalculator.calculateSingleCritical;
	CriticalCalculator.calculateSingleCritical = function(active, passive, weapon, totalStatus) {
		crt = alias6.call(this, active, passive, weapon, totalStatus);
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, 'Triangle');
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'Triangle');
		
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			crt += (CompatibleCalculator.getCritical(active, passive, weapon)*(activeSkill[i].skill.custom.amount-1));
		}
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			crt += (CompatibleCalculator.getCritical(active, passive, weapon)*(passiveSkill[i].skill.custom.amount-1));
		}
		
		return crt;
	}
	
	var alias7 = CriticalCalculator.calculateCriticalAvoid;
	CriticalCalculator.calculateCriticalAvoid = function(active, passive, weapon, totalStatus) {
		cavo = alias7.call(this, active, passive, weapon, totalStatus);
		
		var activeSkill = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, 'Triangle');
		var passiveSkill = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'Triangle');
		
		for (i = 0; i < passiveSkill.length && passiveSkill[i].skill.custom.amount != undefined; i++) {
			cavo += (CompatibleCalculator.getCriticalAvoid(passive, active, ItemControl.getEquippedWeapon(passive))*(passiveSkill[i].skill.custom.amount-1));
		}
		for (i = 0; i < activeSkill.length && activeSkill[i].skill.custom.amount != undefined; i++) {
			cavo += (CompatibleCalculator.getCriticalAvoid(passive, active, ItemControl.getEquippedWeapon(passive))*(activeSkill[i].skill.custom.amount-1));
		}
		
		return cavo;
	}
}) ();
