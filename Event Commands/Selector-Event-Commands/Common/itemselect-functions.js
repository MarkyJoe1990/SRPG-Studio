function findVar(name) {
	result = null;
	if (typeof name === 'string') {
		var varTable, meta, result;
		meta = root.getMetaSession();
		//i < variable table count
		//Go through all variable tables first
		//0 - 4: Normal Variables
		//5: ID Variables
		
		for (i = 0; i < 6; i++) {
			varTable = meta.getVariableTable(i);
			for (x = 0; x < varTable.getVariableCount(); x++) {
				if (varTable.getVariableName(x) == name) {
					result = {table:i,id:x};
				}
			}
		}
	}
	return result;
}

function combineArrays(array1, array2) {
	var combinedArray = [];
	
	for (i = 0; i < array1.length; i++) {
		combinedArray.push(array1[i]);
	}
	for (i = 0; i < array2.length; i++) {
		combinedArray.push(array2[i]);
	}
	
	return combinedArray;
}

function getUnitItemList(unit) {
	var itemList = [];
	
	count = UnitItemControl.getPossessionItemCount(unit);
	for (i = 0; i < count; i++) {
		itemList.push(unit.getItem(i));
	}
	
	return itemList;
}

function getUnitSkillList(unit) {
	var skillList = [];
	var skillRef = unit.getSkillReferenceList();
	
	count = skillRef.getTypeCount();
	for (i = 0; i < count; i++) {
		skillList.push(skillRef.getTypeData(i));
	}
	return skillList;
}

function createItemList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		itemList = root.getBaseData().getItemList();
		for (i = 0; i < array.length; i++) {
			array[i] = itemList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createStateList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		stateList = root.getBaseData().getStateList();
		for (i = 0; i < array.length; i++) {
			array[i] = stateList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createWeaponList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		weaponList = root.getBaseData().getWeaponList();
		for (i = 0; i < array.length; i++) {
			array[i] = weaponList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createSkillList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		skillList = root.getBaseData().getSkillList();
		for (i = 0; i < array.length; i++) {
			array[i] = skillList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createClassList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		classList = root.getBaseData().getClassList();
		for (i = 0; i < array.length; i++) {
			array[i] = classList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createUnitList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		unitList = root.getBaseData().getPlayerList();
		for (i = 0; i < array.length; i++) {
			array[i] = unitList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function createArtList(array) {
	result = null;
	
	if (array instanceof Array == true) {
		
		artList = root.getBaseData().getOriginalDataList(TAB_COMBATART);
		for (i = 0; i < array.length; i++) {
			array[i] = artList.getDataFromId(array[i]);
		}
		result = array;
	}
	return result;
}

function validateObjectList(array) {
	result = true;
	
	for (i = 0; i < array.length; i++) {
		if (array[i] == null) {
			root.msg("ERROR: One of the items you specified does not exist! index: " + i);
			result = false
			break;
		}
	}
	if (result == true) {root.log("All good")};
	
	return result;
}

function selfSwitchInterpret(selfSwitch) {
	if (typeof selfSwitch == "number") {
		return selfSwitch;
	}
	
	result = selfSwitch.toLowerCase();
	
	return result.charCodeAt(0) - 97;
}