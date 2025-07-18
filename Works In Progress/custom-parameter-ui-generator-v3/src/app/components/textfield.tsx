import { useState } from "react";

export default function TextField(key: number, fieldName: string, displayedName: string | undefined, defVal: string | undefined) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState("\"" + (defVal == undefined ? "" : defVal) + "\"");

    return (
        <div key={key} className="input-field text-field" data-value={val} data-name={fieldName}>
            <label
                htmlFor={ inputName }>
                {displayedName}
            </label>: 
            <input
                onChange={(event) => { setVal("\"" + event.currentTarget.value + "\"")}}
                defaultValue={(defVal == undefined ? "" : defVal)}
                type="text"
                id={ inputName }>
            </input>
        </div>
    );
}