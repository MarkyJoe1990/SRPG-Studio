/*
	Version 1.1
	By MarkyJoe1990

	This plugin allows you to:
	- Set additional conditions for the Extract Map Pos Event Command
	- Force the Extract Map Pos Event Command to use the battle preview,
	complete with calculations that use your currently equipped weapon.

	To force the battle preview, create an Execute Script Event Command
	with 'setForceBattlePreview(true);' in it.

	To disable the battle preview, change true to false, or use
	'resetForceBattlePreview()'

	As for setting additional conditions for Extract Map Pos,
	you use 'setExtractMapPosConditions(FUNC) where FUNC
	is a function with the arguments piData (Explanation below)
	and unit. If the function returns true, the position is valid.

	You will need to reset the conditions after the event command
	is over or else it will effect other events as well.
	
	Use 'resetExtractMapPosConditions()' or
	'setExtractMapPosConditions(null)' to reset it.

	What is piData?
	It stands for Position Index Data, and it is only used
	in the Extract Map Pos Event Command. It contains
	information such as the chosen position's coordinates,
	the unit type filter used, whether the event only
	allows units, etc. I recommend looking at the script
	file 'eventcommand-mapposchoose.js' and looking at
	the function '_createPositionIndexData' for more information.

	Needless to say, you probably won't need it often, but I
	included it as a potential argument just in case.
*/

var ExtractMapPosConditions = null;
var ForceBattlePreview = false;

function setForceBattlePreview(value) {
	ForceBattlePreview = value;
}

function resetForceBattlePreview() {
	ForceBattlePreview = false;
}

function setExtractMapPosConditions(conditions) {
	ExtractMapPosConditions = conditions;
}

function resetExtractMapPosConditions() {
	ExtractMapPosConditions = null;
}

function isInactiveUnit(piData, targetUnit) {
	return targetUnit.isWait() == true;
}

function isActiveUnit(piData, targetUnit) {
	return targetUnit.isWait() == false;
}

function isMaxSp(piData, targetUnit) {
	var maxSp = UnitParameter.MSP.getUnitValue(targetUnit);
	var sp = UnitParameter.MSP.getCurrentSp(targetUnit);

	return sp >= maxSp;
}

function isNotMaxSp(piData, targetUnit) {
	return !isMaxSp(piData, targetUnit);
}

(function() {
	
	var alias1 = MapPosChooseEventCommand._createPositionIndexData;
	MapPosChooseEventCommand._createPositionIndexData = function() {
		var piData = alias1.call(this);
		
		piData.additionalConditions = ExtractMapPosConditions;
		
		return piData;
	}
	
	var alias2 = PositionIndexArray._isUnitAllowed;
	PositionIndexArray._isUnitAllowed = function(piData, targetUnit) {
		var additionalConditions = piData.additionalConditions;
		if (additionalConditions != null) {
			if (additionalConditions(piData, targetUnit) == false) {
				return false;
			}
		}
		
		return alias2.call(this, piData, targetUnit);
	}

	var alias3 = MapPosChooseEventCommand._completeEventCommandMemberData
	MapPosChooseEventCommand._completeEventCommandMemberData = function() {
		var result = alias3.call(this);

		if (ForceBattlePreview == true) {
			var unit = this._getPosWindowUnit();
			var item = this._getPosWindowItem();
			var type = PosMenuType.Attack;

			this._posSelector._posMenu.createPosMenuWindow(unit, item, type);
		}
		
		return result;
	}	
}) ();