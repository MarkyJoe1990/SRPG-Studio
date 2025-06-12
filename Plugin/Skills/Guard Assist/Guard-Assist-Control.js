var GuardAssistControl = {
    getGuardUnit: function(unit) {
        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, 1);
        var unitType = unit.getUnitType();
        var filterFlag = UnitFilterFlag.PLAYER | UnitFilterFlag.ALLY;

        var i, index, x, y, targetUnit, weapon, count = indexArray.length;
        for (i = 0; i < count; i++) {
            index = indexArray[i];
            x = CurrentMap.getX(index);
            y = CurrentMap.getY(index);

            targetUnit = PosChecker.getUnitFromPos(x, y);
            // Cancel if unit not found
            if (targetUnit == null) {
                continue;
            }

            // Cancel if unit not same affiliation
            if (FilterControl.isBestUnitTypeAllowed(unitType, targetUnit.getUnitType(), filterFlag) !== true) {
                continue;
            }

            weapon = ItemControl.getEquippedWeapon(targetUnit);
            if (weapon == null) {
                continue;
            }

            // Cancel if unit lacks guard skill
            if (SkillControl.getPossessionCustomSkill(targetUnit, GuardAssistConfig.skillName) == null) {
                continue;
            }

            // Cancel if unit doesn't have enough HP
            if (targetUnit.getHp() <= (RealBonus.getMhp(targetUnit) >> 1)) {
                continue;
            }

            // Cancel if guard unit is unable to act due to status effect
            if (this._isValidState(targetUnit, weapon) !== true) {
                continue;
            }

            return targetUnit;
        }

        return null;
    },

    swapUnits: function(srcUnit, destUnit) {
        var destX = destUnit.getMapX();
        var destY = destUnit.getMapY();

        var srcX = srcUnit.getMapX();
        var srcY = srcUnit.getMapY();

        srcUnit.setMapX(destX);
        srcUnit.setMapY(destY);

        destUnit.setMapX(srcX);
        destUnit.setMapY(srcY);
    },

    getGuardData: function(unit) {
        return unit.custom.guardData;
    },

    saveGuardData: function(guardUnit, guardedUnit) {
        var obj = {
            guardedUnit: guardedUnit,
            x: guardUnit.getMapX(),
            y: guardUnit.getMapY()
        };

        guardUnit.custom.guardData = obj;
    },

    resetGuardData: function(guardUnit) {
        guardUnit.custom.guardData = null;
    },

    _isValidState: function(unit, weapon) {
        var turnStateList = unit.getTurnStateList();
        var i, turnState, state, option, count = turnStateList.getCount();
        var isPhysicalWeapon = weapon.getWeaponCategoryType() !== WeaponCategoryType.MAGIC;

        for (i = 0; i < count; i++) {
            turnState = turnStateList.getData(i);
            state = turnState.getState();
            option = state.getBadStateOption();

            // If sleep, berserk or auto AI, cancel.
            if (option === BadStateOption.NOACTION || option === BadStateOption.BERSERK || option === BadStateOption.AUTO) {
				return false;
			}

            // If equipped weapon is physical and physical weapons are disabled, cancel
            if (isPhysicalWeapon === true && StateControl.isBadStateFlag(unit, BadStateFlag.PHYSICS) === true) {
				return false;
			}

            // If equipped weapon is magical and magical weapons are disabled, cancel
            if (isPhysicalWeapon !== true && StateControl.isBadStateFlag(unit, BadStateFlag.MAGIC) === true) {
                return false;
            }
        }

        return true;
    }
};