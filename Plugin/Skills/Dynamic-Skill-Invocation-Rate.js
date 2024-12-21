/*
    Version 1.0
    Created by MarkyJoe1990

    This plugin allows you to set a skill invocation rate to
    be whatever you want, with any criteria you want.

    How to use:
    - Put this file in your plugins folder.
    - Go to your desired skill in the database
    - Click "Custom Parameters"
    - Add a property called "invocationRate"
    - For a flat number, just set its value to a number
    - However, to truly utilize the potential of this plugin, you might
        want to use a function instead.
    - The function will need the arguments of attacker (AKA active), defender (AKA passive), and the skill in question.
    - The return value should be your activation rate, which should be a number between 0 and 100.
    - Here's an example of how this should all look. This returns an activation rate that is
        - (Attacker's Speed - Defender's Speed + (Attacker's HP / 2))
    {
        invocationRate: function(active, passive, skill) {
            var activeAgi = AbilityCalculator.getAgility(active, ItemControl.getEquippedWeapon(active));
            var passiveAgi = AbilityCalculator.getAgility(passive, ItemControl.getEquippedWeapon(passive));
            var hp = active.getHp();

            return activeAgi - passiveAgi + Math.floor(hp / 2);
        }
    }
*/

( function () {
    var alias1 = SkillRandomizer._isSkillInvokedInternal;
    SkillRandomizer._isSkillInvokedInternal = function(active, passive, skill) {
        if (!skill.getTargetAggregation().isCondition(passive)) {
			return false;
		}
		
		// If the opponent can disable the skill, don't activate the skill.
		if (SkillControl.getBattleSkillFromFlag(passive, active, SkillType.INVALID, InvalidFlag.SKILL) !== null) {
			return false;
		}

        var invocationRate = skill.custom.invocationRate;
        var invocationRateType = typeof invocationRate;
        if (invocationRateType == "number") {
            return Probability.getInvocationProbability(active, InvocationType.ABSOLUTE, invocationRate);
        } else if (invocationRateType == "function") {
            return Probability.getInvocationProbability(active, InvocationType.ABSOLUTE, invocationRate(active, passive, skill));
        }

        return alias1.call(this, active, passive, skill);
    }
}) ();
