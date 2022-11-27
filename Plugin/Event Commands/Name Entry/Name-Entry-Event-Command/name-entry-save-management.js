var NameEntrySaveManager = {
	loadNames: function() {
		if (root.getMetaSession().global.nameEntries == undefined) {
			root.getMetaSession().global.nameEntries = [];
		}
		
		var i, count = root.getMetaSession().global.nameEntries.length;
		var playerList = root.getBaseData().getPlayerList();
		
		for (i = 0; i < count; i++) {
			var currentRef = root.getMetaSession().global.nameEntries[i];
			var currentName = currentRef.name;
			var currentId = currentRef.id;
			
			var currentUnit = playerList.getDataFromId(currentId);
			
			if (currentUnit == null) {
				continue;
			}
			
			currentUnit.setName(currentName);
		}
		
		return;
	},
	
	saveName: function(unit, name) {
		var id = unit.getBaseId();
		
		var newName = {};
		newName.id = id;
		newName.name = name;
		
		if (root.getMetaSession().global.nameEntries == undefined) {
			root.getMetaSession().global.nameEntries = [];
		}
		
		//If unit exists in name entry base already...
		var checkedUnit = this.checkUnit(unit);
		if (checkedUnit != -1) {
			root.getMetaSession().global.nameEntries[checkedUnit].name = name;
			return;
		}
		
		root.getMetaSession().global.nameEntries.push(newName);
		return;
	},
	
	//Check if unit is already in database
	checkUnit: function(unit) {
		var id = unit.getBaseId();
		var nameList = root.getMetaSession().global.nameEntries;
		
		if (nameList == undefined) {
			return -1;
		}
		
		var i, count = nameList.length;
		var name = unit.getName();
		
		for (i = 0; i < count; i++) {
			var currentNameEntry = nameList[i];
			
			if (name == currentNameEntry.name) {
				return i;
			}
		}
		
		return -1;
	}
};

(function () {
	var alias1 = ScriptCall_Load;
	ScriptCall_Load = function() {
		alias1.call(this);
		NameEntrySaveManager.loadNames();
	}
}) ();