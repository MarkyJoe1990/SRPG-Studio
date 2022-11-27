/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin adds the "Accost" skill from Fire Emblem: Thracia 776.
	If the user's HP is higher than 50%, they will go a second round
	of combat against their target.
	
	It's not quite perfectly accurate, however. Particularly, the
	ordering of attacks:
	
	If you initiate combat, the order is:
	- You, Them, You, Them, then you two more times if you double
	
	If the enemy initiates combat, the order is:
	- Them, You, Them, You, then you two more times if you double
	
	Another issue is that Accost activates based on what your HP
	was at the start of the battle. If the enemy lowers it below
	this threshold, Accost will still activate. Conversely, if
	you start the battle below 50%, Accost will not activate even
	if you heal mid-battle.
	
*/

(function () {
	var alias1 = Calculator.calculateRoundCount;
	Calculator.calculateRoundCount = function(active, passive, weapon) {
		var atkCnt = alias1.call(this, active, passive, weapon);
		
		activeSkill = SkillControl.getPossessionCustomSkill(active, "Accost");
		passiveSkill = SkillControl.getPossessionCustomSkill(passive, "Accost");
		
		if (activeSkill != null && active.getHp() >= Math.floor(active.getParamValue(ParamType.MHP) / 2)) {
			return atkCnt * 2;
		}
		if (passiveSkill != null && passive.getHp() >= Math.floor(passive.getParamValue(ParamType.MHP) / 2)) {
			return atkCnt * 2;
		}
		
		return atkCnt;
	}
}) ();