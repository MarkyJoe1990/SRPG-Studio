import { useState } from "react";

export default function NumberField(key: number, fieldName: string, displayedName: string | undefined, defVal: number | undefined, min: number, max: number) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState((defVal == undefined ? min : defVal).toString());

    return (
        <div key={key} className="input-field number-field" data-value={val} data-name={fieldName}>
            <label
                htmlFor={ inputName }>
                {displayedName}
            </label>:
            <input
                onChange={(event) => { setVal(event.currentTarget.value)}}
                min={min}
                max={max}
                defaultValue={val}
                type="number"
                id={ inputName }>
            </input>
        </div>
    );
}