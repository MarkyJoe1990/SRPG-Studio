function OutputConverter (outputArray, layer) {
    var i;
    if (layer === undefined) {
        layer = 0;
    }

    var string = "{";
    var output, value, name, count = outputArray.length;
    for (i = 0; i < count; i++) {
        output = outputArray[i];
        if (output === undefined) {
            continue;
        }

        value = output.value;
        if (value === "") {
            continue;
        }

        name = output.name;
        string += name + ": " + value;
        if (i < count -1) {
            string += ",";
        }
    }

    string += "}";

    return string;
}

export default OutputConverter;