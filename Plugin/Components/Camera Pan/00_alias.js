( function () {
    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(CameraPanEvent);
    }

    var alias2 = PlayerTurn._drawMap;
    PlayerTurn._drawMap = function() {
        alias2.call(this);

        if (CameraPanConfig.enableDebug === true) {
            CameraPanControl.drawScrollBoundary();
        }
    }
}) ();