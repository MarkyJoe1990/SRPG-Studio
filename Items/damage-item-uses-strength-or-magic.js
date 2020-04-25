/*

*/

(function () {
	var alias1 = Calculator.calculateDamageItemPlus;
	Calculator.calculateDamageItemPlus = function(unit, targetUnit, item) {
		damage = alias1.call(this, unit, targetUnit, item);
		
		if (item.custom.useStr == true) {
			damage += unit.getParamValue(ParamType.POW);
		}
		if (item.custom.useMag == true) {
			damage += unit.getParamValue(ParamType.MAG);
		}
		
		return damage;
	}
}) (); 
