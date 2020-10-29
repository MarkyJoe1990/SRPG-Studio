AIScorer.Trade = defineObject(BaseAIScorer,{
	getScore: function(unit, combination) {
		var score = 0;
		var searchMode = combination.searchMode;
		var targetUnit = combination.targetUnit;
		var name = unit.getName();
		
		if (targetUnit == null) {
			return AIValue.MIN_SCORE;
		}
		
		if (searchMode == undefined) {
			return AIValue.MIN_SCORE;
		}
		
		if (typeof searchMode != "number" || searchMode == ItemSearchMode.NONE) {
			return AIValue.MIN_SCORE;
		}
		
		
		
		//If you're looking for a spare weapon and the target has none
		if (searchMode & ItemSearchMode.WEAPON) {
			score += this._getBestSpareWeapon(unit, targetUnit, combination);
			if (score < 0) {score = 0};
		}
		//If you're looking for a healing item and the target has none
		if (searchMode & ItemSearchMode.HEALING) {
			score += this._getBestHealingItem(unit, targetUnit, combination);
			if (score < 0) {score = 0};
		}
		
		if (score <= 0) {
			return AIValue.MIN_SCORE;
		}
		
		return score;
	},
	
	//Gets only weapons you can actually use, and excludes the user's equipped weapon
	_getBestSpareWeapon: function(unit, targetUnit, combination) {
		var i, highestScore, currentWeapon, currentScore;
		var offLimitsWeapon = ItemControl.getEquippedWeapon(targetUnit);
		
		if (offLimitsWeapon == null) {
			return 0;
		}
		var count = UnitItemControl.getPossessionItemCount(targetUnit);
		
		combination.bestWeapon = null;
		
		if (count == 0) {
			return 0;
		}
		
		highestScore = 0;
		for (i = 0; i < count; i++) {
			currentWeapon = UnitItemControl.getItem(targetUnit, i);
			//If weapon is target's equipped weapon, then no
			if (currentWeapon == offLimitsWeapon) {
				continue;
			}
			
			//If the weapon isn't usable by our unit, no
			if (!ItemControl.isWeaponAvailable(unit, currentWeapon)) {
				continue;
			}
			
			//Item is spare AND is usable. Score it.
			currentScore = 0;
			currentScore += this._getAttackScore(currentWeapon); //Score damage
			currentScore += this._getHitScore(currentWeapon); //Score hit
			currentScore += this._getCritScore(currentWeapon); //Score crit
			currentScore += this._getStateScore(currentWeapon); //Score status effect
			currentScore += this._getRangeScore(currentWeapon); //Score attack range
			
			if (currentScore > highestScore) {
				highestScore = currentScore;
				combination.bestWeapon = currentWeapon;
				combination.bestWeaponIndex = i;
			}
		}
		
		return highestScore;
	},
	
	//Score weapon's attack power
	_getAttackScore: function(weapon) {
		var pow = weapon.getPow();
		var attackCount = weapon.getAttackCount();
		
		if (pow == 0) {
			return 0;
		}
		
		return Miscellaneous.convertAIValue(pow) * attackCount;
	},
	
	_getHitScore: function(weapon) {
		var hit = weapon.getHit();
		
		if (hit == 0) {
			return 0;
		}
		
		return Math.ceil(hit / 5);
	},
	
	_getCritScore: function(weapon) {
		var crit = weapon.getCritical();
		
		if (crit == 0) {
			return 0;
		}
		
		return Math.ceil(crit / 5);
	},
	
	_getRangeScore: function(weapon) {
		var startRange = weapon.getStartRange();
		var endRange = weapon.getEndRange();
		
		var difference = Math.abs(startRange - endRange);
		
		return difference * 5;
	},
	
	_getStateScore: function(weapon) {
		var data, state;
		var stateInvocation = weapon.getStateInvocation();
		var score = 0;
		
		//Check if weapon has state invocation
		if (stateInvocation == null) {
			return 0
		}
		
		//Check if stateInvocation has state
		state = stateInvocation.getState();
		if (state == null) {
			return 0;
		}
		
		//state.getTurn() is the number of turns the status effect lasts. Not factored in regular AI
		
		//Add points for every prohibited action
		score += this._scoreProhibitedActions(state);
		
		//How much HP per turn is lost?
		recoveryValue = state.getAutoRecoveryValue();
		if (recoveryValue !== 0) {
			score += Math.abs(recoveryValue);
		}
		
		//If cannot act (such as sleep), add 15
		if (state.getBadStateOption() == BadStateOption.NOACTION) {
			score += 15;
		}
		
		//If berserk... holy fuck, make that 25
		if (state.getBadStateOption() == BadStateOption.BERSERK) {
			score += 25;
		}
		
		//Calculate number of turns last
		return score + StateScoreChecker._getDopingValue(state);
	},
	
	_scoreProhibitedActions: function(state) {
		var score = 0;
		
		//Does it disable physical attacks?
		if (state.getBadStateFlag() & BadStateFlag.PHYSICS) {
			score += 5;
		}
		
		//Does it disable magical attacks?
		if (state.getBadStateFlag() & BadStateFlag.MAGIC) {
			score += 5;
		}
		
		//Does it disable item usage?
		if (state.getBadStateFlag() & BadStateFlag.ITEM) {
			score += 5;
		}
		
		//Does it disable wands?
		if (state.getBadStateFlag() & BadStateFlag.WAND) {
			score += 5;
		}
		
		return score;
	},
	
	_getBestHealingItem: function(unit, targetUnit, combination) {
		var i, highestScore, currentScore, currentItem;
		var healingArray = [];
		var count = UnitItemControl.getPossessionItemCount(targetUnit);
		
		combination.bestItem = null;
		
		if (count == 0) {
			return 0;
		}
		
		highestScore = 0;
		for (i = 0; i < count; i++) {
			currentItem = UnitItemControl.getItem(targetUnit, i);
			
			//if you can't use it, no.
			if (!ItemControl.isItemUsable(unit, currentItem)) {
				continue;
			}
			
			//If it's MULTI range type, no
			if (currentItem.getRangeType() == SelectionRangeType.MULTI) {
				continue;
			}
			
			//if it's not a healing item, no.
			itemType = currentItem.getItemType();
			currentScore = 0;
			if (itemType == ItemType.RECOVERY) {
				currentScore += this._getHealingScore(unit, currentItem);
			}
			if (itemType == ItemType.ENTIRERECOVERY) {
				currentScore += this._getEntireHealingScore(unit, currentItem);
			}
			
			if (currentScore > highestScore) {
				highestScore = currentScore;
				combination.bestItem = currentItem;
				combination.bestItemIndex = i;
			}
		}
		
		return highestScore;
	},
	
	_getHealingScore: function(unit, item) {
		var plus = Calculator.calculateRecoveryItemPlus(unit, unit, item);
		var recoveryInfo = item.getRecoveryInfo();
		var score = this._getHealScore(unit);
		
		if (score < 0) {
			return AIValue.MIN_SCORE;
		}
		
		value = Calculator.calculateRecoveryValue(unit, recoveryInfo.getRecoveryValue(), recoveryInfo.getRecoveryType(), plus);
		score += Miscellaneous.convertAIValue(value);
		
		return score;
	},
	
	_getEntireHealingScore: function(unit, item) {
		var recoveryInfo = item.getEntireRecoveryInfo();
		var i, targetUnit;
		var maxScore = 150;
		var score = 0;
		var arr = EntireRecoveryControl.getTargetArray(unit, item);
		var count = arr.length;
		
		for (i = 0; i < count; i++) {
			targetUnit = arr[i];
			
			score += this._getHealScore(targetUnit);
			
			// When the score is high enough, considering entire recovery should be implemented, so stop checking any more. 
			if (score >= maxScore) {
				break;
			}
		}
		
		if (score = 0) {
			return AIValue.MIN_SCORE;
		}
		
		return score;
	},
	
	_getHealScore: function(unit) {
		var baseHp;
		var maxHp = ParamBonus.getMhp(unit);
		var currentHp = unit.getHp();
		
		if (currentHp === maxHp) {
			return 0;
		}
		
		baseHp = Math.floor(maxHp * 0.25);
		if (currentHp < baseHp) {
			return 50;
		}
		
		baseHp = Math.floor(maxHp * 0.5);
		if (currentHp < baseHp) {
			return 30;
		}
		
		baseHp = Math.floor(maxHp * 0.75);
		if (currentHp < baseHp) {
			return 10;
		}
		
		return 0;
	}
});

(function () {
	var alias1 = CombinationSelector._configureScorerFirst;
	CombinationSelector._configureScorerFirst = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(AIScorer.Trade);
	}
}) ();