import NumberField from "./numberfield";
import TextField from "./textfield";
import NullField from "./nullfield";

import LooseObject from "../objects/looseobject";
import BooleanField from "./booleanfield";
import DropdownField from "./dropdownfield";
import ArrayField from "./arrayfield";

export default function InputField(key: number, data: LooseObject) {
    const type: string = data.type;

    if (type == "number") {
        return NumberField(key, data.fieldName, data.displayedName, data.default, data.min, data.max);
    }

    if (type == "boolean") {
        return BooleanField(key, data.fieldName, data.displayedName, data.default);
    }

    if (type == "dropdown") {
        return DropdownField(key, data.fieldName, data.displayedName, data.defaultIndex, data.options);
    }

    if (type == "array") {
        return ArrayField(key, data.fieldName, data.displayedName, data.elementData);
    }

    if (type == "text") {
        return TextField(key, data.fieldName, data.displayedName, data.default);
    }

    return NullField(key, data.fieldName, data.displayedName);
}