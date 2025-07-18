import { useState } from "react";
import LooseObject from "../objects/looseobject";
import InputField from "./inputfield";

export default function ArrayField(
    key: number,
    fieldName: string | undefined,
    displayedName: string,
    description: string,
    elementData: LooseObject,
    isVisible: boolean
) {
    const inputName = fieldName + "-Input";
    const [showCount, setShowCount] = useState(0);
    const max = 10;

    var values: string = "[";
    const arr = (() => {
        var arr = []
        var i, field;

        for (i = 0; i < max; i++) {
            let obj = { ...elementData };
            obj.displayedName += "[" + i + "]";
            obj.fieldName += "(of " + fieldName + ")[" + i + "]";

            field = InputField((key * 1000) + i, obj, i < showCount);

            if (i < showCount) {
                values += field.props["data-value"];
                if (i < showCount - 1) {
                    values += ",";
                }
            }

            arr.push(field)
        }

        return arr;
    })();

    values += "]";

    return (
        <div key={key} className="input-field array-field" data-value={values} data-name={fieldName} data-is-invisible={!isVisible}>
            <span className="input-field-label">
                {displayedName}:
            </span>
            <div className="field-description">{description}</div>
            <button type="button" onClick={() => {
                var count = showCount - 1;
                if (count < 0) {
                    count = 0;
                }

                setShowCount(count);
            }}>-</button>
            <button type="button" onClick={() => {
                var count = showCount + 1;
                if (count > max) {
                    count = max;
                }

                setShowCount(count);
            }}>+</button>
            <div className="array-field-entries">
                {arr}
            </div>
        </div>
    );
}