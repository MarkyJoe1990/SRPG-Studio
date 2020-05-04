/*
	Version 1.0
	Made by MarkyJoe1990
	
	This function removes the Resistence stat, and
	uses Magic to determine magical defenses instead.
	
	This plugin overrides the original functions for:
	
	* DamageCalculator.calculateDefense
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
*/

(function () {
	var alias1 = DamageCalculator.calculateDefense;
	DamageCalculator.calculateDefense = function (active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var def;
		
		if (this.isNoGuard(active, passive, weapon, isCritical, trueHitValue)) {
			return 0;
		}
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			// Physical attack or Bow attack.
			def = RealBonus.getDef(passive);
		}
		else {
			// Magic attack
			def = RealBonus.getMag(passive);
		}
		
		def += CompatibleCalculator.getDefense(passive, active, ItemControl.getEquippedWeapon(passive)) + SupportCalculator.getDefense(totalStatus);
		
		return def;
	}
	
	UnitParameter.MDF.isParameterDisplayable = function(unitStatusType) {
		return false;
	}
}) ();