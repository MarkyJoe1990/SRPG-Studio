var RallyAI = defineObject(BaseItemAI, {
	getItemScore: function(unit, combination) {
		var i, indexArray, currentUnit;
		var score = 0;
		
		if (combination.targetUnit.isWait()) {
			return AIValue.MIN_SCORE;
		}
		//First. get the destintion posIndex.
		//Get the coordinates from that, then generate
		//An indexArray from that.
		
		// The high leveled unit is more a target to act again.
		return combination.targetUnit.getLv() * 7;
		//return score;
	}
});

(function () {
	//Have Rally skills use the Skill Scorer
	var alias1 = AIScorer.Skill._getAIObject;
	AIScorer.Skill._getAIObject = function(unit, combination) {
		var obj = alias1.call(this, unit, combination);
		var skillType = combination.skill.getSkillType();
		var keyword = combination.skill.getCustomKeyword();
		
		if (skillType == SkillType.CUSTOM && keyword == "Rally") {
			obj = RallyAI;
		}
		
		return obj;
	}
	
	var alias2 = CombinationCollector.Skill._setCombination;
	CombinationCollector.Skill._setCombination = function(misc) {
		var skillType = misc.skill.getSkillType();
		var keyword = misc.skill.getCustomKeyword();
		
		if (skillType == SkillType.CUSTOM && keyword == "Rally") {
			this._setRallyCombination(misc);
		}
		
		alias2.call(this, misc);
	}
	
	var alias3 = SkillAutoAction._enterSkillUse;
	SkillAutoAction._enterSkillUse = function() {
		var result = alias3.call(this);
		var skillType = this._skill.getSkillType();
		var keyword = this._skill.getCustomKeyword();
		
		if (skillType == SkillType.CUSTOM && keyword == "Rally") {
			result = this._enterRally();
		}
		
		return result;
	}
	
	SkillAutoAction._enterRally = function() {
		var stateId = this._skill.custom.stateId;
		var isMulti = this._skill.custom.rangeType == RallyRangeType.MULTI;
		var filter = RallyControl.getUnitFilter(this._unit, this._skill);
		var rangeMetrics, x, y, i;
		
		var state, i, currentState;
		
		if (isMulti) {
			//Take every unit in range that meets the affiliation requirements
			//Then hit them with every status effect in the book;
			//get x, y and ranges
			
			x = this._unit.getMapX();
			y = this._unit.getMapY();
			
			rangeMetrics = StructureBuilder.buildRangeMetrics();
			rangeMetrics.startRange = this._skill.custom.startRange;
			rangeMetrics.endRange = this._skill.custom.endRange;
			
			indexArray = IndexArray.getBestIndexArray(x, y, rangeMetrics.startRange, rangeMetrics.endRange);
			
			for (i = 0; i < indexArray.length; i++) {
				currentIndex = indexArray[i];
				currentX = CurrentMap.getX(currentIndex);
				currentY = CurrentMap.getY(currentIndex);
				
				possibleUnit = PosChecker.getUnitFromPos(currentX, currentY);
				isValidUnit = possibleUnit != null && RallyControl.isFilterMatch(possibleUnit.getUnitType(), filter);
				
				if (isValidUnit) {
					if (typeof stateId == "number") {
						state = root.getBaseData().getStateList().getDataFromId(stateId);
						StateControl.arrangeState(possibleUnit, state, IncreaseType.INCREASE);
					} else {
						for (i = 0; i < stateId.length; i++) {
							currentState = root.getBaseData().getStateList().getData(stateId[i]);
							StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
						}
					}
				}
			}
			
		} else {
			if (typeof stateId == "number") {
				state = root.getBaseData().getStateList().getDataFromId(stateId);
				StateControl.arrangeState(this._targetUnit, state, IncreaseType.INCREASE);
			} else {
				for (i = 0; i < stateId.length; i++) {
					currentState = root.getBaseData().getStateList().getData(stateId[i]);
					StateControl.arrangeState(this._targetUnit, currentState, IncreaseType.INCREASE);
				}
			}
		}
		
		return EnterResult.NOTENTER;
	}
	
	CombinationCollector.Skill._setRallyCombination = function(misc) {
		//HOOOO BOY. You've dug yourself quite a hole with this!
		//Your Rally has so many possibilities. The only saving grace
		//Is knowing you only need to count
		var rangeMetrics, filter;
		var skill = misc.skill;
		
		rangeMetrics = StructureBuilder.buildRangeMetrics();
		
		filter = this._getUnitFilter(misc, skill);
		rangeMetrics.startRange = skill.custom.startRange;
		rangeMetrics.endRange = skill.custom.endRange;
		
		this._setUnitRangeCombination(misc, filter, rangeMetrics);
	}

	CombinationCollector.Skill._getUnitFilter = function(misc, rally) {
		var unit = misc.unit;
		var unitType = unit.getUnitType();
		var rallyFilter;
			
		rallyFilter = rally.custom.unitFilter;
			
		if (rallyFilter == RallyFilterType.PLAYER) {
			return FilterControl.getNormalFilter(unitType);
		} else if (rallyFilter == RallyFilterType.ENEMY) {
			return FilterControl.getReverseFilter(unitType);
		} else {
			return UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY;
		}
	}
	
}) ();