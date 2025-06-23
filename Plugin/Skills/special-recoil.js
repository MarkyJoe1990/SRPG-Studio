/*
	Version 3.0
	Made by MarkyJoe
	
	This script adds two skills that can hurt, heal,
	or inflict a user upon hitting or killing a target.
	If you choose "Special-Recoil" as the skill's keyword,
	or set the custom parameter "isSpecialRecoil" to true,
	these effects apply to the person bearing the skill.
	Conversely, the custom keyword "Revenge-Recoil" or
	custom parameter "isRevengeRecoil" will make the
	effects apply to the unit ATTACKING the target that
	possesses the skill.
	
	This effectively allows you to implement skills such
	as Lifetaker or, to a lesser extent, Bloodthirst.
	
	How To Use:
	- Create a skill. If its only effect is the recoil, I recommend select the "Custom" type for the skill.
		- Conversely, if you want multiple effects stacked on the same skill, you don't need to set it to
		custom. More on this later.
	- Click the Skill Effects field. This will bring up a window.
	- If you want the skill-bearer to receive the recoil, use the "Special-Recoil" keyword.
		- Alternatively, if you want multiple effects on the skill, set the custom parameter "isSpecialRecoil" to true.
	- If you want the skill-bearer to cause their target to receive the recoil instead, use "Revenge-Recoil" instead
		- Alternatively, if you want multiple effects on the skill, set the custom parameter "isRevengeRecoil" to true.
	- Click "OK" and then click custom parameters.
	- Set the bonuses. Example:
	{
		damage: 5,
		onKillDamage: 3,
		state: 4,
		onKillState: 6,
	}
	- Hit okay and then you're done!
	
	Custom Parameters:
	All custom parameters are optional.
	
	damage
	Determines how much damage or healing the attacker
	receives after landing a hit.
	* You can use either a flat number, or a function
	as the value, with the active unit, passive unit,
	and current attack entry data as arguments. The
	function needs to return a number.
	
	state
	The state ID that determines the status effect
	the attacker receives after landing a successful hit.
	* You can use either a number, or a function
	as the value, with the active unit, passive unit,
	and current attack entry data as arguments. The
	function needs to return a number.
	
	onKillDamage
	Determines how much damage or healing the attacker
	receives after killing the opponent. Stacks with
	the damage custom parameter.
	* You can use either a number, or a function
	as the value, with the active unit, passive unit,
	and current attack entry data as arguments. The
	function needs to return a number.
	
	onKillState
	The state ID that determines the status effect
	the attacker receives after killing the opponent.
	If both the state and onKillState custom parameters
	are set, onKillState takes priority if its conditions
	are met.
	You can use either a number, or a function
	as the value, with the active unit, passive unit,
	and current attack entry data as arguments. The
	function needs to return a number.

	Function Overwrites:
	This plugin overwrites the UIBattleLayout._showDamageAnime
	function. Be careful using this with other plugins that
	modify this function.
*/

var RecoilControl = {
	_active: null,
	_passive: null,
	_damage: 0,
	_skill: null,
	
	parseNumber: function(value, active, passive, attackEntry) {
		if (typeof value == "function") {
			return value(active, passive, attackEntry);
		} else if (typeof value == "number") {
			return value;
		}
		
		return 0;
	},
	
	parseState: function(value, active, passive, attackEntry) {
		if (typeof value == "function") {
			return value(active, passive, attackEntry);
		} else if (typeof value == "number") {
			return value;
		}
		
		return -1;
	},

	isSpecialRecoil: function(skill) {
		return skill.getCustomKeyword() === "Special-Recoil" || skill.custom.isSpecialRecoil === true;
	},

	isRevengeRecoil: function(skill) {
		return skill.getCustomKeyword() === "Revenge-Recoil" || skill.custom.isRevengeRecoil === true;
	},
	
	isInRange: function(active, passive, skill) {
		var startRange = skill.custom.startRange;
		var endRange = skill.custom.endRange;
		
		if (startRange == undefined || endRange == undefined) {
			return true;
		}
		
		var distance = this._calculateDistance(active, passive);
		
		if (distance >= startRange && distance <= endRange) {
			return true;
		}
	},
	
	_calculateDistance: function(active, passive) {
		var activeX = active.getMapX();
		var activeY = active.getMapY();
		var passiveX = passive.getMapX();
		var passiveY = passive.getMapY();
		
		var distX = Math.abs(activeX - passiveX);
		var distY = Math.abs(activeY - passiveY);
		
		return distX + distY;
	},
	
	quarterRecoil: function(active, passive, attackEntry) {
		var damage = attackEntry.damagePassive;
		
		return Math.floor(damage / 4) + 3;
	},
	
	damagePassiveFull: function(active, passive, attackEntry) {
		return attackEntry.damagePassiveFull;
	},
	
	damagePassiveFullNegative: function(active, passive, attackEntry) {
		return attackEntry.damagePassiveFull * -1;
	},
	
	thirdOfOwnMaxHp: function(active, passive, attackEntry) {
		return Math.floor(RealBonus.getMhp(active) * 0.3);
	}
};

(function () {
	
	// Validation Function
	var validateDamage = function(virtualActive, damageActive) {
		var unit = virtualActive.unitSelf;
		if (damageActive < 0) {
			if (typeof DisableHealStateControl != "undefined") {
				if (DisableHealStateControl.hasHealingDisableStatus(unit) === true) {
					return 0;
				}
			}
		}

		var max = RealBonus.getMhp(unit);
		var hp = virtualActive.hp;
		var destHp = hp - damageActive;

		if (destHp > max) {
			return hp - max;
		} else if (destHp < 0) {
			if (SkillControl.checkAndPushSkill(active, passive, attackEntry, true, SkillType.SURVIVAL) != null) {
				return hp - 1;
			}

			DamageControl.setDeathState(unit);
			return hp;
		}

		return damageActive;
	}

	// Skill checking function
	var checkSkills = function(virtualActive, virtualPassive, active, passive, attackEntry, skillArray, filterFunc) {
		var damageActive = 0;
		var spGainActive = 0;
		var stateId = -1;
		var state = null;
		filterFunc = filterFunc || function(skill) { return true; }

		var isHit = attackEntry.isHit;
		var isKill = attackEntry.damagePassive >= virtualPassive.hp;

		var i, currentSkill, count = skillArray.length;
		for (i = 0; i < count; i++) {
			currentSkill = skillArray[i].skill;

			if (filterFunc(currentSkill) === false) {
				continue;
			}

			if (isHit === true) {
				damageActive += RecoilControl.parseNumber(currentSkill.custom.damage, active, passive, attackEntry);
				spGainActive += RecoilControl.parseNumber(currentSkill.custom.spGain, active, passive, attackEntry);
				stateId = RecoilControl.parseState(currentSkill.custom.state, active, passive, attackEntry);
				if (isKill === true) {
					damageActive += RecoilControl.parseNumber(currentSkill.custom.onKillDamage, active, passive, attackEntry);
					spGainActive += RecoilControl.parseNumber(currentSkill.custom.onKillSpGain, active, passive, attackEntry);
					stateId = RecoilControl.parseState(currentSkill.custom.onKillState, active, passive, attackEntry);
				}

				if (stateId != -1) {
					state = root.getBaseData().getStateList().getDataFromId(stateId);

					if (state != null) {
						attackEntry.stateArrayActive.push(state);
						virtualActive.stateArray.push(state);
					}
				}
			}
		}

		attackEntry.spGainActive += spGainActive;

		return damageActive;
	}

	var alias1 = AttackEvaluator.ActiveAction._arrangeActiveDamage;
	AttackEvaluator.ActiveAction._arrangeActiveDamage = function(virtualActive, virtualPassive, attackEntry) {
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		
		var damageActive = alias1.call(this, virtualActive, virtualPassive, attackEntry);

		// First, calculate recoil from weapon
		damageActive += RecoilControl.parseNumber(virtualActive.weapon.custom.recoilDamage, active, passive, attackEntry);

		// Then, check skills.
		damageActive += checkSkills(virtualActive, virtualPassive, active, passive, attackEntry, SkillControl.getDirectSkillArray(active, -1, 'Special-Recoil'), RecoilControl.isSpecialRecoil);
		damageActive += checkSkills(virtualActive, virtualPassive, passive, active, attackEntry, SkillControl.getDirectSkillArray(passive, -1, 'Revenge-Recoil'), RecoilControl.isRevengeRecoil);

		// Validate and finalize damage
		return validateDamage(virtualActive, damageActive);
	}
	
	var alias2 = UIBattleLayout._showDamageAnime;
	
	//Sadly... I have to overwrite stuff
	UIBattleLayout._showDamageAnime = function(battler, isCritical, isFinish) {
		var pos, effect, isRight;
		var anime = null;
		var isNoDamage = this._realBattle.getAttackOrder().getPassiveDamage() === 0;
		var offsetPos = EnemyOffsetControl.getOffsetPos(battler);
		
		if (root.getAnimePreference().isEffectDefaultStyle()) {
			isRight = this._realBattle.getActiveBattler() === this._realBattle.getBattler(true);
		}
		else {
			isRight = this._realBattle.getPassiveBattler() === this._realBattle.getBattler(true);
		}
		
		// Get custom damage anime.
		var activeBattler = this._realBattle.getActiveBattler();
		var motion = activeBattler.getAnimeMotion();
		var animeData = motion.getAnimeData();
		var motionId = motion.getMotionId();
		var frameIndex = motion.getFrameIndex();
		var animeCustom = animeData.getFrameCustom(motionId, frameIndex);

		var damageEffectData = animeCustom.damageEffectData;
		if (damageEffectData !== undefined) {
			var baseData = root.getBaseData();
			var effectList = baseData.getEffectAnimationList(damageEffectData.isRuntime)
			anime = effectList.getDataFromid(damageEffectData.id);
		} else {
			anime = WeaponEffectControl.getDamageAnime(this._realBattle.getActiveBattler().getUnit(), isCritical, true);
		}

		if (anime !== null) {
			pos = battler.getEffectPos(anime);
			effect = this._realBattle.createEffect(anime, pos.x + offsetPos.x, pos.y + offsetPos.y, isRight, false);
			effect.setAsync(this._isDamageEffectAsync());
			effect.enableSpriteScaling(this._isDamageEffectScaling());
		}
		
		if (isNoDamage) {
			anime = root.queryAnime('realnodamage');
		}
		else if (isCritical) {
			anime = root.queryAnime('realcriticalhit');
		}
		else {
			anime = null;
		}
		
		if (anime !== null) {
			pos = battler.getEffectPos(anime);
			effect = this._realBattle.createEffect(anime, pos.x + offsetPos.x, pos.y + offsetPos.y + this._getTextAnimeOffsetY(), isRight, false);
			effect.setAsync(false);
			effect.enableSpriteScaling(this._isDamageEffectScaling());
		}
		
		//MARKYJOE EDIT
		if (!isNoDamage && this._isDamagePopupDisplayable()) {
			//Check if battler is the active unit
			
			if (battler._unit != this._realBattle.getAttackOrder().getActiveUnit()) {
				this._showDamagePopup(battler, this._realBattle.getAttackOrder().getPassiveFullDamage(), isCritical);
			} else {
				this._showDamagePopup(battler, this._realBattle.getAttackOrder().getActiveDamage(), isCritical);
			}
		}
		//END EDIT
	}
	
}) ();