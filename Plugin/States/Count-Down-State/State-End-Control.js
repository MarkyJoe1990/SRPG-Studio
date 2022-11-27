var StateEndControl = {
	_unit: null,
	_state: null,
	_isStateEndEvent: false,
	_stateEndQueue: [],
	
	isStateEndEvent: function() {
		return this._isStateEndEvent;
	},
	
	isQueuedState: function(stateId) {
		return this.isStateEndEvent() && StateEndControl.getStateEndStateId() == stateId;
	},
	
	activateStateEndEvent: function(unit, state) {
		this.setStateEndUnit(unit);
		this.setStateEndState(state);
		this._isStateEndEvent = true;
	},
	
	deactivateStateEndEvent: function() {
		this.setStateEndUnit(null);
		this.setStateEndState(null);
		this._isStateEndEvent = false;
	},
	
	getStateEndQueue: function() {
		return this._stateEndQueue;
	},
	
	getCurrentStateEnd: function() {
		return this.getStateEndQueue()[0];
	},
	
	addToQueue: function(stateEndEffect) {
		this._stateEndQueue.push(stateEndEffect);
	},
	
	getQueueCount: function() {
		return this._stateEndQueue.length;
	},
	
	removeFromQueue: function(index) {
		this._stateEndQueue.splice(index, 1);
	},
	
	clearQueue: function() {
		this._stateEndQueue = [];
	},
	
	getStateEndUnit: function() {
		return this._unit;
	},
	
	getStateEndUnitId: function() {
		var unit = this.getStateEndUnit();
		if (unit == null) {
			return -1;
		}
		
		return unit.getId();
	},
	
	getStateEndState: function() {
		return this._state;
	},
	
	getStateEndStateId: function() {
		var state = this.getStateEndState();
		if (state == null) {
			return -1;
		}
		
		return state.getId();
	},
	
	setStateEndUnit: function(unit) {
		this._unit = unit;
	},
	
	setStateEndState: function(state) {
		this._state = state;
	}
}