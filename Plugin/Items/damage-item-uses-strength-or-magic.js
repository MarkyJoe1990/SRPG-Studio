/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin allows items with the "Damage" effect
	to factor the user's strength or magic stat into the damage
	formula.
	
	How to use:
	- Create an item with the effect "Damage"
	- Set the custom parameter "useStr" as true for physical attack
	- Set the custom parameter "useMag" as true for magical attack
	- Set both as true if you want to add both.
	- Done
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
