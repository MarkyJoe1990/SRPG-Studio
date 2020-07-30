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
	
	LineGenerator.forceUpdateEnemyAttackers(EnemyList.getAliveDefaultList());
	
	Make sure you place it AFTER the map changes or it won't work.
*/

LINE_DEBUG_ENABLED = false;

var LineGenerator = defineObject(BaseObject, {
	_enemyList: null,
	_currentUnit: null,
	_enemiesInRange: [],
	_timePassed: 0,
	
	poolOldList: function(enemyList) {
		oldList = []
		for (i = 0; i < enemyList.getCount(); i++) {
			currentEnemy = enemyList.getData(i);
			attackRange = UnitRangePanel.getUnitAttackRange(currentEnemy)
			enemyInfo = {
				x: currentEnemy.getMapX(),
				y: currentEnemy.getMapY(),
				mov: attackRange.mov,
				startRange: attackRange.startRange,
				endRange: attackRange.endRange
			}
			
			oldList.push(enemyInfo);
		}
		
		return oldList;
	},
	
	updateList: function(enemyList) {
		/*
		matchingList = true;
		if (root.getMetaSession().global.targetingLineList == undefined) {
			root.getMetaSession().global.targetingLineList = this.poolOldList(enemyList);
			matchingList = false;
		} else {
			for (i = 0; i < root.getMetaSession().global.targetingLineList.length && i < enemyList.getCount(); i++) {
				unit1 = root.getMetaSession().global.targetingLineList[i];
				unit2 = UnitRangePanel.getUnitAttackRange(enemyList.getData(i));
				unit2.x = enemyList.getData(i).getMapX();
				unit2.y = enemyList.getData(i).getMapY();
				
				if (unit1.mov == unit2.mov &&
					unit1.x == unit2.x &&
					unit1.y == unit2.y) {
				} else {
					matchingList = false;
					root.getMetaSession().global.targetingLineList = this.poolOldList(enemyList);
					break;
				}
			}
		}

		if (matchingList) {return;}
		*/
		this.forceUpdateEnemyAttackers(enemyList);
	},
	
	forceUpdateEnemyAttackers: function(enemyList) {
		this._attackArray = [];
		var session = root.getCurrentSession();
		var mapSim = session.createMapSimulator();
		for (i = 0; i < enemyList.getCount(); i++) {
			currentEnemy = enemyList.getData(i);
			if (currentEnemy.isInvisible()) {continue;}
			
			weapon = ItemControl.getEquippedWeapon(currentEnemy)
			if (weapon == null) {continue;}
			
			startRange = weapon.getStartRange();
			endRange = weapon.getEndRange();
			moveStat = ParamGroup.getLastValue(currentEnemy, ParamType.MOV, weapon);
			
			patternType = currentEnemy.getAIPattern().getPatternType();
			if (patternType === PatternType.WAIT && currentEnemy.getAIPattern().getWaitPatternInfo().isWaitOnly()) {continue;}
			if (patternType === PatternType.MOVE && currentEnemy.getAIPattern().getMovePatternInfo().getMoveAIType() == MoveAIType.MOVEONLY) {continue;}
			
			mapSim.startSimulationWeapon(currentEnemy, moveStat, startRange, endRange);
			this._attackArray.push({
				unit: currentEnemy,
				weaponArray: mapSim.getSimulationWeaponIndexArray(),
				walkArray: mapSim.getSimulationIndexArray()
			});
		}
		root.getMetaSession().global.badIndex = this._attackArray;
	},
	
	setUp: function(currentUnit) {
		this._currentUnit = currentUnit;
	},
	
	moveLineGenerator: function() {
		this._enemiesInRange = [];
		fuck = root.getMetaSession().global.badIndex;
		this._currentUnitIndex = CurrentMap.getIndex(MapCursor.getX(), MapCursor.getY());
		var isSelectable = this.getParentInstance()._isPlaceSelectable();
		
		if (isSelectable) {
			for (i = 0; i < fuck.length; i++) {
				found = false;
				for (x = 0; x < fuck[i].weaponArray.length; x++) {
					if (this._currentUnitIndex == fuck[i].weaponArray[x]) {
						found = true;
						this._enemiesInRange.push(fuck[i].unit);
						break;
					}
				}
				if (!found) {
					for (x = 0; x < fuck[i].walkArray.length; x++) {
						if (this._currentUnitIndex == fuck[i].walkArray[x]) {
							this._enemiesInRange.push(fuck[i].unit);
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
			if (this._enemiesInRange[i].getAliveState() != AliveType.ALIVE) {continue;}
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
		
		if (LINE_DEBUG_ENABLED) {
			var textX = 0;
			var textY = 0;
			var font = root.queryTextUI("default_window").getFont();
			var color = 0xFFFFFF;
			
			TextRenderer.drawText(textX,textY,"FPS: " + root.getFPS(), -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Enemy Count: " + EnemyList.getAliveDefaultList().getCount(), -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Current Unit: " + this._currentUnit.getName(), -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Current X, Y: " + MapCursor.getX() + ", " + MapCursor.getY(), -1, color, font)
			textY += 16;
			TextRenderer.drawText(textX,textY,"Enemies in range: " + this._enemiesInRange.length, -1, color, font)
			textY += 16;
			
			if (this._enemiesInRange.length > 0) {
				TextRenderer.drawText(textX,textY,"First Enemy X: " + this._enemiesInRange[0].getMapX(), -1, color, font)
				textY += 16;
			}
		}
	}
	
});


(function () {
	
	var alias1 = MapSequenceArea._prepareSequenceMemberData;
	MapSequenceArea._prepareSequenceMemberData = function (parentTurnObject) {
		alias1.call(this, parentTurnObject);
		this._lineGenerator = createObjectEx(LineGenerator, this);
		this._lineGenerator.setUp(this._targetUnit);
	}
	
	var alias2 = MapSequenceArea._moveArea;
	MapSequenceArea._moveArea = function() {
		var result = alias2.call(this);
		this._lineGenerator.moveLineGenerator();
		return result;
	}
	
	var alias3 = MapSequenceArea._drawArea;
	MapSequenceArea._drawArea = function() {
		alias3.call(this);
		this._lineGenerator.drawLineGenerator();
	}
	
	//var alias4 = PlayerTurn._doEventEndAction;
	//PlayerTurn._doEventEndAction = function() {
	//	alias4.call(this);
	//	//this.updateEnemySimulation();
	//}
	
	var alias5 = PlayerTurn._prepareTurnMemberData;
	PlayerTurn._prepareTurnMemberData = function() {
		alias5.call(this);
		this.updateEnemySimulation();
	}
	
	PlayerTurn.updateEnemySimulation = function() {
		LineGenerator.updateList(EnemyList.getAliveDefaultList());
	}
	
}) ();