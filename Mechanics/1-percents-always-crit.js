/*
	Version 1.0
	Made by MarkyJoe1990
	
	If you or the enemy has a 1% chance of landing a
	critical hit, they will automatically land it.
*/

(function () {
	var alias1 = AttackEvaluator.HitCritical.calculateCritical;
	AttackEvaluator.HitCritical.calculateCritical = function (virtualActive, virtualPassive, attackEntry) {
		var percent = CriticalCalculator.calculateCritical(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualActive.totalStatus, virtualPassive.totalStatus);
		
		if (percent == 1) {
			return true;
		}
		
		return alias1.call(this, virtualActive, virtualPassive, attackEntry);
	}
}) ();