var HtmlControl = {

    writeHtml: function(content) {
        this.writeString('<html><head><title>Object List</title><style>td {border: solid black 1px;}</style></head><body>' + content + '</body></html>');
    },

    generateTable: function(fieldSetArray) {
        result = '';
        result += '<table><tbody>';

        var i, count = fieldSetArray.length;
        var fieldSet;
        for (i = 0; i < count; i++) {
            fieldSet = fieldSetArray[i];
            result += this.generateRow(fieldSet);
        }

        result += '</tbody></table>';
        return result;
    },

    generateRow: function(fieldSet) {
        var result = '';
        result += '<tr>';
        var i, count = fieldSet.length;
        var field;
        for (i = 0; i < count; i++) {
            field = fieldSet[i];
            result += this.generateColumn(field);
        }

        result += '</tr>';
        return result;
    },

    generateColumn: function(field) {
        var result = '';

        result += '<td>';
        result += field;
        result += '</td>';

        return result;
    },

    writeSkillTable: function() {
        var args = arguments;
        if (args.length == 0) {
            args = this.getSkillFields();
        }

        var skillList = root.getBaseData().getSkillList();
        this.writeObjectTable(skillList, args);
    },

    writeStateTable: function() {
        var args = arguments;
        if (args.length == 0) {
            args = this.getStateFields();
        }

        var skillList = root.getBaseData().getStateList();
        this.writeObjectTable(skillList, args);
    },

    writeObjectTable: function(objectList, args) {
        root.msg("Writing Table");

        var fieldSetArray = [this.generateFieldNames(args)];
        this.generateParameters(fieldSetArray, objectList, args);
        this.writeHtml(this.generateTable(fieldSetArray));

        root.msg("Writing Complete");
    },

    generateParameters: function(fieldSetArray, objectList, args) {
        var i, count = objectList.getCount();
        var j, count2 = args.length;
        var object, fieldSet, currentField;
        for (i = 0; i < count; i++) {
            object = objectList.getData(i);
            fieldSet = [];
            for (j = 0; j < count2; j++) {
                currentField = eval("object." + args[j]);
                fieldSet.push(currentField);
            }
            currentField = this.generateCustomParameters(object);
            fieldSet.push(currentField);
            fieldSetArray.push(fieldSet);
        }
    },

    generateFieldNames: function(args) {
        var i, count = args.length;
        var result = [];
        for (i = 0; i < count; i++) {
            result.push(args[i]);
        }
        result.push("<b>Custom Parameters</b>");

        return result;
    },

    generateCustomParameters: function(object) {
        var result = "<pre>";

        for (customParameter in object.custom) {
            result += customParameter + ": " + object.custom[customParameter] + "\n";
        }

        result += "</pre>";

        return result;
    },

    getSkillFields: function() {
        return ["getId()", "getName()", "getDescription()", "getCustomKeyword()"];
    },

    getStateFields: function() {
        return ["getId()", "getName()", "getDescription()", "getTurn()"];
    },

    writeString: function(content) {
        root.writeTestFile(content);
    }
}