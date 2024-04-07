(function() {
	var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
	SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		
		if (keyword === 'Never-First') {
			return this._isSkillInvokedInternal(active, passive, skill);
		}
		
		return alias1.call(this, active, passive, skill, keyword);
	}
	
	var alias2 = NormalAttackOrderBuilder._isDefaultPriority;
	NormalAttackOrderBuilder._isDefaultPriority = function (virtualActive, virtualPassive) {
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var skilltype = SkillType.FASTATTACK;
		var skill = SkillControl.getPossessionCustomSkill(active, "Never-First");
		var prevResult = alias2.call(this, virtualActive, virtualPassive);
		
		if (SkillRandomizer.isCustomSkillInvoked(active, passive, skill, "Never-First")) {
			return false;
		}
		return prevResult;
	}
}) ();