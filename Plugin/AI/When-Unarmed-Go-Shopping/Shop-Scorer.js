AIScorer.Shop = defineObject(BaseAIScorer, {
	getScore: function(unit, combination) {
		
		if (combination.shop == null) {
			return 0;
		}
		
		//preparation stuff
		var score = 0;
		combination.bestWeapon = null;
		
		//Okay. So now we have every shop's position.
		//We don't know what's INSIDE the shops, so we'll
		//need to use PosChecker.getPlaceEventFromPos.
		
		var type = PlaceEventType.SHOP;
		var x = combination.targetPos.x;
		var y = combination.targetPos.y;
		
		//this._
		
		var event = PosChecker.getPlaceEventFromPos(type, x, y);
		var placeEvent = event.getPlaceEventInfo();
		var currentShop = placeEvent.getShopData();
		
		//Now that we have the shop's data, time to
		//look through its inventory, and determine which
		//Weapon is the best one! Then score it
		score += this._findBestShopWeapon(unit, currentShop, combination);
		return score;
	},
	
	_findBestShopWeapon: function(unit, shopData, combination) {
		var i, currentWeapon, highestScore, currentScore;
		var shopArray = shopData.getShopItemArray();
		
		//Look through every item in the shop
		//Score each item, and keep track of the highest
		//scored item
		highestScore = 0;
		for (i = 0; i < shopArray.length; i++) {
			currentWeapon = shopArray[i];
			currentScore = 0;
			
			//If the unit can't use the item, don't even bother...
			if (!ItemControl.isWeaponAvailable(unit, currentWeapon)) {
				continue;
			}
			
			//Oh! You can use the item. Let's see how good it really is...
			currentScore += this._getAttackScore(currentWeapon); //Score damage
			currentScore += this._getHitScore(currentWeapon); //Score hit
			currentScore += this._getCritScore(currentWeapon); //Score crit
			currentScore += this._getStateScore(currentWeapon); //Score status effect
			currentScore += this._getRangeScore(currentWeapon); //Score attack range
			
			//If this weapon scores the highest, set it as the
			//shop's best weapon for this unit.
			if (currentScore > highestScore) {
				highestScore = currentScore;
				combination.bestWeapon = currentWeapon;
				combination.itemIndex = i;
			}
		}
		
		if (highestScore == 0) {
			highestScore = -1000;
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
	
	//TO BE DONE SOME OTHER DAY
	_getSkillScore: function(weapon) {
		return 0;
	},
	
	//Score all the weapon's special effects
	_getWeaponOptionScore: function(weapon) {
		return 0;
	},
	
	//Score the weight of the weapon
	_getWeightScore: function(weapon) {
		return 0;
	},
	
	//Check to see how many things the weapon is effective against
	_getEffectivenessScore: function(weapon) {
		return 0;
	},
	
	//Score the stat bonuses the weapon gives
	_getParameterScore: function(weapon) {
		return 0;
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
	}
});