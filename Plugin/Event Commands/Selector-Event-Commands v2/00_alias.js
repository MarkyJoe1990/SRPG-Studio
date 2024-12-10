( function () {
    //Adds our event object to the list of custom events
    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(SelectorEventCommand);
    };

    var alias2 = SetupControl.setup;
    SetupControl.setup = function() {
        alias2.call(this);
        SelectorEventControl.init();
    }

    var alias3 = StructureBuilder.buildDataList;
    StructureBuilder.buildDataList = function() {
        var dataList = alias3.call(this);

        dataList.getDataFromId = function(id) {
            var i, currentObject, count = this._arr.length;
            for (i = 0; i < count; i++) {
                currentObject = this.getData(i);

                if (currentObject.getId() === id) {
                    return currentObject;
                }
            }

            return null;
        }

        return dataList;
    }
}) ();