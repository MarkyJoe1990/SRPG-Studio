import NumberField from "./numberfield";
import TextField from "./textfield";
import NullField from "./nullfield";

import LooseObject from "../objects/looseobject";
import BooleanField from "./booleanfield";
import DropdownField from "./dropdownfield";
import ArrayField from "./arrayfield";
import ObjectField from "./objectfield";
import FlagField from "./flagfield";

export default function InputField(
    key: number,
    data: LooseObject,
    isVisible: boolean
) {
    const type: string = data.type;

    if (type == "number") {
        return NumberField(key, data.fieldName, data.displayedName, data.description, data.default, data.min, data.max, isVisible);
    }

    if (type == "boolean") {
        return BooleanField(key, data.fieldName, data.displayedName, data.description, data.default, isVisible);
    }

    if (type == "dropdown") {
        return DropdownField(key, data.fieldName, data.displayedName, data.description, data.defaultIndex, data.options, isVisible);
    }

    if (type == "array") {
        return ArrayField(key, data.fieldName, data.displayedName, data.description, data.elementData, isVisible);
    }

    if (type == "object") {
        return ObjectField(key, data.fieldName, data.displayedName, data.description, data.propArray, isVisible);
    }

    if (type == "flag") {
        return FlagField(key, data.fieldName, data.displayedName, data.description, data.defVal, data.flagArray, isVisible)
    }

    if (type == "text") {
        return TextField(key, data.fieldName, data.displayedName, data.description, data.default, isVisible);
    }

    return NullField(key, data.fieldName, data.displayedName, data.description, isVisible);
}