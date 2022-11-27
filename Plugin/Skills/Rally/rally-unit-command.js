var RallyCommandMode = {
	SELECT: 0,
	SINGLE: 1,
	INFLICT: 2,
	EXP: 3
}

var RallyRangeType = {
	SINGLE: 0,
	MULTI: 1
}

var RallyFilterType = {
	PLAYER: 0,
	ENEMY: 1,
	ALL: 2
}

//Custom Parameters
//canCombo - Allows rallies to stack with rallies of the same affiliation
//rangeType - Do you choose a single target in range, or does it get everyone?
//includeSelf - Can you use it on yourself?
//unitFilter - Specify what affiliations this rally works on
//startRange - Starting range of rally
//endRange - End range of rally

//AI functionality needs to be a thing.

UnitCommand.Rally = defineObject(UnitListCommand, {
	_rallySkills: null,
	_unit: null,
	_stackableRallies: null,
	_unstackableRallies: null,
	_targetUnit: null,
	_chosenFilter: null,
	_windowManager: null,
	_rallySelection: null,
	_rallyQueue: null,
	_exp: 0,
	
	openCommand: function() {
		this._prepareData();
		this._completeData();
	},
	
	_prepareData: function() {
		this._unit = this.getCommandTarget();
		this._targetUnit = null,
		this._windowManager = createObject(RallyWindowManager);
		this._rallySkills = this._getAllRallies();
		this._posSelector = createObject(PosSelector);
		this._rallySelection = [];
		this._rallyQueue = [];
		this._stackableRallies = {
			player: {getName: function() {return "Rally Player";}, array: []},
			enemy: {getName: function() {return "Rally Enemy";}, array: []},
			all: {getName: function() {return "Rally All";}, array: []}
		};
		this._unstackableRallies = [];
	},
	
	_completeData: function() {
		var unit = this.getCommandTarget();
		var filter, indexArray, rally, x, y;
		this._createRallySelection(); //This separates rallies based on stackableness and affiliation
		
		//If all rallies have the same affiliation
		//And are stackable
		//Or you only have one rally
		if (this._allRalliesWorkTogether()) {
			//Automatically choose first rally
			this._rallyQueue = this._rallySkills;
			this._chosenFilter = this._getUnitFilter(this._rallyQueue[0])
			//If they all work together, check
			//If at least one is single target.
			//If so, go into PosSelector mode
			//Otherwise, just run the rallies
			if (this._hasSingleTargetRallies(this._rallyQueue)) {
				
				indexArray = this._compileIndexArrays(this._rallyQueue);//Compile index arrays of all rallies in queue
				//IndexArray.getBestIndexArray(x, y, 1, 2);
				
				if (this._arrayHasIncludeSelf(this._rallyQueue)) {
					var x = unit.getMapX();
					var y = unit.getMapY();
					
					indexArray.push(CurrentMap.getIndex(x, y));
				}
				
				this._posSelector.setPosOnly(unit, null, indexArray, PosMenuType.Default, this._chosenFilter);
				this.changeCycleMode(RallyCommandMode.SINGLE);
			} else {
				this.changeCycleMode(RallyCommandMode.INFLICT)
			}
		} else {//You have at two rallies, and they don't work together, or at least one doesn't combo
			this._windowManager.setUp(this._rallySelection);
			this.changeCycleMode(RallyCommandMode.SELECT); //Choose your rally
		}
	},
	
	moveCommand: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		switch(mode) {
			case RallyCommandMode.SELECT:
				result = this._moveSelect();
				break;
			case RallyCommandMode.SINGLE:
				result = this._moveSingle();
				break;
			case RallyCommandMode.INFLICT:
				result = this._moveInflict();
				break;
			case RallyCommandMode.EXP:
				result = this._moveExp();
				break;
		}
		
		return result;
	},
	
	_moveSelect: function() {
		var result = this._windowManager.moveWindowManager();
		var unit = this.getCommandTarget();
		var i;
		
		if (result == MoveResult.SELECT) {
			var index = this._windowManager._window._rallyScrollbar.getIndex();
			this._rallyQueue = this._peelSelection(this._rallySelection[index]);
			
			this._chosenFilter = this._getUnitFilter(this._rallyQueue[0]);
			
			if (this._hasSingleTargetRallies(this._rallyQueue)) {
				indexArray = this._compileIndexArrays(this._rallyQueue);
				
				if (this._arrayHasIncludeSelf(this._rallyQueue)) {
					var x = unit.getMapX();
					var y = unit.getMapY();
					indexArray.push(CurrentMap.getIndex(x, y));
				}
				this._posSelector.setPosOnly(unit, null, indexArray, PosMenuType.Default, this._chosenFilter);
				this.changeCycleMode(RallyCommandMode.SINGLE);
			} else {
				this.changeCycleMode(RallyCommandMode.INFLICT);
			}
			
		} else if (result == MoveResult.CANCEL) {
			return MoveResult.CANCEL;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveSingle: function() {
		result = this._posSelector.movePosSelector();
		this._targetUnit = this._getSelectorTarget();
		
		if (result == PosSelectorResult.SELECT && this._targetUnit != null) {
			if (this._isFilterMatch(this._targetUnit.getUnitType(),this._chosenFilter)) {
				this._posSelector.endPosSelector();
				this.changeCycleMode(RallyCommandMode.INFLICT);
			}
		} else if (result == PosSelectorResult.CANCEL) {
			this._posSelector.endPosSelector();
			//Change cycle mode to whatever the previous one was
			return MoveResult.CANCEL;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveInflict: function() {
		this.endCommandAction();
		var affiliatedRallies, i, x, count, currentRally, currentState;
		
		this._enactRallyQueue(this._rallyQueue);
		this.changeCycleMode(RallyCommandMode.EXP);
		
		return MoveResult.CONTINUE;
	},
	
	_compileIndexArrays: function(rallyArray) {
		var i, x, y, count, currentRally;
		var indexArray = [];
		var unitX = this._unit.getMapX();
		var unitY = this._unit.getMapY();
		var startRange, endRange;
		
		count = rallyArray.length;
		for (i = 0; i < count; i++) {
			currentRally = rallyArray[i];
			startRange = currentRally.custom.startRange;
			endRange = currentRally.custom.endRange;
			
			currentIndexArray = IndexArray.getBestIndexArray(unitX, unitY, startRange, endRange);
			
			for (x = 0; x < currentIndexArray.length; x++) {
				isMatch = false;
				for (y = 0; y < indexArray.length; y++) {
					if (currentIndexArray[x] == indexArray[y]) {
						isMatch = true;
						break;
					}
				}
				if (!isMatch) {
					indexArray.push(currentIndexArray[x]);
				}
			}
		}
		
		return indexArray;
	},
	
	_getSelectorTarget: function() {
		var child;
		var unit = this._posSelector._posCursor.getUnitFromCursor();
		
		if (this._posSelector._unit === unit) {
			if (this._posSelector._isFusionIncluded) {
				child = FusionControl.getFusionChild(unit);
				if (child !== null) {
					return child;
				}
				else {
					return unit;
				}
			}
			else {
				// Myself cannot be selected.
				return unit;
			}
		}
		
		// Check if the unit exists at the cursor position and the unit exists within a range.
		if (unit !== null) {
			// If it doesn't exist within a range, return null.
			if (!IndexArray.findUnit(this._posSelector._indexArray, unit)) {
				unit = null;
			}
		}
		
		return unit;
	},
	
	_getAllRallies: function() {
		var rallyArray = SkillControl.getDirectSkillArray(this._unit, SkillType.CUSTOM, "Rally")
		var newArray = [];
		var i, currentRally;
		
		for (i = 0; i < rallyArray.length;i ++) {
			currentRally = rallyArray[i].skill;
			newArray.push(currentRally);
		}
		
		return newArray;
	},
	
	_enactRallyQueue: function() {
		var i, currentRally, exp;
		var exp = 0;
		var division = this._rallyQueue.length;
		
		for (i = 0; i < this._rallyQueue.length; i++) {
			currentRally = this._rallyQueue[i];
			currentExp = currentRally.custom.exp;
			
			if (currentExp != undefined) {
				exp += currentRally.custom.exp;
			}
			
			this._enactRallyAction(currentRally);
		}
		this._exp = Math.floor(exp / division);
	},
	
	_enactRallyAction: function(rally) {
		var currentRally = rally;
		var stateId = currentRally.custom.stateId;
		var currentState;
		var unitX = this._unit.getMapX();
		var unitY = this._unit.getMapY();
		var startRange = currentRally.custom.startRange;
		var endRange = currentRally.custom.endRange;
		var x, i;
		var currentFilter = this._getUnitFilter(currentRally);
		
		currentIndexArray = IndexArray.getBestIndexArray(unitX, unitY, startRange, endRange);
		//Check if unit is in range for single target
		
		if (currentRally.custom.rangeType == RallyRangeType.SINGLE) {
			for (x = 0; x < currentIndexArray.length; x++) {
				var currentIndex = currentIndexArray[x];
				var currentX = CurrentMap.getX(currentIndex);
				var currentY = CurrentMap.getY(currentIndex);
				
				var possibleUnit = PosChecker.getUnitFromPos(currentX, currentY);
				
				if (possibleUnit == this._targetUnit && this._isFilterMatch(possibleUnit.getUnitType(), currentFilter)) {
					if (typeof stateId == "number") {
						currentState = root.getBaseData().getStateList().getDataFromId(stateId);
						StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
					} else {
						for (i = 0; i < stateId.length; i++) {
							currentState = root.getBaseData().getStateList().getDataFromId(stateId[i]);
							StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
						}
					}
					break;
				}
			}
		} else {
			//Inflict everyone in range if they match affiliation
			for (x = 0; x < currentIndexArray.length; x++) {
				var currentIndex = currentIndexArray[x];
				var currentX = CurrentMap.getX(currentIndex);
				var currentY = CurrentMap.getY(currentIndex);
				
				var possibleUnit = PosChecker.getUnitFromPos(currentX, currentY);
				
				if (possibleUnit != null && this._isFilterMatch(possibleUnit.getUnitType(), currentFilter)) {
					if (typeof stateId == "number") {
						currentState = root.getBaseData().getStateList().getDataFromId(stateId);
						StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
					} else {
						for (i = 0; i < stateId.length; i++) {
							currentState = root.getBaseData().getStateList().getDataFromId(stateId[i]);
							StateControl.arrangeState(possibleUnit, currentState, IncreaseType.INCREASE);
						}
					}
				}
			}
		}
	},
	
	_moveExp: function() {
		var generator = root.getEventGenerator();
		generator.experiencePlus(this._unit, this._exp, false);
		generator.execute();
		
		return MoveResult.END;
	},
	
	drawCommand: function() {
		var mode = this.getCycleMode();
		
		switch(mode) {
			case RallyCommandMode.SELECT:
				result = this._drawSelect();
				break;
			case RallyCommandMode.SINGLE:
				result = this._drawSingle();
				break;
			case RallyCommandMode.INFLICT:
				result = this._drawInflict();
				break;
			case RallyCommandMode.EXP:
				result = this._drawExp();
				break;
		}
	},
	
	_drawSelect: function() {
		this._windowManager.drawWindowManager();
	},
	
	_drawSingle: function() {
		this._posSelector.drawPosSelector();
	},
	
	_drawInflict: function() {
	},
	
	_drawExp: function() {
	},
	
	_peelSelection: function(comboRally) {
		
		if (this._isComboRally(comboRally)) {
			return comboRally.array;
		} else {
			doop = []
			doop.push(comboRally);
			return doop;
		}
	},
	
	_isComboRally: function(rallyArray) {
		var name = rallyArray.getName();
		return name == "Rally Player" || name == "Rally Enemy" || name == "Rally All";
	},
	
	_allRalliesWorkTogether: function() {
		//First. Check if you only have one rally.
		var i, count, currentRally;
		count = this._rallySkills.length;
		
		//If there's only one rally, don't bother. Return true.
		if (count <= 1) {
			return true;
		} else {
			//If at least one mismatches... Return false
			//Also check if they can combo
			firstRally = this._rallySkills[0];
			if (firstRally.custom.canCombo == false) {
				//First one can't combo. Automatic false;
				return false;
			}
			
			for (i = 1; i < count; i++) {
				currentRally = this._rallySkills[i];
				
				//If any of the rallies cannot stack, return false
				if (currentRally.custom.canCombo == false) {
					return false;
				}
				
				//If their affiliations don't match, return false
				if (firstRally.custom.unitFilter != currentRally.custom.unitFilter) {
					return false;
				}
			}
			
			//All of them stack, and have the same affiliation. Return true
			return true;
		}
	},
	
	//Combines rallies that are both stackable
	//and use the same unit affiliation
	//creates a separate list for unstackables
	_createRallySelection: function() {
		//First, check for all the unstackable
		//rallies
		var i;
		
		for (i = 0; i < this._rallySkills.length;i++) {
			var currentRally = this._rallySkills[i];
			if (!this._hasTargetInRange(currentRally)) {
				continue;
			}
			if (currentRally.custom.canCombo == false) {
				this._unstackableRallies.push(currentRally);
			} else {
				//Check rally's affiliation
				this._pushRallyAffiliation(currentRally);
			}
		}
		
		for (i = 0; i < this._rallySkills.length;i++) {
			var currentRally = this._rallySkills[i];
			if (!this._hasTargetInRange(currentRally)) {
				continue;
			}
			if (currentRally.custom.forceCombo == true) {
				this._forcePushRallyAffiliation(currentRally);
			}
		}
		
		if (this._stackableRallies.player.array.length > 0) {
			this._rallySelection.push(this._stackableRallies.player);
		}
		if (this._stackableRallies.enemy.array.length > 0) {
			this._rallySelection.push(this._stackableRallies.enemy);
		}
		if (this._stackableRallies.all.array.length > 0) {
			this._rallySelection.push(this._stackableRallies.all);
		}
		
		for (i = 0; i < this._unstackableRallies.length; i++) {
			this._rallySelection.push(this._unstackableRallies[i]);
		}
	},
	
	_pushRallyAffiliation: function(rally) {
		if (rally.custom.unitFilter == RallyFilterType.PLAYER) {
			this._stackableRallies.player.array.push(rally);
		} else if (rally.custom.unitFilter == RallyFilterType.ENEMY) {
			this._stackableRallies.enemy.array.push(rally);
		} else {
			this._stackableRallies.all.array.push(rally);
		}
	},
	
	_forcePushRallyAffiliation: function(rally) {
		if (this._stackableRallies.player.array.length > 0) {
			this._stackableRallies.player.array.push(rally);
		}
		if (this._stackableRallies.enemy.array.length > 0) {
			this._stackableRallies.enemy.array.push(rally);
		}
		if (this._stackableRallies.all.array.length > 0) {
			this._stackableRallies.all.array.push(rally);
		}
	},
	
	_hasSingleTargetRallies: function(rallyArray) {
		var i, currentRally;
		var count = rallyArray.length;
		
		for (i = 0; i < count; i++) {
			currentRally = rallyArray[i];
			
			if (this._isSingleTarget(currentRally)) {
				return true;
			}
		}
		
		return false;
	},
	
	_isSingleTarget: function(skill) {
		return skill.custom.rangeType == RallyRangeType.SINGLE;
	},
	
	_arrayHasIncludeSelf: function(rallyArray) {
		var i;
		
		for (i = 0; i < rallyArray.length; i++) {
			currentRally = rallyArray[i];
			if (currentRally.custom.includeSelf == true) {
				return true;
			}
		}
		
		return false;
	},
	
	isCommandDisplayable: function() {
		var unit = this.getCommandTarget();
		var rallySkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "Rally");
		var i, count, currentRally;
		count = rallySkills.length
		
		for (i = 0; i < count; i++) {
			currentRally = rallySkills[i].skill;
			if (this._hasTargetInRange(currentRally)) {
				return true;
			}
		}
		
		return false;
	},
	
	_hasTargetInRange: function(rally) {
		
		//If rally targets self... Return true by default
		if (rally.custom.includeSelf == true) {
			return true;
		}
		
		var i;
		var unitFilter = this._getUnitFilter(rally);
		var unit = this.getCommandTarget();
		var unitType = unit.getUnitType();
		var x = unit.getMapX();
		var y = unit.getMapY();
		var startRange = rally.custom.startRange;
		var endRange = rally.custom.endRange;
		var indexArray = IndexArray.getBestIndexArray(x, y, startRange, endRange);
		var count = indexArray.length;
		
		for (i = 0; i < count; i++) {
			currentIndex = indexArray[i];
			var mapX = CurrentMap.getX(currentIndex);
			var mapY = CurrentMap.getY(currentIndex);
			targetUnit = PosChecker.getUnitFromPos(mapX, mapY);
			if (targetUnit != null) {
				var targetUnitType = targetUnit.getUnitType();
				//Check if unit matches target affiliation
				if (this._isFilterMatch(targetUnitType, unitFilter)) {
					return true;
				}
			}
		}
		return false;
	},
	
	_isFilterMatch: function(targetUnitType, filterFlag) {
		if ((filterFlag & UnitFilterFlag.PLAYER) && (targetUnitType === UnitType.PLAYER)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ALLY) && (targetUnitType === UnitType.ALLY)) {
			return true;
		}
		
		if ((filterFlag & UnitFilterFlag.ENEMY) && (targetUnitType === UnitType.ENEMY)) {
			return true;
		}
		
		return false;
	},
	
	_getUnitFilter: function(rally) {
		var unitType = this.getCommandTarget().getUnitType();
		var rallyFilter;
		
		rallyFilter = rally.custom.unitFilter;
		
		if (rallyFilter == RallyFilterType.PLAYER) {
			return FilterControl.getNormalFilter(unitType);
		} else if (rallyFilter == RallyFilterType.ENEMY) {
			return FilterControl.getReverseFilter(unitType);
		} else {
			return UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY;
		}
	},
	
	//GOOD
	getCommandName: function() {
		return RALLY_COMMAND_NAME;
	}
});

(function(){
	var alias1 = UnitCommand.configureCommands;
	UnitCommand.configureCommands = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(UnitCommand.Rally);
	}
}) ();