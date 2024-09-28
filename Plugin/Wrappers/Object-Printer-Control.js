/*
    ObjectPrinterControl
    v2.0 by MarkyJoe1990

    This prints/writes the properties and methods of any
    JavaScript Object you pass as an argument. This can
    be useful for troubleshooting and looking at the
    contents of a custom parameter object.

    Methods:
    ObjectPrinterControl.printObject(YOUR_OBJECT);
    Prints an object's contents to the console.

    ObjectPrinterControl.writeObject(YOUR_OBJECT);
    Writes an object's contents into srpg_log.txt
*/

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
    },

    writeObject: function(obj) {
        var string = "{\n"
        string += this._getObjectString(obj, 1) + "\n";
        string += "}";
        root.writeTestFile(string);
    },

    _getObjectString: function(obj, tabLevel) {
        var tabString = "";
        for (var i = 0; i < tabLevel; i++) {
            tabString += "\t";
        }

        var string = "";
        for (prop in obj) {
            switch (this._checkType(obj[prop])) {
                case "object":
                    string += tabString + prop + ": {\n" + this._getObjectString(obj[prop], tabLevel + 1) + tabString + "}\n";
                    break;
                case "string":
                    string += tabString + prop + ": " + obj[prop] + "\n";
                    break;
                case "null":
                    string += tabString + prop + ": " + "Null" + "\n";
                    break;
                case "array":
                    string += tabString + prop + ": [\n" + this._getArrayString(obj[prop], tabLevel + 1) + tabString + "]\n";
                    break;
                case "number":
                    string += tabString + prop + ": " + obj[prop] + "\n";
                    break;
            }
        }

        return string;
    },

    _getArrayString: function(arr, tabLevel) {
        var tabString = "";
        for (var i = 0; i < tabLevel; i++) {
            tabString += "\t";
        }

        var string = "";
        var i, count = arr.length;
        for (i = 0; i < count; i++) {
            switch (this._checkType(arr[i])) {
                case "object":
                    string += tabString + "[" + i + "]" + ": {\n" + this._getObjectString(arr[i], tabLevel + 1) + tabString + "}\n";
                    break;
                case "string":
                    string += tabString + "[" + i + "]" + ": " + arr[i] + "\n";
                    break;
                case "null":
                    string += tabString + "[" + i + "]" + ": " + "Null" + "\n";
                    break;
                case "array":
                    string += tabString + "[" + i + "]" + ": [\n" + this._getArrayString(arr[i], tabLevel + 1) + tabString + "]\n";
                    break;
                case "number":
                    string += tabString + "[" + i + "]" + ": " + arr[i] + "\n";
                    break;
            }
        }

        return string;
    }
}