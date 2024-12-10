( function () {
    ItemSelectMenuMode.COMMAND = 3;

    // ItemSelectMenuResult.USE
    // ItemSelectMenuResult.CANCEL
    // ItemSelectMenuResult.NONE
    ItemSelectMenuResult.END = 3;
    ItemSelectMenuResult.FREEACTION = 4;

    var alias1 = ItemSelectMenu.isWorkAllowed;
    ItemSelectMenu.isWorkAllowed = function(index) {
        if (index !== -1) {
            return alias1.call(this, index);
        }

        return this._itemWorkWindow._scrollbar.getObject().isWorkAllowed();
    }

    var alias2 = ItemSelectMenu._doWorkAction;
    ItemSelectMenu._doWorkAction = function(index) {
        if (index !== -1) {
            return alias2.call(this, index);
        }

        this._itemWorkWindow._scrollbar.getObject().openCommand();
        this.changeCycleMode(ItemSelectMenuMode.COMMAND);
        return ItemSelectMenuResult.NONE;
    }

    var alias3 = ItemSelectMenu.moveWindowManager;
    ItemSelectMenu.moveWindowManager = function() {
        var mode = this.getCycleMode();
        if (mode === ItemSelectMenuMode.COMMAND) {

            var commandResult = this._moveCommand();
            if (commandResult === ItemSelectMenuResult.CANCEL) {
                this.changeCycleMode(ItemSelectMenuMode.ITEMSELECT);
                this._forceSelectIndex = -1;
                this._itemListWindow.enableSelectCursor(true);
            } else if (commandResult === ItemSelectMenuResult.END) {
                this.changeCycleMode(ItemSelectMenuMode.ITEMSELECT);
                return ItemSelectMenuResult.END;
            } else if (commandResult === ItemSelectMenuResult.FREEACTION) {
                this.changeCycleMode(ItemSelectMenuMode.ITEMSELECT);
                return ItemSelectMenuResult.FREEACTION;
            }

            this._itemInfoWindow.moveWindow();
            return ItemSelectMenuResult.NONE;
        }

        return alias3.call(this);
    }

    // OVERWRITE
    var alias5 = UnitCommand.Item._moveTop;
    UnitCommand.Item._moveTop = function() {
        var item;
		var unit = this.getCommandTarget();
		var result = this._itemSelectMenu.moveWindowManager();
		
		if (result === ItemSelectMenuResult.USE) {
			item = this._itemSelectMenu.getSelectItem();
			this._itemSelection = ItemPackageControl.getItemSelectionObject(item);
			if (this._itemSelection !== null) {
				if (this._itemSelection.enterItemSelectionCycle(unit, item) === EnterResult.NOTENTER) {
					this._useItem();
					this.changeCycleMode(ItemCommandMode.USE);
				}
				else {
					this.changeCycleMode(ItemCommandMode.SELECTION);
				}
			}
		}
		else if (result === ItemSelectMenuResult.CANCEL) {
			// Rebuild the command. This is because the weapons equipped on the unit may have been changed or items may have been discarded.
			this.rebuildCommand();
			
			// If the item is discarded, it's supposed that action has occurred.
			if (this._itemSelectMenu.isDiscardAction()) {
				this.endCommandAction();
			}

			return MoveResult.END; // Cancels the action entirely unless player discarded an item.
		} else if (result === ItemSelectMenuResult.END) { // Additions from here.
            this.endCommandAction();
            return MoveResult.END; // Ends turn
        } else if (result === ItemSelectMenuResult.FREEACTION) {
            this.rebuildCommand();
            this.setExitCommand(this);
            return MoveResult.END; // Doesn't end turn.
        }
		
		return MoveResult.CONTINUE;
    }

    var alias4 = ItemSelectMenu.drawWindowManager;
    ItemSelectMenu.drawWindowManager = function() {
        alias4.call(this);

        var mode = this.getCycleMode();
        if (mode === ItemSelectMenuMode.COMMAND) {
            this._drawCommand();
        }
    }

    ItemSelectMenu._moveCommand = function() {
        return this._itemWorkWindow._scrollbar.getObject().moveCommand();
    }

    ItemSelectMenu._drawCommand = function() {
        return this._itemWorkWindow._scrollbar.getObject().drawCommand();
    }

}) ();
