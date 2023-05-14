/*
	Version 1.1
	Made by MarkyJoe1990
	
	This implements enemy targeting lines similar to Fire Emblem: Three Houses.
	Compared to the Japanese script, this version has significantly higher
	performance, but no further bells and whistles.
	
	The biggest reason for the improved performance is how the enemy attack
	ranges are retrieved. For every second frame, a single enemy from the
	enemy list is retrieved, and their attack ranges are appended to an array.
	Once all enemies have been checked, the game stops loading new ones.
	
	In order to keep the attack arrays up to date, it resets at the start of
	every player phase, and whenever the player commits to a move with one of
	their units. This creates targeting lines that are both accurate and non-laggy.
*/
GlobalLineGenerator = null;
LINE_DEBUG_ENABLED = false; //Set to true to enable debug mode

var LineGenerator = defineObject(BaseObject, {
	_enemyList: null,
	_enemyCount: 0,
	_enemiesInRange: [],
	_timePassed: 0,
	_badIndex: null,
	_mapSim: null,
	_graphicsManager: null,
	_canvas: null,
	_currentUnitIndex: null,
	
	initialize: function() {
		this._graphicsManager = root.getGraphicsManager();
		this._canvas = this._graphicsManager.getCanvas();
		this._badIndex = [];
		
		this._enemyList = root.getCurrentSession().getEnemyList();
		this._enemiesInRange = [];
		this._mapSim = root.getCurrentSession().createMapSimulator();
	},
	
	resetTimer: function() {
		this._enemyCount = this._enemyList.getCount();
		this._timePassed = 0;
	},
	
	setUnit: function(unit) {
		this._unit = unit;
	},
	
	moveLineGenerator: function() {
		this._enemiesInRange = [];
		var TIME_MODDER = 2;
		var index = Math.floor(this._timePassed / TIME_MODDER);
		var timeMod = this._timePassed % TIME_MODDER;
		
		if (index < this._enemyCount && timeMod == 0) {
			var currentEnemy = this._enemyList.getData(index);
			var attackRange = UnitRangePanel.getUnitAttackRange(currentEnemy);
			
			if (this._badIndex[index] == undefined) {
				this._badIndex[index] = {
					unit: currentEnemy,
					walkArray: [],
					weaponArray: [],
					stepArray: []
				};
			}
			
			var isSkippable = true;
			var reason = "";

			if (this._badIndex[index].walkArray == undefined) {
				reason = "BadIndex Undefined.";
				isSkippable = false;
			}
			
			if (isSkippable && this._currentPositionChanged(this._badIndex[index])) {
				reason = "Pos Change.";
				isSkippable = false;
			}
			
			if (isSkippable && this._terrainIsDifferent(this._badIndex[index])) {
				reason = "Terrain Change.";
				isSkippable = false;
			}
			
			if (isSkippable && this._unitsInRangeChange(this._badIndex[index])) {
				reason = "InRange Target Change.";
				isSkippable = false;
			}
			
			if (!this._isValidEnemy(currentEnemy, attackRange)) {
				reason = "Invalid Unit.";
				isSkippable = true;
			}
			
			if (!isSkippable) {
				this._mapSim.startSimulationWeapon(currentEnemy, attackRange.mov, attackRange.startRange, attackRange.endRange);
				this._badIndex[index].walkArray = this._mapSim.getSimulationIndexArray();
				this._addToStepArray(this._badIndex[index].stepArray, this._badIndex[index].walkArray)
				
				var weapon = ItemControl.getEquippedWeapon(currentEnemy);
				if (typeof SplashControl != "undefined" && weapon && SplashControl.hasSplashTiles(weapon)) {
					this._badIndex[index].weaponArray = this._getSplashArray(this._badIndex[index].walkArray, weapon);
					//SplashControl.createSplashRangeIndexArray();
				} else {
					this._badIndex[index].weaponArray = this._mapSim.getSimulationWeaponIndexArray();
				}
				
				this._addToStepArray(this._badIndex[index].stepArray, this._badIndex[index].weaponArray);
				
				//Grab unit's coordinates for later.
				this._badIndex[index].x = currentEnemy.getMapX();
				this._badIndex[index].y = currentEnemy.getMapY();
				
				//grab all movement consumption. Correspond them to the walkArray
				var i, count = this._badIndex[index].walkArray.length;
				this._badIndex[index].movePointArray = [];
				for (i = 0; i < count; i++) {
					var currentIndex = this._badIndex[index].walkArray[i];
					var currentX = CurrentMap.getX(currentIndex);
					var currentY = CurrentMap.getY(currentIndex);
					
					this._badIndex[index].movePointArray[i] = PosChecker.getMovePointFromUnit(currentX, currentY, currentEnemy)
				}
				
				//Count all current targets in range
				this._badIndex[index].targetCount = this._countTargetsInRange(this._badIndex[index]);
				//root.log(index + ": " + reason + " Updating.");
			} else {
				//root.log(index + ": " + reason + " Skipping.");
			}
		}
		
		this._currentUnitIndex = {
			x: MapCursor.getX(),
			y: MapCursor.getY()
		}
		
		this._currentUnitIndex.index = CurrentMap.getIndex(this._currentUnitIndex.x, this._currentUnitIndex.y)
		
		var isSelectable;
		var playerTurn = this.getParentInstance();
		if (playerTurn.getCycleMode() == PlayerTurnMode.AREA || playerTurn.getCycleMode() == PlayerTurnMode.UNITCOMMAND) {
			isSelectable = this.getParentInstance()._mapSequenceArea._isPlaceSelectable();
		} else {
			isSelectable = false;
		}
		
		var found;
		if (isSelectable) {
			for (i = 0; i < this._badIndex.length; i++) {
				
				found = false;
				for (x = 0; x < this._badIndex[i].weaponArray.length; x++) {
					if (this._currentUnitIndex.index == this._badIndex[i].weaponArray[x]) {
						found = true;
						this._enemiesInRange.push(this._badIndex[i].unit);
						break;
					}
				}
				if (!found) {
					for (x = 0; x < this._badIndex[i].walkArray.length; x++) {
						if (this._currentUnitIndex.index == this._badIndex[i].walkArray[x]) {
							this._enemiesInRange.push(this._badIndex[i].unit);
							break;
						}
					}
				}
			}
		}
		this._timePassed++;
	},
	
	_addToStepArray: function(stepArray, indexArray) {
		var i, count = indexArray.length;
		
		for (i = 0; i < count; i++) {
			stepArray[indexArray[i]] = true;
		}
	},
	
	_getSplashArray: function(moveIndex, weapon) {
		var filteredMoveIndex = this._filterMoveIndex(moveIndex);
		
		var indexArray = [];
		var prevAllowedArray = [];
		var disallowedArray = SplashControl.createDisallowedArray(moveIndex);
			
		var allowedTiles = SplashControl.getAllowedTiles(weapon);
		
		if (!allowedTiles) {
			allowedTiles = SplashControl.generateAllowedTilesFromRange(weapon);
		}
		
		var splashTiles = SplashControl.getSplashTiles(weapon);
		var flipType = SplashControl.getFlipType(weapon);
		
		var i, count = filteredMoveIndex.length;
		for (i = 0; i < count; i++) {
			var x = CurrentMap.getX(filteredMoveIndex[i]);
			var y = CurrentMap.getY(filteredMoveIndex[i]);
			
			indexArray = SplashControl.createSplashRangeIndexArray(x, y, allowedTiles, splashTiles, flipType, indexArray, prevAllowedArray, disallowedArray);
		}
		
		return indexArray;
	},
	
	_filterMoveIndex: function(indexArray) {
		//Grab indexArray. Check if any tiles adjacent 
		var newMoveIndex = [];
		var yFactor = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
		var relativeIndex = [-1, 1, yFactor, yFactor * -1];
		var relCount = relativeIndex.length;
		var i, count = indexArray.length;
		
		
		for (i = 0; i < count; i++) {
			var currentIndex = indexArray[i]
			
			for (j = 0; j < relCount; j++) {
				var relIndex = currentIndex + relativeIndex[j];
				
				this.nonRedundantAdd(currentIndex, newMoveIndex)
			}
		}
		
		return newMoveIndex;
	},
	
	nonRedundantAdd: function(element, array) {
		var low, mid, high;
		for (low = 0, high = array.length; low < high;) {
			mid = low + high >>> 1
			if (array[mid] < element) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}
		
		if (element != array[low]) {
			array.splice(low, 0, element)
		}
	},
	
	drawLineGenerator: function() {
		var myX = LayoutControl.getPixelX(this._currentUnitIndex.x) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
		var myY = LayoutControl.getPixelY(this._currentUnitIndex.y) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
		
		for (i = 0; i < this._enemiesInRange.length; i++) {
			var currentUnit = this._enemiesInRange[i];

			var color = 0xFF0000;

			var weapon = ItemControl.getEquippedWeapon(currentUnit);
			if (weapon != null) {
				var targetingLineColor = weapon.custom.targetingLineColor;
				if (targetingLineColor != undefined) {
					color = targetingLineColor;
				}
			}
			
			if (currentUnit.getAliveState() != AliveType.ALIVE) {
				continue;
			}
			
			var currentX = LayoutControl.getPixelX(currentUnit.getMapX()) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
			var currentY = LayoutControl.getPixelY(currentUnit.getMapY()) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
			
			var figure = this._canvas.createFigure();
			figure.beginFigure(currentX, currentY);
			
			var distance = Math.floor((currentX + myX) / 2);
			
			var myFocus = {
				x:distance,
				y:myY - 100
				}
			
			figure.addBezier(currentX, currentY, myFocus.x, myFocus.y, myX, myY);
			figure.addBezier(myX, myY, myFocus.x, myFocus.y, currentX, currentY);
			figure.endFigure()
			
			this._canvas.setStrokeInfo(color, 128, 3, false);
			this._canvas.setFillColor(0xFFFFFF, 128);
			this._canvas.drawFigure(0, 0, figure);
		}
	},
	
	drawDebug: function() {
		var textX = 0;
		var textY = 0;
		var font = root.queryTextUI("default_window").getFont();
		var color = 0xFFFFFF;
		
		TextRenderer.drawText(textX,textY,"FPS: " + root.getFPS(), -1, color, font)
		textY += 16;
		if (this._badIndex != null) {
			TextRenderer.drawText(textX,textY,"Enemy Count: " + this._badIndex.length, -1, color, font)
			textY += 16;
		}
		if (this._unit != null) {
			TextRenderer.drawText(textX,textY,"Current Unit: " + this._unit.getName(), -1, color, font)
			textY += 16;
		}
		TextRenderer.drawText(textX,textY,"Current X, Y: " + MapCursor.getX() + ", " + MapCursor.getY(), -1, color, font)
		textY += 16;
		TextRenderer.drawText(textX,textY,"Enemies in range: " + this._enemiesInRange.length, -1, color, font)
		textY += 16;
	},
	
	_isValidEnemy: function(unit, attackRange) {
		if (unit == null ||
			unit.getAliveState() != AliveType.ALIVE ||
			attackRange.endRange == 0 ||
			unit.isActionStop() ||
			unit.isWait() ||
			unit.isInvisible() ||
			StateControl.isBadStateOption(unit, BadStateOption.NOACTION)
		) {
			return false
		};
		
		var aiPattern = unit.createAIPattern();
		
		if (aiPattern == null) {
			return false;
		}
		
		if (aiPattern.getPatternType() == PatternType.MOVE && aiPattern.getMovePatternInfo().getMoveAIType() == MoveAIType.MOVEONLY) {return false};
		if (aiPattern.getPatternType() == PatternType.WAIT && aiPattern.getWaitPatternInfo().isWaitOnly()) {return false};
		
		//Check to see if there 
		
		return true;
	},
	
	_currentPositionChanged: function(badIndex) {
		var unit = badIndex.unit;
		var x = unit.getMapX();
		var y = unit.getMapY();
		
		var oldX = badIndex.x;
		var oldY = badIndex.y;
		
		if (x != oldX) {
			return true;
		}
		
		if (y != oldY) {
			return true;
		}
		
		return false;
	},
	
	_terrainIsDifferent: function(badIndex) {
		var walkArray = badIndex.walkArray;
		var movePointArray = badIndex.movePointArray;
		var i, count = walkArray.length;
		var unit = badIndex.unit;
		var unitType = unit.getUnitType();
		
		for (i = 0; i < count; i++) {
			var currentWalkIndex = walkArray[i];
			var oldMovePoint = movePointArray[i]
			
			var x = CurrentMap.getX(currentWalkIndex);
			var y = CurrentMap.getY(currentWalkIndex);
			
			var movePoint = PosChecker.getMovePointFromUnit(x, y, unit);
			
			if (movePoint != oldMovePoint) {
				return true;
			}
			
			var targetUnit = PosChecker.getUnitFromPos(x, y);

			if (targetUnit != null) {
				var targetUnitType = targetUnit.getUnitType();
				
				if (targetUnitType != unitType && targetUnit != unit) {
					return true;
				}
			}
		}
		
		return false;
	},
	
	_unitsInRangeChange: function(badIndex) {
		//You previously counted the number of units in the weaponIndex range.
		//Count them again in case there's a change.
		
		var weaponArray = badIndex.weaponArray;
		var i, count = weaponArray.length;
		var prevCount = badIndex.targetCount;
		
		if (this._countTargetsInRange(badIndex) != prevCount) {
			return true;
		}
		
		return false;
	},
	
	_countTargetsInRange: function(badIndex) {
		var unit = badIndex.unit;
		var unitType = unit.getUnitType();
		
		var weaponArray = badIndex.weaponArray;
		var i, count = weaponArray.length;
		var targetCount = 0;
		
		for (i = 0; i < count; i++) {
			var currentWeaponIndex = weaponArray[i];
			
			var x = CurrentMap.getX(currentWeaponIndex);
			var y = CurrentMap.getY(currentWeaponIndex);
			
			var targetUnit = PosChecker.getUnitFromPos(x, y);
			
			if (targetUnit != null) {
				//If they are the same unit, don't worry.
				//If they are an ally, don't worry.
				var targetUnitType = targetUnit.getUnitType();
				
				if (targetUnitType != unitType && targetUnit != unit) {
					targetCount++;
				}
			}
		}
		
		return targetCount;
	},
	
	_combineArrays: function(srcArray, destArray) {
		var i, count = srcArray.length;
		
		for (i = 0; i < count; i++) {
			var currentIndex = srcArray[i];
			this._sortedAdd(currentIndex, destArray);
		}
	},
	
	_sortedAdd: function(element, array) {
		var low, mid, high;
		for (low = 0, high = array.length; low < high;) {
			mid = low + high >>> 1
			if (array[mid] < element) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}
		
		if (element != array[low]) {
			array.splice(low, 0, element)
		}
	}
	
});


(function () {
	var alias1 = PlayerTurn.moveTurnCycle;
	PlayerTurn.moveTurnCycle = function() {
		var result = alias1.call(this);
		this._lineGenerator.moveLineGenerator();
		return result;
	}
	
	var alias2 = PlayerTurn.drawTurnCycle;
	PlayerTurn.drawTurnCycle = function() {
		var result = alias2.call(this);
		if (LINE_DEBUG_ENABLED) {
			this._lineGenerator.drawDebug();
		}
		return result;
	}
	
	var alias3 = PlayerTurn._drawArea;
	PlayerTurn._drawArea = function() {
		alias3.call(this);
		if (this._mapSequenceArea.getCycleMode() == MapSequenceAreaMode.AREA && this._targetUnit.getUnitType() == UnitType.PLAYER) {
			this._lineGenerator.drawLineGenerator();
		}
	}
	
	var alias4 = PlayerTurn._moveArea;
	PlayerTurn._moveArea = function() {
		var result = alias4.call(this);
		this._lineGenerator.setUnit(this.getTurnTargetUnit());
		return result;
	}
	
	var alias5 = PlayerTurn._doEventEndAction;
	PlayerTurn._doEventEndAction = function() {
		alias5.call(this);
		if (!InputControl.isCancelAction()) {
			this._lineGenerator.resetTimer();
		}
	}
	
	var alias6 = PlayerTurn._prepareTurnMemberData;
	PlayerTurn._prepareTurnMemberData = function() {
		alias6.call(this);
		this._lineGenerator = createObjectEx(LineGenerator, this);
		GlobalLineGenerator = this._lineGenerator;
	}
	
	var alias7 = RepeatMoveFlowEntry.enterFlowEntry;
	RepeatMoveFlowEntry.enterFlowEntry = function(playerTurn) {
		var result = alias7.call(this, playerTurn);
		
		return result;
	};
	
	var alias8 = RepeatMoveFlowEntry.moveFlowEntry;
	RepeatMoveFlowEntry.moveFlowEntry = function() {
		var result = alias8.call(this);
		
		this._playerTurn._lineGenerator.moveLineGenerator();
		
		return result;
	};
	
	var alias9 = RepeatMoveFlowEntry.drawFlowEntry;
	RepeatMoveFlowEntry.drawFlowEntry = function() {
		
		if (this._mapSequenceArea.getCycleMode() == MapSequenceAreaMode.AREA) {
			this._playerTurn._lineGenerator.drawLineGenerator();
		}
		
		alias9.call(this);
	}
	
}) ();