var ItemWorkCommand = defineObject(BaseListCommand, {
    // Allows you to grab every window related to the Item
    // Select Menu, such as the Select Window, Info Window
    // and work window.
    getItemSelectMenu: function() {
        return this._itemSelectMenu;
    },

    // Item Work Window usually only has "Use", "Equip" and "Discard" in it,
    // but is revamped to now contain commands.
    getItemWorkWindow: function() {
        return this.getItemSelectMenu()._itemWorkWindow;
    },

    // The Selection Window. If your custom command requires you
    // to select other items with the current one, such as a
    // theoretical "Swap" command, this might be handy.
    getItemListWindow: function() {
        return this.getItemSelectMenu()._itemListWindow;
    },

    // The window containing info about the item. I don't
    // recommend ever messing with this.
    getItemInfoWindow: function() {
        return this.getItemSelectMenu()._itemInfoWindow;
    },

    // Grabs the current unit executing the Item Command.
    getCommandTarget: function() {
        return this._unit;
    },

    // Grabs the currently selected item.
    getCommandItem: function() {
        return this._item;
    },

    // Only used when running the Item Select Menu's
    // already built-in functions such as Use, Equip
    // and Discard. You likely will never need this.
    getOriginalWorkIndex: function() {
        return -1;
    },

    // The return value is very unique compared to
    // other move/draw objects. It returns an
    // Enumeration called ItemSelectMenuResult.
    // Normally, it only has three results, but this
    // plugin expands it to five.

    // ItemSelectMenuResult.CANCEL: Default. Ends the command, treating it as though you did nothing.
    // ItemSelectMenuResult.NONE: Continues running the command.
    // ItemSelectMenuResult.USE: Do not use this. It's specifically useful for the default commands.
    // ItemSelectMenuResult.END: Ends the command, then ends the unit's turn.
    // ItemSelectMenuResult.FREEACTION. Ends the command. Unit can do follow up actions, but this ends their turn. Similar to the Trade command.
    moveCommand: function() {
        return ItemSelectMenuResult.CANCEL;
    },

    // Determines if the command is usable.
    // If not, the command is greyed out.
    isWorkAllowed: function() {
        return true;
    },

    // Never touch this. It's only needed to make
    // fetching certain objects easy, such as the
    // item Select Menu, the current unit and the
    // current item.
    setupCommand: function(unit, item, itemSelectMenu) {
        this._unit = unit;
        this._item = item;
        this._itemSelectMenu = itemSelectMenu;
    }
});

ItemWorkCommand.Equip = defineObject(ItemWorkCommand, {
    isCommandDisplayable: function() {
        var unit = this.getCommandTarget();
        var item = this.getCommandItem();

        if (item.isWeapon() !== true) {
            return false;
        }

        return ItemControl.isWeaponAvailable(unit, item);
    },

    getOriginalWorkIndex: function() {
        return 0;
    },

    getCommandName: function() {
        return StringTable.ItemWork_Equipment;
    }
});

ItemWorkCommand.Use = defineObject(ItemWorkCommand, {
    isCommandDisplayable: function() {
        var unit = this.getCommandTarget();
        var item = this.getCommandItem();

        if (item.isWeapon() === true) {
            return false;
        }

        return ItemControl.isItemUsable(unit, item);
    },

    getOriginalWorkIndex: function() {
        return 0;
    },

    getCommandName: function() {
        return StringTable.ItemWork_Use;
    }
});

ItemWorkCommand.Discard = defineObject(ItemWorkCommand, {
    isCommandDisplayable: function() {
        return !this.getCommandItem().isImportance();
    },

    getOriginalWorkIndex: function() {
        return 1;
},

    getCommandName: function() {
        return StringTable.ItemWork_Discard;
    }
});

/*
    Mode 0 = None
    Mode 1 = Selection
    Mode 2 = Use
*/

ItemWorkCommand.WeaponUse = defineObject(ItemWorkCommand, {
    openCommand: function() {
        var referenceItem = this._getReferenceItem();
        var unit = this.getCommandTarget();
        this._freeAction = this.getCommandItem().custom.freeAction === true;
        this._itemSelection = ItemPackageControl.getItemSelectionObject(referenceItem);
        if (this._itemSelection !== null) {
            if (this._itemSelection.enterItemSelectionCycle(unit, referenceItem) === EnterResult.NOTENTER) {
                this._useItem();
                this.changeCycleMode(2); // Use
            }
            else {
                this.changeCycleMode(1); // Selection
            }
        }

        this.getItemWorkWindow().enableWindow(false);
        this.getItemInfoWindow().enableWindow(false);
        this.getItemListWindow().enableWindow(false);
    },

    moveCommand: function() {
        var mode = this.getCycleMode();
        
        if (mode === 0) {
            return ItemSelectMenuResult.CANCEL;
        } else if (mode === 1) {
            if (this._moveSelection() === ItemSelectMenuResult.CANCEL) {
                this.getItemWorkWindow().enableWindow(true);
                this.getItemInfoWindow().enableWindow(true);
                this.getItemListWindow().enableWindow(true);
                return ItemSelectMenuResult.CANCEL;
            };
        } else if (mode === 2) {
            return this._moveUse();
        }

        return ItemSelectMenuResult.NONE;
    },

    _moveSelection: function() {
		if (this._itemSelection.moveItemSelectionCycle() !== MoveResult.CONTINUE) {
			if (this._itemSelection.isSelection()) {
				this._useItem();
				this.changeCycleMode(2);
			}
			else {
                return ItemSelectMenuResult.END;
			}
		}
		
		return ItemSelectMenuResult.NONE;
    },

    _moveUse: function() {
		if (this._itemUse.moveUseCycle() !== MoveResult.CONTINUE) {
            if (this._freeAction === true) {
                this.getItemWorkWindow().enableWindow(true);
                this.getItemInfoWindow().enableWindow(true);
                this.getItemListWindow().enableWindow(true);
                return ItemSelectMenuResult.FREEACTION;
            }

			return ItemSelectMenuResult.END;
		}
		
		return ItemSelectMenuResult.NONE;
    },

    _drawUse: function() {
		this._itemUse.drawUseCycle();
	},

    _drawSelection: function() {
		this._itemSelection.drawItemSelectionCycle();
	},

    drawCommand: function() {
        var mode = this.getCycleMode();
        if (mode === 1 ) {
            this._drawSelection();
        } else if (mode === 2) {
            this._drawUse();
        }
    },

	_useItem: function() {
		var itemTargetInfo;
		var referenceItem = root.duplicateItem(this._getReferenceItem());
		
		this._itemUse = ItemPackageControl.getItemUseParent(referenceItem);
        this._itemUse.disableItemDecrement();
		itemTargetInfo = this._itemSelection.getResultItemTargetInfo();

        this._decrementItem();
		
		itemTargetInfo.unit = this.getCommandTarget();
		itemTargetInfo.item = referenceItem;
		itemTargetInfo.isPlayerSideCall = true;
		this._itemUse.enterUseCycle(itemTargetInfo);
	},

    _decrementItem: function() {
        var item = this.getCommandItem();
        if (item.getLimitMax() === 0) {
            return;
        }

        var limit = item.getLimit();
        if (limit === WeaponLimitValue.BROKEN) {
            return;
        }

        var durabilityCost = item.custom.durabilityCost;
        if (durabilityCost == undefined) {
            durabilityCost = 1;
        }

        if (durabilityCost === 0) {
            return;
        }


        var newLimit = limit - (durabilityCost - 1);
        item.setLimit(newLimit);

        ItemControl.decreaseItem(this.getCommandTarget(), item);
    },

    isCommandDisplayable: function() {
        var item = this.getCommandItem();
        if (item.isWeapon() !== true) {
            return false;
        }

        var unit = this.getCommandTarget();
        if (ItemControl.isWeaponAvailable(unit, item) !== true) {
            return false;
        }

        var referenceItem = this._getReferenceItem();
        if (referenceItem == null) {
            return false;
        }

        return true;
    },

    isWorkAllowed: function() {
        var unit = this.getCommandTarget();
        var referenceItem = this._getReferenceItem();

        if (ItemControl.isItemUsable(unit, referenceItem) !== true) {
			return false;
		}

        var obj = ItemPackageControl.getItemAvailabilityObject(referenceItem);
		if (obj === null) {
			return false;
		}
		
		return obj.isItemAvailableCondition(unit, referenceItem);
    },

    _getReferenceItem: function() {
        var item = this.getCommandItem();
        var itemReferenceId = item.custom.itemReferenceId;
        if (itemReferenceId == undefined) {
            return null;
        }

        return root.getBaseData().getItemList().getDataFromId(itemReferenceId);
    },

    getCommandName: function() {
        return StringTable.ItemWork_Use;
    }
});