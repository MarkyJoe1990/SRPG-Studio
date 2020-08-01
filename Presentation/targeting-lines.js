/*
	Version 1.0
	Made by MarkyJoe1990
	
	This implements enemy targeting lines similar to Fire Emblem: Three Houses.
	Compared to the Japanese script, this version has significantly higher
	performance, but no further bells and whistles.
	
	The biggest reason for the improved performance is that the attack index
	of all enemies is only received at the start of enemy phase.
	
	There is one caveat however. Any map chip changes done mid-turn, such as
	villages, will not be factored into the targeting line criteria until
	the start of next player phase. However, you can mitigate this by adding
	a script execute event command with the following code:
	
	LineGenerator.forceUpdateEnemyAttackers(EnemyList.getAliveList());
	
	Make sure you place it AFTER the map changes or it won't work.
*/

LINE_DEBUG_ENABLED = false;

var LineGenerator = defineObject(BaseObject, {
	_enemyList: null,
	_enemyCount: 0,
	_enemiesInRange: [],
	_timePassed: 0,
	_badIndex: null,
	
	resetEverything: function() {
		this._enemyList = EnemyList.getAliveList()//this.getValidEnemyList(root.getCurrentSession().getEnemyList())
		this._enemyCount = this._enemyList.getCount();
		this._timePassed = 0;
		this._enemiesInRange = [];
		this._badIndex = [];
		this._mapSim = root.getCurrentSession().createMapSimulator();
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
		
		//Every frame until you reach the end of the enemy list, add a new attack index array
		if (index < this._enemyCount && timeMod == 0) {
			//Grab an enemy from the enemy list
			//Then push them to the bad Index
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
			//FIGURE
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
			
			//END FIGURE
			//canvas.drawLine(currentX, currentY, myX, myY, 3);
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
		if (this.getParentInstance()._targetUnit != null) {
			TextRenderer.drawText(textX,textY,"Current Unit: " + this.getParentInstance()._targetUnit.getName(), -1, color, font)
			textY += 16;
		}
		TextRenderer.drawText(textX,textY,"Current X, Y: " + MapCursor.getX() + ", " + MapCursor.getY(), -1, color, font)
		textY += 16;
		TextRenderer.drawText(textX,textY,"Enemies in range: " + this._enemiesInRange.length, -1, color, font)
		textY += 16;
	}
	
});


(function () {
	
	//var alias1 = PlayerTurn._prepareSequenceMemberData;
	//PlayerTurn._prepareSequenceMemberData = function (parentTurnObject) {
	//	alias1.call(this, parentTurnObject);
	//}
	
	var alias2 = PlayerTurn.moveTurnCycle;
	PlayerTurn.moveTurnCycle = function() {
		var result = alias2.call(this);
		this._lineGenerator.moveLineGenerator();
		return result;
	}
	
	var alias7 = PlayerTurn.drawTurnCycle;
	PlayerTurn.drawTurnCycle = function() {
		var result = alias7.call(this);
		if (LINE_DEBUG_ENABLED) {
			this._lineGenerator.drawDebug();
		}
		return result;
	}
	
	var alias3 = PlayerTurn._drawArea;
	PlayerTurn._drawArea = function() {
		alias3.call(this);
		if (this._mapSequenceArea.getCycleMode() == MapSequenceAreaMode.AREA) {
			this._lineGenerator.drawLineGenerator();	
		}
	}
	
	var alias4 = PlayerTurn._doEventEndAction;
	PlayerTurn._doEventEndAction = function() {
		alias4.call(this);
		if (!InputControl.isCancelAction()) {
			this._lineGenerator.resetEverything();
		}
	}
	
	//var alias6 = SimulateMove._endMove;
	//SimulateMove._endMove = function(unit) {
	//	alias6.call(this, unit);
	//	if (unit.getUnitType() == UnitType.PLAYER) {
	//		LineGenerator.forceUpdateEnemyAttackers();
	//	}
	//}
	
	var alias5 = PlayerTurn._prepareTurnMemberData;
	PlayerTurn._prepareTurnMemberData = function() {
		alias5.call(this);
		//this.updateEnemySimulation();
		this._lineGenerator = createObjectEx(LineGenerator, this);
		//this._lineGenerator.resetEverything();
	}
	
	PlayerTurn.updateEnemySimulation = function() {
		this._lineGenerator.forceUpdateEnemyAttackers();
	}
	
}) ();