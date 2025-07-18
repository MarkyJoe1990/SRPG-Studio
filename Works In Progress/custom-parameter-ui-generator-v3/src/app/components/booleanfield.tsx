import { useState } from "react";

export default function BooleanField(key: number, fieldName: string | undefined, displayedName: string, defVal: boolean | undefined) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState((defVal == undefined ? false : defVal).toString());

    return (
        <div key={key} className="input-field number-field" data-value={val} data-name={fieldName}>
            <label
                htmlFor={ inputName }>
                {displayedName}
            </label>:
            <input
                onChange={(event) => { setVal(event.currentTarget.checked ? "true": "false")}}
                defaultValue={val}
                type="checkbox"
                id={ inputName }>
            </input>
        </div>
    );
}