AttackEvaluator.StatInfluence = defineObject(BaseAttackEvaluator, {
	evaluateAttackEntry: function(virtualActive, virtualPassive, attackEntry) {
		//Take the EVs of the fallen unit. Add it to the winner's statInfluencerArray;
		var isFinish = attackEntry.isFinish;
		var passive = virtualPassive.unitSelf;
		var passiveClass = passive.getClass();
		var active = virtualActive.unitSelf;
		
		if (isFinish) {
			var passiveStatInfluencerArray = StatInfluencerControl.getStatInfluencerArray(passiveClass);
			var activeStatInfluencerArray = StatInfluencerControl.getStatInfluencerArray(active);
			var itemStatInfluencerArray = StatInfluencerControl.getAllItemStatInfluencerArrays(virtualActive, virtualPassive, attackEntry);
			
			var i, count = ParamGroup.getParameterCount();
			
			for (i = 0; i < count; i++) {
				activeStatInfluencerArray[i] += passiveStatInfluencerArray[i];
				activeStatInfluencerArray[i] += itemStatInfluencerArray[i];
			}
		}
	}
});