import InputField from "./inputfield";

export default function ObjectField(
    key: number,
    fieldName: string | undefined,
    displayedName: string,
    description: string,
    propArray: Array<any>,
    isVisible: boolean
) {
    const inputName = fieldName + "-Input";

    var values: string = "{";
    var arr = (() => {
        var arr = [];
        var count = propArray.length;
        var i, field;

        for (i = 0; i < count; i++) {
            let obj = propArray[i];

            field = InputField((key * 1000) + i, obj, true);

            if (i < count) {
                values += field.props["data-name"] + ":" + field.props["data-value"];
                if (i < count - 1) {
                    values += ",";
                }
            }

            arr.push(field)
        }

        return arr;
    })();
    values += "}";

    return (
        <div key={key} className="input-field object-field" data-value={values} data-name={fieldName} data-is-invisible={!isVisible}>
            <span className="input-field-label">
                {displayedName}:
            </span>
            <div className="field-description">{description}</div>
            <div className="object-field-entries">
                {arr}
            </div>
        </div>
    );
}