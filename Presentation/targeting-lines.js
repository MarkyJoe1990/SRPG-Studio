/*
	Version 1.0
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
	
	resetEverything: function() {
		this._enemyList = EnemyList.getAliveList();
		this._enemyCount = this._enemyList.getCount();
		this._timePassed = 0;
		this._enemiesInRange = [];
		this._badIndex = [];
		this._mapSim = root.getCurrentSession().createMapSimulator();
	},
	
	setUnit: function(unit) {
		this._unit = unit;
	},
	
	getValidEnemyList: function(list) {
		var funcCondition = function(unit) {
			result = true;
			if (unit.getAliveState() != AliveType.ALIVE) {result = false};
			if (unit.isInvisible()) {result = false};
			var attackRange = UnitRangePanel.getUnitAttackRange(unit)
			if (attackRange.endRange == 0) {result = false};
			
			return result;
		}
		return AllUnitList.getList(list, funcCondition);
	},
	
	moveLineGenerator: function() {
		this._enemiesInRange = [];
		TIME_MODDER = 2
		var index = Math.floor(this._timePassed / TIME_MODDER);
		var timeMod = this._timePassed % TIME_MODDER;
		
		if (index < this._enemyCount && timeMod == 0) {
			currentEnemy = this._enemyList.getData(index);
			attackRange = UnitRangePanel.getUnitAttackRange(currentEnemy);
			
			this._mapSim.startSimulationWeapon(currentEnemy, attackRange.mov, attackRange.startRange, attackRange.endRange);
			this._badIndex[index] = {
				unit: currentEnemy,
				weaponArray: this._mapSim.getSimulationWeaponIndexArray(),
				walkArray: this._mapSim.getSimulationIndexArray()
			};
		}
		
		this._currentUnitIndex = CurrentMap.getIndex(MapCursor.getX(), MapCursor.getY());
		var isSelectable = false;
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
					if (this._currentUnitIndex == this._badIndex[i].weaponArray[x]) {
						found = true;
						this._enemiesInRange.push(this._badIndex[i].unit);
						break;
					}
				}
				if (!found) {
					for (x = 0; x < this._badIndex[i].walkArray.length; x++) {
						if (this._currentUnitIndex == this._badIndex[i].walkArray[x]) {
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
		gManager = root.getGraphicsManager();
		canvas = gManager.getCanvas();
		myX = (CurrentMap.getX(this._currentUnitIndex) * 32) - root.getCurrentSession().getScrollPixelX() + 16;
		myY = (CurrentMap.getY(this._currentUnitIndex) * 32) - root.getCurrentSession().getScrollPixelY() + 16;
		
		color = 0xFF0000;
		
		for (i = 0; i < this._enemiesInRange.length; i++) {
			currentX = (this._enemiesInRange[i].getMapX() * 32) - root.getCurrentSession().getScrollPixelX() + 16;
			currentY = (this._enemiesInRange[i].getMapY() * 32) - root.getCurrentSession().getScrollPixelY() + 16;
			
			figure = canvas.createFigure();
			figure.beginFigure(currentX, currentY);
			
			distance = Math.floor((currentX + myX) / 2);
			
			myFocus = {
				x:distance,
				y:myY - 100
				}
			
			figure.addBezier(currentX, currentY, myFocus.x, myFocus.y, myX, myY);
			figure.addBezier(myX, myY, myFocus.x, myFocus.y, currentX, currentY);
			figure.endFigure()
			
			canvas.setStrokeInfo(color, 128, 3, false);
			canvas.setFillColor(0xFFFFFF, 128);
			canvas.drawFigure(0, 0, figure);
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
		this._lineGenerator.setUnit(this.getTurnTargetUnit);
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
	
}) ();