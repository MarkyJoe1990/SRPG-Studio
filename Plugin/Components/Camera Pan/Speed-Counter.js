var SpeedCounter = defineObject(CycleCounter, {
	moveCycleCounter: function() {
		var result;
        var d = this._incrementValue;
		
		// If speed up by pressing the system key, increase increment amount.
		if (!this._isGameAccelerationDisabled && Miscellaneous.isGameAcceleration()) {
			d *= 4;
		}
		
		this._counterValue += d;
		if (this._counterValue >= this._max) {
			this._counterValue = 0;
			result = MoveResult.END;
		}
		else {
			result = MoveResult.CONTINUE;
		}
		
		return result;
	}
});