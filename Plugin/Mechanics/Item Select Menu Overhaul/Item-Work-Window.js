(function() {
    // Reprograms the ItemWorkWindow to contain commands that can be executed.
    ItemWorkWindow = defineObject(ItemWorkWindow, {
        getWorkIndex: function() {
            return this._scrollbar.getObject().getOriginalWorkIndex();
        },

        setItemWorkData: function(item) {
            var commandArray = [];
            var displayedCommandArray = [];
            this.configureCommands(commandArray);
            var unit = this.getParentInstance()._unit;

            var i, command, count = commandArray.length;
            for (i = 0; i < count; i++) {
                command = commandArray[i];
                command.setupCommand(unit, item, this.getParentInstance());
                if (command.isCommandDisplayable() === true) {
                    displayedCommandArray.push(command);
                }
            }

            this._scrollbar.setScrollFormation(1, displayedCommandArray.length);
            this._scrollbar.setObjectArray(displayedCommandArray);
        },

        configureCommands: function(groupArray) {
            groupArray.appendObject(ItemWorkCommand.Use);
            groupArray.appendObject(ItemWorkCommand.WeaponUse);
            groupArray.appendObject(ItemWorkCommand.Equip);
            groupArray.appendObject(ItemWorkCommand.Discard);
        }
    });
}) ();