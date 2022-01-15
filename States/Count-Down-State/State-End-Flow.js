var StateEndFlow = defineObject(BaseFlowEntry, {
	_dynamicEvent: null,
	
	enterFlowEntry: function() {
		root.log("RUN");
		
		if (StateEndControl.getQueueCount() == 0) {
			return EnterResult.NOTENTER;
		}
		
		return this._enterStateEndQueue();
	},
	
	_enterStateEndQueue: function() {
		if (StateEndControl.getQueueCount() == 0) {
			return EnterResult.NOTENTER;
		}
		
		while (StateEndControl.getCurrentStateEnd().enterStateEndEffect() != EnterResult.OK) {
			StateEndControl.removeFromQueue(0);
			
			if (StateEndControl.getQueueCount() == 0) {
				return EnterResult.NOTENTER;
			}
		}
		
		return EnterResult.OK;
	},
	
	moveFlowEntry: function() {
		if (StateEndControl.getCurrentStateEnd().moveStateEndEffect() != MoveResult.CONTINUE) {
			StateEndControl.removeFromQueue(0);
			
			if (this._enterStateEndQueue() == EnterResult.NOTENTER) {
				return MoveResult.END;
			}
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawFlowEntry: function() {
		StateEndControl.getCurrentStateEnd().drawStateEndEffect();
	}
});