var GuardAssistStartFlow = defineObject(BaseFlowEntry, {
    enterFlowEntry: function(preAttack) {
        var targetUnit = preAttack.getAttackParam().targetUnit;
        var guardData = GuardAssistControl.getGuardData(targetUnit);
        if (guardData != null) {
            targetUnit.setMapX(guardData.guardedUnit.getMapX());
            targetUnit.setMapY(guardData.guardedUnit.getMapY());
        }

        return EnterResult.NOTENTER;
    }
});

var GuardAssistEndFlow = defineObject(BaseFlowEntry, {
    enterFlowEntry: function(preAttack) {
        var targetUnit = preAttack.getAttackParam().targetUnit;
        var guardData = GuardAssistControl.getGuardData(targetUnit);
        if (guardData != null) {
            targetUnit.setMapX(guardData.x);
            targetUnit.setMapY(guardData.y);
        }

        GuardAssistControl.resetGuardData(targetUnit);

        return EnterResult.NOTENTER;
    }
});

( function() {
    var alias1 = PreAttack._pushFlowEntriesStart;
    PreAttack._pushFlowEntriesStart = function(straightFlow) {
        straightFlow.pushFlowEntry(GuardAssistStartFlow);
        alias1.call(this, straightFlow);
    }

    var alias2 = PreAttack._pushFlowEntriesEnd;
    PreAttack._pushFlowEntriesEnd = function(straightFlow) {
        alias2.call(this, straightFlow);
        straightFlow.pushFlowEntry(GuardAssistEndFlow);
    }
}) ();