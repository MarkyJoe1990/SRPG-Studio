import { useState } from "react";
import LooseObject from "../objects/looseobject";

export default function DropdownField(key: number, fieldName: string, displayedName: string | undefined, defIndex: number | undefined, options: Array<LooseObject>) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState(defIndex == undefined ? options[0].value : options[defIndex].value);

    const selectOptions = options.map((element, index, options) => {
        return (<option key={key + "-" + index} value={element.value}>{element.name}</option>)
    })

    return (
        <div key={key} className="input-field dropdown-field" data-value={val} data-name={fieldName}>
            <label
                htmlFor={ inputName }>
                {displayedName}
            </label>:
            <select
                onChange={(event) => { setVal(event.currentTarget.value)}}
                defaultValue={val}
                id={ inputName }>{selectOptions}
            </select>
        </div>
    );
}