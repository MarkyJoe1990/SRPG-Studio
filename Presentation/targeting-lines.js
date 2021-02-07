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
	},
	
	resetEverything: function() {
		this._enemyList = root.getCurrentSession().getEnemyList();
		this._enemyCount = this._enemyList.getCount();
		this._timePassed = 0;
		this._enemiesInRange = [];
		this._badIndex = [];
		this._mapSim = root.getCurrentSession().createMapSimulator();
	},
	
	setUnit: function(unit) {
		this._unit = unit;
	},
	
	isValidEnemy: function(unit, attackRange) {
		if (unit.getAliveState() != AliveType.ALIVE) {return false;};
		if (unit.isInvisible()) {return false};
		if (attackRange.endRange == 0) {return false};
		
		if (unit == null) {return false;}
		
		var aiPattern = unit.createAIPattern();
		
		if (aiPattern == null) {
			return false;
		}
		
		if (aiPattern.getPatternType() == PatternType.MOVE && aiPattern.getMovePatternInfo().getMoveAIType() == MoveAIType.MOVEONLY) {return false};
		if (aiPattern.getPatternType() == PatternType.WAIT && aiPattern.getWaitPatternInfo().isWaitOnly()) {return false};
		
		return true;
	},
	
	moveLineGenerator: function() {
		this._enemiesInRange = [];
		TIME_MODDER = 2;
		var index = Math.floor(this._timePassed / TIME_MODDER);
		var timeMod = this._timePassed % TIME_MODDER;
		
		if (index < this._enemyCount && timeMod == 0) {
			currentEnemy = this._enemyList.getData(index);
			attackRange = UnitRangePanel.getUnitAttackRange(currentEnemy);
			
			this._badIndex[index] = {
				unit: currentEnemy
			};
			
			if (this.isValidEnemy(currentEnemy, attackRange)) {
				this._mapSim.startSimulationWeapon(currentEnemy, attackRange.mov, attackRange.startRange, attackRange.endRange);
				this._badIndex[index].weaponArray = this._mapSim.getSimulationWeaponIndexArray();
				this._badIndex[index].walkArray = this._mapSim.getSimulationIndexArray();
			} else {
				this._badIndex[index].weaponArray = [];
				this._badIndex[index].walkArray = [];
			}
		}
		
		this._currentUnitIndex = {
			x: MapCursor.getX(),
			y: MapCursor.getY()
		}
		this._currentUnitIndex.index = CurrentMap.getIndex(this._currentUnitIndex.x, this._currentUnitIndex.y)
		
		var isSelectable;
		if (this.getParentInstance()._mapSequenceArea._mapCursor != null) {
			isSelectable = this.getParentInstance()._mapSequenceArea._isPlaceSelectable();
		} else {
			isSelectable = false;
		}
		
		found = false;
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
	
	drawLineGenerator: function() {
		myX = (this._currentUnitIndex.x * 32) - root.getCurrentSession().getScrollPixelX() + 16;
		myY = (this._currentUnitIndex.y * 32) - root.getCurrentSession().getScrollPixelY() + 16;
		
		color = 0xFF0000;
		
		for (i = 0; i < this._enemiesInRange.length; i++) {
			var currentUnit = this._enemiesInRange[i];
			
			if (currentUnit.getAliveState() != AliveType.ALIVE) {
				continue;
			}
			
			currentX = (currentUnit.getMapX() * 32) - root.getCurrentSession().getScrollPixelX() + 16;
			currentY = (currentUnit.getMapY() * 32) - root.getCurrentSession().getScrollPixelY() + 16;
			
			figure = this._canvas.createFigure();
			figure.beginFigure(currentX, currentY);
			
			distance = Math.floor((currentX + myX) / 2);
			
			myFocus = {
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
		result = alias4.call(this);
		this._lineGenerator.setUnit(this.getTurnTargetUnit());
		return result;
	}
	
	var alias5 = PlayerTurn._doEventEndAction;
	PlayerTurn._doEventEndAction = function() {
		alias5.call(this);
		if (!InputControl.isCancelAction()) {
			this._lineGenerator.resetEverything();
		}
	}
	
	var alias6 = PlayerTurn._prepareTurnMemberData;
	PlayerTurn._prepareTurnMemberData = function() {
		alias6.call(this);
		this._lineGenerator = createObjectEx(LineGenerator, this);
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