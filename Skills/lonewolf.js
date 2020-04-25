(function() {
	var scopeError = function(skill) {
		root.msg("Check the custom parameter \"scope\" for skill: '" + skill.getName() + "'");
		root.endGame();
	}
	
	var alliesInRange = function(unit, scope) {
		unitX = unit.getMapX();
		unitY = unit.getMapY();
		var i;
		var amount = 0;

		var allyList = [];
		if (unit.getUnitType() == UnitType.ENEMY) {
			allyList.push(EnemyList.getAliveList());
		} else {
			allyList.push(PlayerList.getSortieList());
			allyList.push(root.getCurrentSession().getGuestList());
			allyList.push(AllyList.getAliveList());
		}

		for (i = 0; i < allyList.length ;i++) {
			for (x = 0; x < allyList[i].getCount(); x++) {
				targetUnit = allyList[i].getData(x);
				distanceX = Math.abs(unitX - targetUnit.getMapX());
				distanceY = Math.abs(unitY - targetUnit.getMapY());
				totalDistance = distanceX + distanceY;
				if (totalDistance > 0 && totalDistance <= scope) {
					amount++;
				}
			}
		}
		
		return amount;
	}
	
	var alias1 = AbilityCalculator.getPower;
	AbilityCalculator.getPower = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var pow = alias1.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.power == undefined ? 0 : currentSkill.custom.power;
			if (amount <= 0) {
				pow += bonus;
			}
		}
		return pow;
	}
	
	var alias2 = AbilityCalculator.getHit;
	AbilityCalculator.getHit = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var hit = alias2.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.hit == undefined ? 0 : currentSkill.custom.hit;
			if (amount <= 0) {
				hit += bonus;
			}
		}
		return hit;
	}
	
	var alias3 = AbilityCalculator.getAvoid;
	AbilityCalculator.getAvoid = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var avo = alias3.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.avoid == undefined ? 0 : currentSkill.custom.avoid;
			if (amount <= 0) {
				avo += bonus;
			}
		}
		return avo;
	}
	
	var alias4 = AbilityCalculator.getCritical;
	AbilityCalculator.getCritical = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var crit = alias4.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.critical == undefined ? 0 : currentSkill.custom.critical;
			if (amount <= 0) {
				crit += bonus;
			}
		}
		return crit;
	}
	
	var alias5 = AbilityCalculator.getCriticalAvoid;
	AbilityCalculator.getCriticalAvoid = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var cavo = alias5.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.criticalAvoid == undefined ? 0 : currentSkill.custom.criticalAvoid;
			if (amount <= 0) {
				cavo += bonus;
			}
		}
		return cavo;
	}
	
	var alias6 = AbilityCalculator.getAgility;
	AbilityCalculator.getAgility = function(unit, weapon) {
		var i, scope, amount, bonus, currentSkill;
		var agi = alias6.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(unit, scope);
			bonus = currentSkill.custom.agility == undefined ? 0 : currentSkill.custom.agility;
			if (amount <= 0) {
				agi += bonus;
			}
		}
		return agi;
	}
	
	//For defense resistance
	var alias7 = DamageCalculator.calculateDefense;
	DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var i, scope, amount, bonus, currentSkill;
		var def = alias7.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
		var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, "LoneWolf");
		
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			if (currentSkill.custom.scope == undefined) {
				scopeError(currentSkill);
			}
			scope = currentSkill.custom.scope;
			amount = alliesInRange(passive, scope);
			
			if (Miscellaneous.isPhysicsBattle(weapon)) {
				bonus = currentSkill.custom.defense == undefined ? 0 : currentSkill.custom.defense;
			} else {
				bonus = currentSkill.custom.resistance == undefined ? 0 : currentSkill.custom.resistance;
			}
			
			if (amount <= 0) {
				def += bonus;
			}
		}
		return def;
	}
}) ();
