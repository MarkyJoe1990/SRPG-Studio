var ItemWorkCommand = defineObject(BaseListCommand, {
    getItemWorkWindow: function() {
        return this._itemWorkWindow;
    },

    getItemSelectMenu: function() {
        return this.getItemWorkWindow().getParentInstance();
    },

    getCommandTarget: function() {
        // Get Item Work Window -> Get Item Select Menu -> unit
        return this._unit;
    },

    getCommandItem: function() {
        return this._item;
    },

    getOriginalWorkIndex: function() {
        return -1;
    },

    isWorkEnabled: function() {
        return true;
    },

    setupCommand: function(unit, item, itemWorkWindow) {
        this._unit = unit;
        this._item = item;
        this._itemWorkWindow = itemWorkWindow;
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