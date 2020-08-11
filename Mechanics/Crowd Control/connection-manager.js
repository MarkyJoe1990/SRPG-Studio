var ConnectionState = {
	UPDATE: 0,
	FETCH: 1,
	EXECUTE: 2	
}

var ArrangeObjectType = {
	ITEM: 0,
	WEAPON: 1,
	STATE: 2,
	SKILL: 4,
	ART: 5
}

var ConnectionManager = {
	_http: null,
	_url: null,
	_url2: null,
	_url3: null,
	_timePassed: 0,
	_objectArray: [],
	_state : 0,
	_notificationArray: null,
	
	initSingleton: function() {
		this._http = new ActiveXObject("Msxml2.XMLHTTP.6.0");
		this._url = "https://fecentral.org/crowdcontrol.php?";
		this._url2 = "https://fecentral.org/deletecrowdcontrol.php?";
		this._url3 = "https://fecentral.org/sendcrowdcontroldatabase.php/?";
		this._objectArray = [];
		this._state = ConnectionState.UPDATE;
		this._notificationArray = [];
	},
	
	resetSelf: function() {
		this._objectArray = [];
		this._state = ConnectionState.UPDATE;
		this._notificationArray = [];
	},
	
	sendDataThing: function() {
		var http = this._http;
		var d = new Date();
		http.open("POST", this._url3, true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		//Grab current player units, items, weapons, states, skills and arts
		//Send them all to the database
		var data = this.buildDataThing();
		testString = data.stringifySelf();
		//testString = '"{}"';
		//root.msg(this._url3 + 'gamedata=' + testString);
		http.send('gamedata=' + testString + '&guid=' + CROWD_CONTROL_GAME_ID + '');
		
		http.onreadystatechange = function() {
			if (http.readystate == 4) {
				ConnectionManager.pushNotification(http.responseText);
				if (http.responseText == "Successfully sent game data to database!") {
					ConnectionManager.setState(ConnectionState.FETCH);
				}
			}
		}
		
	},
	
	fetchMessages: function() {
		//this.buildDataThing()
		var http = this._http;
		var d = new Date();
		http.open('POST', this._url + d.toString() + "&", true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		http.send('gameid=' + CROWD_CONTROL_GAME_ID);
		
		http.onreadystatechange = function() {
			if (http.readystate == 4) {
				try {
					var objectArray = eval(http.responseText);
					//root.msg(http.responseText)
					ConnectionManager.setObjectArray(objectArray);
					//root.log(typeof objectArray);
					if (typeof objectArray != "array" && typeof objectArray != null) {
						if (objectArray.length != null) {
							if (ConnectionManager._objectArray.length > 0) {
								ConnectionManager.setState(ConnectionState.EXECUTE);
							}
						}
					}
				} catch (e) {
					ConnectionManager.pushNotification("ERROR: " + e);
				}
			}
		}
	},
	
	setCommandAsExecuted: function(index) {
		var http = this._http;
		var d = new Date();
		http.open('POST', this._url2 + d.toString() + "&", true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		http.send('commandid=' + this.getCommandId(index));
		
		http.onreadystatechange = function() {
			if (http.readystate == 4) {
				ConnectionManager.deleteObjectArrayEntry(index);
				if (ConnectionManager._objectArray.length == 0) {
					ConnectionManager._state = ConnectionState.FETCH;
				}
			}
		}
		
	},
	
	moveConnection: function() {
		if (this._timePassed % 15 == 0) {
			if (this._state == ConnectionState.UPDATE) {
				this.sendDataThing();
			}
			else if (this._state == ConnectionState.FETCH) {
				this.fetchMessages();
			} else if (this._state == ConnectionState.EXECUTE) {
				this.executeCommand(0);
			}
		}
		
		if (this._notificationArray.length > 0) {
			for (i = this._notificationArray.length - 1; i >= 0; i--) {
				var notifResult = this._notificationArray[i].moveNotification();
				if (notifResult == MoveResult.END) {
					this._notificationArray.splice(i, 1);
				}
			}
		}
		
		this._timePassed++;
		return MoveResult.CONTINUE;
	},
	
	drawConnection: function() {
		var x = 2;
		var y = 0;
		var font = root.queryTextUI("default_window").getFont();
		var color = 0xFFFFFF;
		var displayedState;
		
		if (this._state == ConnectionState.UPDATE) {
			displayedState = "Sending game data to database...";
		} else if (this._state == ConnectionState.FETCH) {
			displayedState = "Fetching commands from database queue...";
		} else if (this._state == ConnectionState.EXECUTE) {
			displayedState = "Executing commands...";
		} else {
			displayedState = "UNKNOWN";
		}
		TextRenderer.drawText(x, y, "Status: " + displayedState + "", -1, color, font);
		y += 16;
		try {
			for (i = 0; i < this._objectArray.length; i++) {
				var myString = this.interpretObject(i);
				
				var canvas = root.getGraphicsManager().getCanvas();
				canvas.setFillColor(0x001155, 128);
				canvas.drawRectangle(x, y, root.getWindowWidth(), 16);
				TextRenderer.drawText(x, y, myString, -1, color, font);
				y += 16;
			}
		} catch (e) {
			this.pushNotification("ERROR: " + e);
		}
		
		if (this._notificationArray.length > 0) {
			for (i = 0; i < this._notificationArray.length ; i++) {
				var width = this._notificationArray[i].getWidth();
				var height = this._notificationArray[i].getHeight();
				var x = Math.floor(root.getWindowWidth()) - Math.floor(width) - this._notificationArray[i].getSpaceX();
				var y = root.getWindowHeight() - height - this._notificationArray[i].getSpaceY();
				var space = this._notificationArray[i].getSpaceY() + height;
				this._notificationArray[i].drawNotification(x, y - (space*i));
			}
		}
	},
	
	executeCommand: function(index) {
		if (this._objectArray.length == 0) {
			this._state = ConnectionState.FETCH;
			return;
		}
		
		var command = this.getCommand(index);
		var notification = this.getUserName(index) + ": ";
		
		if (command == "sethp") {
			//Set up
			var unitName = this.getArgument(index, 0);
			var amount = this.getArgument(index, 1);
			var playerList = root.getCurrentSession().getPlayerList();
			
			//Step 2
			var unit = this.fetchUnit(unitName);
			var lockStatus = this.getLockStatus(unit);
			
			//Check for errors
			if (unit == null) {
				notification += unitName + " does not exist in current player database!";
			} else if (lockStatus != null) {
				notification += unitName + " cannot be modified! They have the " + lockStatus.getName() + " status effect!";
			} else {
				//No errors! Good. Execute!
				var maxHp = unit.getParamValue(ParamType.MHP);
				if (amount < 1) {
					amount = 1;
				} else if (amount > maxHp) {
					amount = maxHp;
				}
				
				unit.setHp(amount);
				notification += "set " + unitName + "'s HP to " + amount + "!";
			}
		} else if (command == "addremove") {
			//Step 1
			var objectList = null;
			var unitName = this.getArgument(index, 0);
			var addOrRemove = this.getArgument(index, 1);
			var objectType = this.getArgument(index, 2);
			var objectName = this.getArgument(index, 3);
			var playerList = root.getCurrentSession().getPlayerList();
			var unit = this.fetchUnit(unitName);
			var lockStatus = this.getLockStatus(unit);
			
			if (objectType == "Item") {objectList = root.getBaseData().getItemList()};
			if (objectType == "Weapon") {objectList = root.getBaseData().getWeaponList()};
			if (objectType == "State") {objectList = root.getBaseData().getStateList()};
			if (objectType == "Skill") {objectList = root.getBaseData().getSkillList()};
			if (objectType == "Combat Art" && typeof CombatArtControl != "undefined") {objectList = root.getBaseData().getOriginalDataList(TAB_COMBATART)};
			var actualObject = this.fetchObjectByName(objectName, objectList);
			
			//Check for errors
			if (unit == null) {
				notification += unitName + " does not exist in current player unit database!";
			} else if (lockStatus != null) {
				notification += unitName + " cannot be modified! They have the " + lockStatus.getName() + " status effect!";
			} else if (objectType == "Combat Art" && typeof CombatArtControl == "undefined") {
				notification += "Goinza's Combat Art Plugin is not installed on this game!";
			} else if (actualObject == null) {
				notification += objectName + " does not exist in " + objectType + " database!";
			} else {
				var increaseType;
				if (addOrRemove == "Add") {
					increaseType = IncreaseType.INCREASE
					notification += "Added " + objectName + " to " + unitName + "!";
				} else if (addOrRemove == "Remove") {
					increaseType = IncreaseType.DECREASE
					notification += "Removed " + objectName + " from " + unitName + "!";
				};
				if (objectType == "Item" || objectType == "Weapon") {ItemChangeControl.changeUnitItem(unit, actualObject, increaseType, false);}
				if (objectType == "State") {StateControl.arrangeState(unit, actualObject, increaseType);}
				if (objectType == "Skill") {SkillChecker.arrangeSkill(unit, actualObject, increaseType);}
				if (objectType == "Combat Art") {
					if (increaseType == IncreaseType.INCREASE) {
						CombatArtControl.addCombatArt(actualObject, unit);
					} else {
						if (typeof unit.custom.combatArt == "array" && unit.custom.combatArt.length > 0) {
						CombatArtControl.removeCombatArt(actualObject, unit);
						}
					}
				}
			}
		}
		
		this.pushNotification(notification);
		this.setCommandAsExecuted(index);
	},
	
	getLockStatus: function(unit) {
		if (unit == null) {
			return null;
		}
		
		var i, currentState;
		var turnStateList = unit.getTurnStateList();
		
		for (i = 0; i < turnStateList.getCount(); i++) {
			currentState = turnStateList.getData(i).getState();
			
			if (typeof currentState.custom.allowCrowdControl == "undefined") {
				return null;
			}
			
			if (currentState.custom.allowCrowdControl == false) {
				return currentState;
			}
		}
		return null;
	},
	
	pushNotification: function(message) {
		var notifyObject = createObject(NotificationObject);
		notifyObject.setUp(message);
		this._notificationArray.push(notifyObject);
	},
	
	fetchUnit: function(name) {
		var i, x, currentUnit;
		var unitList = [];
		unitList.push(PlayerList.getAliveDefaultList());
		unitList.push(EnemyList.getAliveDefaultList());
		unitList.push(AllyList.getAliveDefaultList());
		
		for (i = 0; i < unitList.length; i++) {
			for (x = 0; x < unitList[i].getCount(); x++) {
				currentUnit = unitList[i].getData(x);
				if (currentUnit.getName() == name) {
					return currentUnit;
				}
			}
		}
		
		return null;
	},
	
	fetchObjectByName: function(name, dataList) {
		if (dataList == null) {
			return null;
		}
		
		for (i = 0; i < dataList.getCount(); i++) {
			currentObject = dataList.getData(i);
			if (name == currentObject.getName()) {
				return currentObject;
			}
		}
		
		return null;
	},
	
	buildDataThing: function() {
		var i, x;
		var data = {
			UnitList: [],
			ItemList: [],
			WeaponList: [],
			StateList: [],
			SkillList: [],
			ArtList: []
		}
		
		var session = root.getCurrentSession();
		var baseData = root.getBaseData();
		
		var unitList = [];
		unitList.push(session.getPlayerList());
		unitList.push(session.getEnemyList());
		unitList.push(session.getAllyList());
		
		var itemList = baseData.getItemList();
		var weaponList = baseData.getWeaponList();
		var stateList = baseData.getStateList();
		var skillList = baseData.getSkillList();
		var artList = null;
		if (typeof CombatArtControl != "undefined") {
			artList = root.getBaseData().getOriginalDataList(TAB_COMBATART)
		};
		
		for (i = 0; i < unitList.length; i++) {
			for (x = 0; x < unitList[i].getCount(); x++) {
				currentUnit = unitList[i].getData(x).getName();
				data.UnitList.push(currentUnit);
			}
		}
		
		for (i = 0; i < itemList.getCount(); i++) {
			currentItem = itemList.getData(i).getName();
			data.ItemList.push(currentItem);
		}
		
		for (i = 0; i < weaponList.getCount(); i++) {
			currentWeapon = weaponList.getData(i).getName();
			data.WeaponList.push(currentWeapon);
		}
		
		for (i = 0; i < stateList.getCount(); i++) {
			currentState = stateList.getData(i).getName();
			data.StateList.push(currentState);
		}
		
		for (i = 0; i < skillList.getCount(); i++) {
			currentSkill = skillList.getData(i).getName();
			data.SkillList.push(currentSkill);
		}
		
		if (artList != null) {
			for (i = 0; i < artList.getCount(); i++) {
				currentArt = artList.getData(i).getName();
				data.ArtList.push(currentArt);
			}
		}
		
		//Don't forget to add combat arts later
		
		//Stringify self... hoo booy. COME BACK TO THIS. VERY IMPORTANT.
		
		data.stringifySelf = function () {
			var string = "";
			string += '\"{';
			string += '\\\"UnitList\\\": [' + ConnectionManager.printArray(this.UnitList) + '],';
			string += '\\\"ItemList\\\": [' + ConnectionManager.printArray(this.ItemList) + '],';
			string += '\\\"WeaponList\\\": [' + ConnectionManager.printArray(this.WeaponList) + '],';
			string += '\\\"StateList\\\": [' + ConnectionManager.printArray(this.StateList) + '],';
			string += '\\\"SkillList\\\": [' + ConnectionManager.printArray(this.SkillList) + '],';
			string += '\\\"ArtList\\\": [' + ConnectionManager.printArray(this.ArtList) + ']';
			string += '}\"';
			
			return string;
		}
		
		return data;
	},
	
	printArray: function(array) {
		var i, myString;
		myString = '';
		
		for (i = 0; i < array.length; i++) {
			myString += '\\\"';
			myString += array[i];
			
			if (i < array.length - 1) {
				myString += '\\\",';
			} else {
				myString += '\\\"';
			}
		}
		
		return myString;
	},
	
	setObjectArray: function(objectArray) {
		this._objectArray = objectArray;
	},
	
	interpretObject: function(index) {
		var unitName, amount, userName, addRemove, objectType, objectName;
		var command = this.getCommand(index);
		
		if (command == "sethp") {
			unitName = this.getArgument(index, 0);
			amount = this.getArgument(index, 1);
			userName = this.getUserName(index);
			
			return userName + ": Set " + unitName + "'s HP to " + amount + "!";
		} else if (command == "addremove") {
			unitName = this.getArgument(index, 0);
			addRemove = this.getArgument(index, 1);
			objectType = this.getArgument(index, 2);
			objectName = this.getArgument(index, 3);
			userName = this.getUserName(index);
			
			return userName + ": " + addRemove + " " + objectName + " " + objectType + " to " + unitName + "!";
		}
	},
	
	deleteObjectArrayEntry: function(index) {
		this._objectArray.splice(index, 1);
	},
	
	setState: function(state) {
		this._state = state;
	},
	
	getUserId: function(index) {
		return this._objectArray[index].userid;
	},
	
	getUserName: function(index) {
		if (this._objectArray[index].username != "") {
			return this._objectArray[index].username;
		} else {
			return "Anonymous";
		}
	},
	
	getCommand: function(index) {
		return this._objectArray[index].command;
	},
	
	getArguments: function(index) {
		return this._objectArray[index].args;
	},
	
	getArgument: function(index, argNumber) {
		return this._objectArray[index].args[argNumber];
	},
	
	getCommandId: function(index) {
		return this._objectArray[index].commandid;
	}
};