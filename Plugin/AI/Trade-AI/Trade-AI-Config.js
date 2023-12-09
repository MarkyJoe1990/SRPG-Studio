//Not implemented yet
var PROACTIVE_TRADING = false; //If an enemy notices one of their allies lacks a weapon, and the current one has a spare, they will walk over and give it.

//Just in case you want to disable actions after trading
var ADD_ATTACK_AFTER_TRADE = false;
var ADD_HEAL_AFTER_TRADE = true;

(function () {
	var alias1 = AutoActionBuilder._pushCustom;
	AutoActionBuilder._pushCustom = function(unit, autoActionArray, combination) {
		alias1.call(this, unit, autoActionArray, combination);
		if (combination.searchMode != null) {
			this._pushTrade(unit, autoActionArray, combination);
			
			var bestItem = this._findTradeItem(combination);
			
			if (bestItem != null && ADD_HEAL_AFTER_TRADE) {
				combination.item = bestItem;
				combination.targetUnit = unit;
				this._pushItem(unit, autoActionArray, combination);
			} else if (combination.bestTarget != null && ADD_ATTACK_AFTER_TRADE) {
				combination.targetUnit = combination.bestTarget;
				this._pushAttack(unit, autoActionArray, combination);
			}
		}
	}
	
	AutoActionBuilder._findTradeItem = function(combination) {
		var tradeQueue = combination.tradeQueue;
		var i, count = tradeQueue.length;
		var item = null
		
		for (i = 0; i < count; i++) {
			currentItem = tradeQueue[i].destItem;
			
			if (!currentItem.isWeapon()) {
				item = currentItem;
				break;
			}
		}
		
		return item;
	}
	
	var alias2 = CombinationBuilder._configureCombinationCollector;
	CombinationBuilder._configureCombinationCollector = function(groupArray) {
		alias2.call(this, groupArray);
		groupArray.appendObject(CombinationCollector.Trade);
	}

	var alias3 = CombinationSelector._configureScorerFirst;
	CombinationSelector._configureScorerFirst = function(groupArray) {
		alias3.call(this, groupArray);
		groupArray.appendObject(AIScorer.Trade);
	}
	
	var alias4 = CombinationSelector._configureScorerSecond;
	CombinationSelector._configureScorerSecond = function(groupArray) {
		alias4.call(this, groupArray);
		groupArray.appendObject(AIScorer.TradeAttack);
	}
}) ();