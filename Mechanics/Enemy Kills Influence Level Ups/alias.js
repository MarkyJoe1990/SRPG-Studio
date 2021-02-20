( function () {
	var alias1 = ExperienceControl._createGrowthArray;
	ExperienceControl._createGrowthArray = function (unit) {
		var growthArray = alias1.call(this, unit);
		var statInfluencerArray = StatInfluencerControl.getStatInfluencerArray(unit);
		var i, count = ParamGroup.getParameterCount();
		
		for (i = 0; i < count; i++) {
			while (statInfluencerArray[i] >= 100) {
				growthArray[i] += 1;
				statInfluencerArray[i] -= 100;
			}
		}
		
		return growthArray;
	}
	
	var alias2 = NormalAttackOrderBuilder._configureEvaluator;
	NormalAttackOrderBuilder._configureEvaluator = function(groupArray) {
		alias2.call(this, groupArray);
		
		groupArray.appendObject(AttackEvaluator.StatInfluence);
	}
}) ();