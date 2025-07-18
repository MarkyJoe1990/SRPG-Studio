import { useState } from "react";

export default function BooleanField(key: number, fieldName: string | undefined, displayedName: string, description: string, defVal: boolean | undefined, isVisible: boolean) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState((defVal == undefined ? false : defVal).toString());

    return (
        <div key={key} className="input-field number-field" data-value={val} data-name={fieldName} data-is-invisible={!isVisible}>
            <label
                className="input-field-label"
                htmlFor={ inputName }>
                {displayedName}:
            </label>
            <input
                onChange={(event) => { setVal(event.currentTarget.checked ? "true": "false")}}
                defaultValue={val}
                type="checkbox"
                id={ inputName }>
            </input>
            <div className="field-description">{description}</div>
        </div>
    );
}