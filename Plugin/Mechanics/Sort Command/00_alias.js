( function () {
    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.insertObject(UnitCommand.Sort, groupArray.length - 3);
    }
}) ();