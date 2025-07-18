import { ChangeEvent, useState } from "react";
import LooseObject from "./looseobject";

export default function FlagField(
    key: number,
    fieldName: string | undefined,
    displayedName: string,
    description: string,
    defVal: number | undefined,
    flagArray: Array<LooseObject>,
    isVisible: boolean
) {
    const inputName = fieldName + "-Input";
    const [val, setVal] = useState((defVal == undefined ? 0x00 : defVal));

    const getTotal = (event: ChangeEvent<HTMLInputElement>) => {
        var el = event.currentTarget;

        var parentEl = el.parentNode;
        if (parentEl == null) {
            return 0;
        }

        parentEl = parentEl.parentNode;
        if (parentEl == null) {
            return 0;
        }

        var allInputEls = parentEl.querySelectorAll("input");
        var i, currentEl, currentVal, currentInt, count = allInputEls.length;
        var finalNum = 0;
        for (i = 0; i < count; i++) {
            currentEl = allInputEls[i];
            if (currentEl.checked == true) {
                currentVal = currentEl.dataset.value;
                if (currentVal == undefined) {
                    continue;
                }

                currentInt = parseInt(currentVal);
                if (isNaN(currentInt)) {
                    continue
                }

                finalNum |= currentInt;
            }
        }
        
        return finalNum;
    }

    const inputArray = flagArray.map((element, index) => (
        <div key={(key * 1000) + index}>
            <label
                htmlFor={element.displayedName + " of " + fieldName}
                className="input-field-label"
            >{element.displayedName}
            </label>
            <input
                onChange={(event) => { setVal(getTotal(event))}}
                id={element.displayedName + " of " + fieldName}
                type="checkbox"
                data-value={element.value}
            ></input>
        </div>
    ));

    return (
        <div key={key} className="input-field flag-field" data-value={val} data-name={fieldName} data-is-invisible={!isVisible}>
            <label
                className="input-field-label"
                htmlFor={ inputName }>
                {displayedName}:
            </label>
            <div className="field-description">{description}</div>
            {inputArray}
        </div>
    );
}