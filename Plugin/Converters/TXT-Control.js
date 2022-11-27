var TxtControl = {
    listObjectsWithProperty: function(list, methodString) {
        var string = '';

        var i, count = list.getCount();
        var currentObject, property;

        var methods = methodString.split(".");
        var j, count2 = methods.length;

        var isValidMethod = function(object, method) {
            return eval("object" + method) != undefined;
        }

        for (i = 0; i < count; i++) {
            currentObject = list.getData(i);
            var isValid = true;

            var method = "";
            for (j = 0; j < count2; j++) {
                var method = method + "." + methods[j];
                if (!isValidMethod(currentObject, method)) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                string += currentObject.getName() + ": " + eval("currentObject" + method) + "\n";
            }
        }

        root.writeTestFile(string);
    }
}