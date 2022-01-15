var BaseStateEndEffect = defineObject(BaseObject, {
	_unit: null,
	_state: null,
	
	setStateEndEffect: function(unit, state) {
		this._unit = unit;
		this._state = state;
		this._setOtherValues(unit, state);
	},
	
	enterStateEndEffect: function() {
		return EnterResult.NOTENTER;
	},
	
	moveStateEndEffect: function() {
		return MoveResult.END;
	},
	
	drawStateEndEffect: function() {
	},
	
	_isSkipMode: function() {
		return CurrentMap.isTurnSkipMode();
	},
	
	_setOtherValues: function(unit, state) {
	},
	
	_parseCustomValue: function(unit, state, value) {
		if (typeof value == "function") {
			return value(unit, state);
		}
		
		if (typeof value == "number") {
			return value;
		}
		
		return 0;
	}
});

var DamageStateEndEffect = defineObject(BaseStateEndEffect, {
	_dynamicEvent: null,
	_exitDamage: 0,
	
	_setOtherValues: function(unit, state) {
		this._exitDamage = this._parseCustomValue(unit, state, state.custom.exitDamage);
	},
	
	enterStateEndEffect: function() {
		if (this._exitDamage <= 0) {
			return EnterResult.NOTENTER;
		}
		
		this._dynamicEvent = createObject(DynamicEvent);
		var eventGenerator = this._dynamicEvent.acquireEventGenerator();
		eventGenerator.damageHit(this._unit, root.queryAnime("easydamage"), this._exitDamage, DamageType.FIXED, {}, this._isSkipMode())
		
		return this._dynamicEvent.executeDynamicEvent();
	},
	
	moveStateEndEffect: function() {
		this._dynamicEvent.moveDynamicEvent();
	}
});

var InflictStateEndEffect = defineObject(BaseStateEndEffect, {
	_dynamicAnime: null,
	_exitState: 0,
	
	_setOtherValues: function(unit, state) {
		var exitStateId = this._parseCustomValue(unit, state, state.custom.exitState);
		
		this._exitState = root.getBaseData().getStateList().getDataFromId(exitStateId);
	},
	
	enterStateEndEffect: function() {
		
		if (this._exitState == null) {
			return EnterResult.NOTENTER;
		}
		
		if (this._isSkipMode() == true) {
			this._doMainAction();
			return EnterResult.NOTENTER;
		}
		
		this._dynamicAnime = createObject(DynamicAnime);
		var anime = this._exitState.getEasyAnime();
		
		var x = 0;
		var y = 0;
		
		this._dynamicAnime.startDynamicAnime(anime, x, y);
		
		return EnterResult.OK;
	},
	
	moveStateEndEffect: function() {
		if (this._dynamicAnime.moveDynamicAnime() != MoveResult.CONTINUE) {
			this._doMainAction();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawStateEndEffect: function() {
		this._dynamicAnime.drawDynamicAnime();
	},
	
	_doMainAction: function() {
		StateControl.arrangeState(this._unit, this._exitState, IncreaseType.INCREASE);
	}
});

var EventStateEndEffect = defineObject(BaseStateEndEffect, {
	_eventChecker: null,
	
	enterStateEndEffect: function() {
		this._eventChecker = createObject(EventChecker);
		
		var eventList = root.getCurrentSession().getAutoEventList();
		var eventType = EventType.AUTO;
		var eventArray = EventCommonArray.createArray(eventList, eventType);
		
		var i, count = eventArray.length;
		for (i = count - 1; i >= 0; i--) {
			var currentEvent = eventArray[i];
			
			if (currentEvent.custom.isStateEndEvent != true) {
				eventArray.splice(i, 1);
			}
		}
		
		var finalEventList = StructureBuilder.buildDataList();
		finalEventList.setDataArray(eventArray);
		
		StateEndControl.activateStateEndEvent(this._unit, this._state);
		if (this._eventChecker.enterEventChecker(finalEventList, eventType) == EnterResult.NOTENTER) {
			StateEndControl.deactivateStateEndEvent();
			
			return EnterResult.NOTENTER;
		}
		
		return EnterResult.OK;
	},
	
	moveStateEndEffect: function() {
		if (this._eventChecker.moveEventChecker() != MoveResult.CONTINUE) {
			StateEndControl.deactivateStateEndEvent();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	}
});