import { useState } from "react";
import LooseObject from "../objects/looseobject";
import InputField from "./inputfield";

export default function ArrayField(key: number, fieldName: string | undefined, displayedName: string, elementData: LooseObject) {
    const inputName = fieldName + "-Input";
    const [fields, setFields] = useState<LooseObject[]>([]);
    function addField() {
        setFields([...(fields as LooseObject[]), elementData]);
    }

    return (
        <div key={key} className="input-field array-field" data-value={fields.length} data-name={fieldName}>
            <label
                htmlFor={ inputName }>
                {displayedName}
            </label>:
            <button type="button" onClick={addField}>Add</button>
            <div>
                {fields.map((entry: LooseObject, index: number) => <InputField></InputField>)}
            </div>
        </div>
    );
}