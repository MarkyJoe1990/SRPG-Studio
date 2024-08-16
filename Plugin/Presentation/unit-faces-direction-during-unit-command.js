( function () {
	var alias1 = UnitWaitFlowEntry._completeMemberData;
	UnitWaitFlowEntry._completeMemberData = function(playerTurn) {
		//Plays after most actions
		
		var unit = playerTurn.getTurnTargetUnit();
		unit.setDirection(DirectionType.NULL);
		
		alias1.call(this, playerTurn);
	}
	
	var alias2 = MapSequenceArea._getDefaultDirection;
	MapSequenceArea._getDefaultDirection = function() {
		return DirectionType.BOTTOM;
	}
	
	var alias3 = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		//grab previous direction
		var direction = unit.getDirection();
		alias3.call(this, unit);
		
		if (this._isKeepDirection === true) {
			unit.setDirection(direction);
		}
	}
	
	//REPLACER
	var alias4 = MapSequenceArea._startMove;
	MapSequenceArea._startMove = function() {
		var result = alias4.call(this);
		
		this._simulateMove._isKeepDirection = true;
		
		return result;
	}
	
}) ();