/*
	Made by MarkyJoe1990
	Version 1.0
	
	With this plugin, you get the option to disable certain kinds of
	enemy support bonuses. Specifically, enemies will not get support
	bonuses obtained from their allies via support skills. The only
	exception is if those allies are sub leaders, or leaders.
	
	This is important, because the greatest cause of lag in SRPG
	Studio is from calculating enemy support bonuses, which is done
	every time you check an enemy's stats, or hover your cursor
	over an enemy you're about to attack. Since it's generally bad
	design to give enemies support skills, and since this causes such
	a substantial amount of lag when lots of enemies are on the map,
	this feature is generally a nuisance more than it helps.
	
	In order to use this plugin:
	- Go to the map where you want to disable enemy support bonuses
	- Go to map information.
	- Go to custom parameters
	- Then put {disableEnemySupport: true}
	
*/

(function () {
	
	//skips enemy skill support status collection EXCEPT for sub leaders and leaders
	//if the map has enemy supports set to be disabled.
	var alias2 = SupportCalculator._collectSkillStatus;
	SupportCalculator._collectSkillStatus = function (unit, totalStatus) {
		var unitType = unit.getUnitType();
		var disableEnemySupport = root.getCurrentSession().getCurrentMapInfo().custom.disableEnemySupport;
		
		if (unitType == UnitType.ENEMY && disableEnemySupport) {
			//Grab all sub leaders and leaders from the enemy list
			
			var i, j, list, count, targetUnit, importance;
			var listArray = this._getListArray(unit);
			var listCount = listArray.length;
			
			for (i = 0; i < listCount; i++) {
				list = listArray[i];
				count = list.getCount();
				for (j = 0; j < count; j++) {
					targetUnit = list.getData(j);
					importance = targetUnit.getImportance();
					if (unit === targetUnit || importance == ImportanceType.MOB) {
						continue;
					}
					
					this._checkSkillStatus(targetUnit, unit, false, totalStatus);
				}
			}
			
			this._checkSkillStatus(unit, null, true, totalStatus);
			return;
		}
		
		alias2.call(this, unit, totalStatus);
	}
	
}) ();