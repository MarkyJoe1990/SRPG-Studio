var UnitEventAutoActionMode = {
    CURSORSHOW: 0,
	UNITEVENT: 1
}

var UnitEventAutoAction = defineObject(BaseAutoAction, {
    _capsuleEvent: null,

    setAutoActionInfo: function(unit, combination) {
		this._unit = unit;
		this._event = combination.event;
		this._targetUnit = combination.targetUnit;
		this._targetPos = combination.targetPos;
        this._combination = combination;
		this._autoActionCursor = createObject(AutoActionCursor);
        this._capsuleEvent = createObject(CapsuleEvent);
	},

    enterAutoAction: function() {
		var isSkipMode = this.isSkipMode();
		
		if (isSkipMode) {
			if (this._enterUnitEvent() === EnterResult.NOTENTER) {
                UnitEventAIControl.setCurrentCombination(null);
				return EnterResult.NOTENTER;
			}
			
			this.changeCycleMode(UnitEventAutoActionMode.UNITEVENT);
		}
		else {
			this._changeCursorShow();
			this.changeCycleMode(UnitEventAutoActionMode.CURSORSHOW);
		}
		
		return EnterResult.OK;
	},

    moveAutoAction: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		if (mode === UnitEventAutoActionMode.CURSORSHOW) {
			result = this._moveCursorShow();
		}
		else if (mode === UnitEventAutoActionMode.UNITEVENT) {
			result = this._moveUnitEvent();
		}
		
		return result;
	},

    drawAutoAction: function() {
		var mode = this.getCycleMode();
		
		if (mode === UnitEventAutoActionMode.CURSORSHOW) {
			this._drawCurosrShow();
		}
		else if (mode === UnitEventAutoActionMode.UNITEVENT) {
			this._drawUnitEvent();
		}
	},

    _moveCursorShow: function() {
		var isSkipMode = this.isSkipMode();
		
		if (isSkipMode || this._autoActionCursor.moveAutoActionCursor() !== MoveResult.CONTINUE) {
			if (isSkipMode) {
				this._autoActionCursor.endAutoActionCursor();
			}
			
			if (this._enterUnitEvent() === EnterResult.NOTENTER) {
                UnitEventAIControl.setCurrentCombination(null);
				return MoveResult.END;
			}
		
			this.changeCycleMode(WeaponAutoActionMode.PREATTACK);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveUnitEvent: function() {
		if (this._capsuleEvent.moveCapsuleEvent() !== MoveResult.CONTINUE) {
            UnitEventAIControl.setCurrentCombination(null);
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_drawCurosrShow: function() {
		this._autoActionCursor.drawAutoActionCursor();
	},
	
	_drawUnitEvent: function() {
	},

    _changeCursorShow: function() {
		this._autoActionCursor.setAutoActionPos(this._targetUnit.getMapX(), this._targetUnit.getMapY(), true);
	},

    _enterUnitEvent: function() {
        UnitEventAIControl.setCurrentCombination(this._combination);
		return this._capsuleEvent.enterCapsuleEvent(this._event, false);
	}
});