AIScorer.Trade = defineObject(BaseAIScorer,{
	getScore: function(unit, combination) {
		var searchMode = combination.searchMode;
		var unitType = unit.getUnitType();
		
		if (searchMode == undefined) {
			return AIValue.MIN_SCORE;
		}
		
		if (typeof searchMode != "number" || searchMode == ItemSearchMode.NONE) {
			return AIValue.MIN_SCORE;
		}
		
		var i, count = combination.costArray.length;
		var j, directionCount = XPoint.length;
		
		var score = 0;
		
		//Check every position this unit can walk to... Judge the merits
		for (i = 0; i < count; i++) {
			var currentIndex = combination.costArray[i].posIndex;
			var currentPos = {};
			
			currentPos.x = CurrentMap.getX(currentIndex);
			currentPos.y = CurrentMap.getY(currentIndex);
			
			var combinedScore = 0; //Score of current position
			//Best weapon score and best healing score of this position...
			var bestWeaponInfo = this._createTradeInfo();
			var bestHealingInfo = this._createTradeInfo();
			var bestGiveInfo = this._createTradeInfo();
			var plusScore = 0;
			var currentTradeQueue = [];
			
			//IN CURRENT POSITION
			//Scan for adjacent units and judge their inventory merits;
			for (j = 0; j < directionCount; j++) {
				var targetUnit = PosChecker.getUnitFromPos(currentPos.x + XPoint[j], currentPos.y + YPoint[j]);
				
				//If there isn't a unit here, don't bother;
				if (targetUnit == null) {
					continue;
				}
				
				var targetUnitType = targetUnit.getUnitType();
				if (!FilterControl.isUnitTypeAllowed(unitType, targetUnitType)) {
					continue;
				}
				
				//If you're looking for a spare weapon and the target has none
				if (searchMode & ItemSearchMode.WEAPON) {
					var currentWeaponInfo = this._getBestWeaponInfo(unit, targetUnit);
					
					if (currentWeaponInfo.score > bestWeaponInfo.score) {
						bestWeaponInfo = currentWeaponInfo;
					}
				}
				//If you're looking for a healing item and the target has none
				if (searchMode & ItemSearchMode.HEALING) {
					var currentHealingInfo = this._getBestHealingInfo(unit, targetUnit);
					
					if (currentHealingInfo.score > bestHealingInfo.score) {
						//root.log("Heal scored");
						bestHealingInfo = currentHealingInfo;
					}
				}
				
				//If target lacks a weapon, and you have a spare...
				if (ItemControl.getEquippedWeapon(targetUnit) == null) {
					var currentGiveInfo = this._getBestWeaponInfo(targetUnit, unit, currentPos);
					
					if (currentGiveInfo.score > bestGiveInfo.score) {
						bestGiveInfo = currentGiveInfo;
						plusScore = 10;
					}
				}
			}
			
			//Trade queue is required for later when we do
			//TradeAutoActions
			if (bestWeaponInfo.isValid) {
				currentTradeQueue.push(bestWeaponInfo);
			}
			
			if (bestHealingInfo.isValid) {
				currentTradeQueue.push(bestHealingInfo);
			}
			
			if (bestGiveInfo.isValid) {
				currentTradeQueue.push(bestGiveInfo);
			}
			
			//If current position score is higher than best position score...
			//Set best position to current position, complete with new trade queue
			combinedScore = bestWeaponInfo.score + bestHealingInfo.score + plusScore;
			if (combinedScore > score) {
				//root.log("Scored");
				score = combinedScore;
				combination.idealIndex = currentIndex;
				combination.tradeQueue = currentTradeQueue;
			}
		}
		
		if (score <= 0) {
			return AIValue.MIN_SCORE;
		}
		
		return score;
	},
	
	//Gets only weapons you can actually use, and excludes the user's equipped weapon
	_getBestWeaponInfo: function(unit, targetUnit, posOverride) {
		var i, highestScore, currentWeapon, currentScore;
		var offLimitsWeapon = ItemControl.getEquippedWeapon(targetUnit);
		
		if (posOverride == undefined) {
			posOverride = null;
		}
		
		var weaponInfo = this._createTradeInfo();
		
		var count = UnitItemControl.getPossessionItemCount(targetUnit);
		
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
			
			if (currentScore > weaponInfo.score) {
				weaponInfo.srcUnit = unit;
				weaponInfo.destUnit = targetUnit;
				weaponInfo.destItem = currentWeapon;
				weaponInfo.destIndex = i;
				weaponInfo.score = currentScore;
				weaponInfo.isValid = true;
				
				if (posOverride != null) {
					weaponInfo.x = posOverride.x;
					weaponInfo.y = posOverride.y;
				} else {
					weaponInfo.x = targetUnit.getMapX();
					weaponInfo.y = targetUnit.getMapY();
				}
			}
		}
		
		return weaponInfo;
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
	
	_getBestHealingInfo: function(unit, targetUnit) {
		var i, highestScore, currentScore, currentItem;
		var healingArray = [];
		var count = UnitItemControl.getPossessionItemCount(targetUnit);
		
		if (count == 0) {
			return 0;
		}
		
		var healingInfo = this._createTradeInfo();
		
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
			
			if (currentScore > healingInfo.score) {
				healingInfo.srcUnit = unit;
				healingInfo.destUnit = targetUnit;
				healingInfo.destItem = currentItem;
				healingInfo.destIndex = i;
				healingInfo.score = currentScore;
				healingInfo.isValid = true;
				healingInfo.x = targetUnit.getMapX();
				healingInfo.y = targetUnit.getMapY();
			}
		}
		
		return healingInfo;
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
	},
	
	_createTradeInfo: function() {
		return {
			srcUnit: null, //Unit taking
			srcItem: null, //Item being given in exchange for destItem
			destUnit: null, //Unit giving
			destItem: null, //item being taken
			isValid: false,
			x: -1,
			y: -1,
			score: -1 //total score of trade action
		}
	}
});