/*
	Version 1.0
	Made by MarkyJoe
	
	This script adds a new skill that heals, hurts,
	or inflicts the user if they either hit, or kill
	their opponent, depending on what you set. This
	effectively allows you to implement skills such
	as Lifetaker or, to a lesser extent, Bloodthirst.
	
	How To Use:
	- Create a skill with the "custom" radio checked
	- Click the Skill Effects field. This will bring up a window.
	- If you want the bonuses when you initiate battle, set the name to "Special-Recoil"
	- Click "OK" and then click custom parameters.
	- Set the bonuses you want. Example:
	{
		value: 5,
		stateId: 42,
		onKill: true
	}
	- Hit okay and then you're done!
	
	Custom Parameters:
	All custom parameters are optional.
	
	value
	Sets the amount of HP you either heal or lose.
	Positive numbers hurt. Negative numbers heal.
	
	stateId
	The state that the user is inflicted with when
	they meet the hit or kill conditions
	
	onKill
	If set to true, the value and stateId arguments only
	apply if you kill the opponent. If set to false, they
	are applied on hit. Defaults to false.
*/

(function () {
	var alias0 = SkillRandomizer.isCustomSkillInvokedInternal;
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		
		if (keyword === 'Special-Recoil') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		
		return alias0.call(this, active, passive, skill, keyword);
	}
	
	var alias1 = AttackEvaluator.ActiveAction._arrangeActiveDamage;
	AttackEvaluator.ActiveAction._arrangeActiveDamage = function (virtualActive, virtualPassive, attackEntry) {
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var activeDamage = alias1.call(this, virtualActive, virtualPassive, attackEntry);
		var passiveDamage = attackEntry.damagePassive;
		var skill = SkillControl.getPossessionCustomSkill(active, 'Special-Recoil');
		var max;
		
		if (SkillRandomizer.isCustomSkillInvoked(active, passive, skill, 'Special-Recoil')) {
			max = ParamBonus.getMhp(active);
			
			
			if (skill.custom.onKill != true) {
				if (skill.custom.value != undefined) {
					activeDamage += skill.custom.value;
				}
				
				if (skill.custom.stateId != undefined) {
					state = root.getBaseData().getStateList().getDataFromId(skill.custom.stateId);
					
					attackEntry.stateArrayActive.push(state);
					virtualActive.stateArray.push(state);
				}
			} else if (skill.custom.onKill == true && passiveDamage >= virtualPassive.hp) {
				if (skill.custom.value != undefined) {
					activeDamage += skill.custom.value;
				}
				
				if (skill.custom.stateId != undefined) {
					state = root.getBaseData().getStateList().getDataFromId(skill.custom.stateId);
					
					attackEntry.stateArrayActive.push(state);
					virtualActive.stateArray.push(state);
				}
				
			} else {
				return activeDamage;
			}
			
			
			if (activeDamage > 0) {
				if (virtualActive.hp - activeDamage < 0) {
					activeDamage = virtualActive.hp;
					DamageControl.setDeathState(active);
				}
			} else if (activeDamage < 0) {
				if (virtualActive.hp + activeDamage > max) {
					damageActive = max - virtualActive.hp;
				}
			}
			
		}
		
		return activeDamage;
	}
}) ();