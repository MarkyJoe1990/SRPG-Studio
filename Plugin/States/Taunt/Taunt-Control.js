var TauntControl = {
    isTaunt: function (state) {
        if (state == null) {
            return false;
        }

        return state.custom.isTaunt === true;
    },

    isTaunted: function(unit) {
        var turnStateList = unit.getTurnStateList();
        var i, currentTurnState, currentState, count = turnStateList.getCount();
        for (i = 0; i < count; i++) {
            currentTurnState = turnStateList.getData(i);
            currentState = currentTurnState.getState();

            if (this.isTaunt(currentState)) {
                return true;
            }
        }

        return false;
    },

    getTauntState: function(unit) {
        var turnStateList = unit.getTurnStateList();
        var i, currentState, count = turnStateList.getCount();
        for (i = 0; i < count; i++) {
            currentState = turnStateList.getData(i);

            if (this.isTaunt(currentState)) {
                return currentState;
            }
        }

        return null;
    },

    checkTaunt: function(unit, targetUnit, state) {
        if (this.isTaunt(state)) {
            this.setTauntTarget(targetUnit, unit);
        }
    },

    setTauntTarget: function(unit, targetUnit) {
        if (targetUnit == null) {
            unit.custom.tauntTarget = -1;
        }

        unit.custom.tauntTarget = targetUnit.getId();
    },

    getTauntTargetId: function(unit) {
        return unit.custom.tauntTarget != undefined ? unit.custom.tauntTarget : -1;
    },

    isTauntTarget: function(unit, targetUnit) {
        return this.getTauntTargetId(unit) === targetUnit.getId();
    },

    getTauntScore: function() {
        return 700;
    }
}