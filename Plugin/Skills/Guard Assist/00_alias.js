( function () {
    // PLAYER SIDE FUNCTIONALITY
    // Record type of PosSelector this is
    var alias1 = PosMenu.createPosMenuWindow;
    PosMenu.createPosMenuWindow = function(unit, item, type) {
        alias1.call(this, unit, item, type);
        this._type = type;
    }

    var alias2 = PosSelector.setPosOnly;
    PosSelector.setPosOnly = function(unit, item, indexArray, type) {
        alias2.call(this, unit, item, indexArray, type);
        this._type = type;
    }

    var alias3 = PosSelector.setUnitOnly;
    PosSelector.setUnitOnly = function(unit, item, indexArray, type, filter) {
        alias3.call(this, unit, item, indexArray, type, filter);
        this._type = type;
    }

    // Grab guard unit instead of intended target.
    var alias4 = PosSelector.getSelectorTarget;
    PosSelector.getSelectorTarget = function(isIndexArray) {
        var unit = alias4.call(this, isIndexArray);

        if (unit != null && this._type === PosMenuType.Attack) {
            var guardUnit = GuardAssistControl.getGuardUnit(unit);
            if (guardUnit != null) {
                GuardAssistControl.saveGuardData(guardUnit, unit);
                return guardUnit;
            }
        }

        return unit;
    }

    // When hovering away from target with adjacent
    // guarding unit, reset the guard data of that
    // guarding unit.
    var alias5 = PosSelector.setNewTarget;
    PosSelector.setNewTarget = function() {
        // get previous target and reset their info.
        var prevTarget = this._posMenu._currentTarget;
        if (prevTarget != null) {
            var guardData = GuardAssistControl.getGuardData(prevTarget);
            if (guardData != null) {
                prevTarget.setMapX(guardData.x);
                prevTarget.setMapY(guardData.y);

                GuardAssistControl.resetGuardData(prevTarget);
            }
        }

        alias5.call(this);
    }

    // The code is separate from setNewTarget
    // due to order of operations problems. The
    // unit needs to be moved before their battle
    // calcs are done, so the results are accurate.
    var alias6 = PosMenu.changePosTarget;
    PosMenu.changePosTarget = function(targetUnit) {
        if (targetUnit != null) {
            var guardData = GuardAssistControl.getGuardData(targetUnit);
            if (guardData != null) {
                var guardedUnit = guardData.guardedUnit;
                targetUnit.setMapX(guardedUnit.getMapX());
                targetUnit.setMapY(guardedUnit.getMapY());
            }
        }

        alias6.call(this, targetUnit);
    }

    // Reset guarding unit's position
    // when canceling out of pos selection.
    var alias7 = PosSelector.movePosSelector;
    PosSelector.movePosSelector = function() {
        var result = alias7.call(this);

        if (result !== PosSelectorResult.NONE) {
            var unit = this._posMenu._currentTarget;
            if (unit != null) {
                var guardData = GuardAssistControl.getGuardData(unit);
                if (guardData != null) {
                    unit.setMapX(guardData.x);
                    unit.setMapY(guardData.y);

                    if (result === PosSelectorResult.CANCEL) {
                        GuardAssistControl.resetGuardData(unit);
                    }
                }
            }
        }

        return result;
    }

    // POSMENU DRAWING FUNCTIONALITY
    var alias9 = PosAttackWindow.drawWindowContent;
	PosAttackWindow.drawWindowContent = function(x, y) {
		var dx = x;

		x += this.getInfoWidth() - 20;
		this._drawGuardedUnit(x, y);

		x = dx;

		alias9.call(this, x, y);
	}

	PosAttackWindow._guardedUnit = null;
	PosAttackWindow._drawGuardedUnit = function(x, y) {
        if (this._unit == null) {
            return;
        }

        var guardData = GuardAssistControl.getGuardData(this._unit);
        if (guardData == null) {
            return;
        }

		var unit = guardData.guardedUnit;
		
		if (unit !== null) {
			y += 20;
			var unitRenderParam = StructureBuilder.buildUnitRenderParam();
			unitRenderParam.alpha = 128;
			unitRenderParam.colorIndex = unit.getUnitType();
			unitRenderParam.handle = unit.getCharChipResourceHandle();

			UnitRenderer.drawDefaultUnit(unit, x, y, unitRenderParam);
		}
	}

	// WARNING. May not work if you have a plugin
    // that overrides this function such as unit
    // char chip battle preview animation.
	var alias10 = PosAttackWindow.drawUnit;
	PosAttackWindow.drawUnit = function(x, y) {
        if (this._unit == null) {
            return;
        }

        var guardData = GuardAssistControl.getGuardData(this._unit);
        if (guardData != null) {
            x += 3;
        }

		alias10.call(this, x, y)
	}

    // Enemy functionality
    var alias12 = WeaponAutoAction.setAutoActionInfo;
    WeaponAutoAction.setAutoActionInfo = function(unit, combination) {
        alias12.call(this, unit, combination);

        var targetUnit = this._targetUnit;
        var guardUnit = GuardAssistControl.getGuardUnit(targetUnit);
        if (guardUnit != null) {
            GuardAssistControl.saveGuardData(guardUnit, targetUnit);
            this._targetUnit = guardUnit;
        }
    }

    var alias13 = WeaponAutoAction._changeCursorShow;
    WeaponAutoAction._changeCursorShow = function() {
        var guardData = GuardAssistControl.getGuardData(this._targetUnit);
        if (guardData != null) {
            var guardedUnit = guardData.guardedUnit;
            this._autoActionCursor.setAutoActionPos(guardedUnit.getMapX(), guardedUnit.getMapY(), true);
            this._targetUnit.setMapX(guardedUnit.getMapX());
            this._targetUnit.setMapY(guardedUnit.getMapY());
            return;
        }

        alias13.call(this);
    }
}) ();