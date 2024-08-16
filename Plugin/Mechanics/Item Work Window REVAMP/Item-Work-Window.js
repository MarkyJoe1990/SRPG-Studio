(function() {
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
                command.setupCommand(unit, item, this);
                if (command.isCommandDisplayable() === true) {
                    displayedCommandArray.push(command);
                }
            }

            this._scrollbar.setObjectArray(displayedCommandArray);
        },

        configureCommands: function(groupArray) {
            groupArray.appendObject(ItemWorkCommand.Equip);
            groupArray.appendObject(ItemWorkCommand.Use);
            groupArray.appendObject(ItemWorkCommand.Discard);
        }
    });
}) ();