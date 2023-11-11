var ObjectPrinterControl = {
    printObject: function(object, tabLevel) {
        if (object == null) {
            return;
        }

        if (tabLevel == undefined) {
            tabLevel = 0;
        }

        var i;
        var tabString = "";
        for (i = 0; i < tabLevel; i++) {
            tabString += "   ";
        }

        root.log(tabString + "{")

        for (parameter in object) {
            switch (this._checkType(object[parameter])) {
                case "object":
                    root.log(tabString + parameter + ": ")

                    this.printObject(object[parameter], tabLevel + 1);

                    break;
                case "string":
                    root.log(tabString + parameter + ": \"" + object[parameter] + "\"");
                    break;
                case "null":
                    root.log(tabString + parameter + ": Null");
                    break;
                case "array":
                    root.log(tabString + parameter + ": ");

                    this._printArray(object[parameter], tabLevel + 1);
                    break;
                default:
                    root.log(tabString + parameter + ": " + object[parameter]);
                    break;
            }
        }

        root.log(tabString + "}")
    },

    _printArray: function(arr, tabLevel) {
        if (arr == null) {
            return;
        }

        if (tabLevel == undefined) {
            tabLevel = 0;
        }

        var i;
        var tabString = "";
        for (i = 0; i < tabLevel; i++) {
            tabString += "   ";
        }

        var count = arr.length;
        for (i = 0; i < count; i++) {
            switch (this._checkType(arr[i])) {
                case "object":
                    root.log(tabString + "[" + i + "]: ")

                    this.printObject(arr[i], tabLevel + 1);

                    break;
                case "string":
                    root.log(tabString + "[" + i + "]: \"" + arr[i] + "\"");
                    break;
                case "null":
                    root.log(tabString + "[" + i + "]: Null");
                    break;
                case "array":
                    root.log(tabString + "[" + i + "]: ");

                    this._printArray(arr[i], tabLevel + 1);
                    break;
                default:
                    root.log(tabString + "[" + i + "]: " + arr[i]);
                    break;
            }
        }
    },

    _checkType: function(value) {
        if (value === null) {
            return "null";
        }

        var result = typeof value;
        if (result == "object") {
            if (typeof value.length == "number") {
                return "array";
            }
        }

        return result;
    }
}