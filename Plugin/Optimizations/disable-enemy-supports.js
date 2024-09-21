/*
	Made by MarkyJoe1990
	Version 2.0
	
	With this plugin, all enemies that have Mob level importance
	will be skipped over whenever an enemy unit's support bonuses
	are being calculated. This saves a ton of processing power.

	For enemies and classes that need be treated as an exception,
	simply open up the unit or class's custom parameters and add
	{
		supportException: true
	}
	
	This plugin does not overwrite any functions.
*/

(function () {
	var alias2 = SupportCalculator._collectSkillStatus;
	SupportCalculator._collectSkillStatus = function (unit, totalStatus) {
		var unitType = unit.getUnitType();
		
		if (unitType == UnitType.ENEMY) {
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
						if (!targetUnit.custom.supportException && !targetUnit.getClass().custom.supportException) {
							continue;
						}
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