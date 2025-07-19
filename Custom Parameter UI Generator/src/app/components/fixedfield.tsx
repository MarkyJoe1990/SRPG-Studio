export default function FixedField(
    key: number,
    fieldName: string,
    displayedName: string,
    description: string,
    value: any,
    isVisible: boolean
) {
    const inputName = fieldName + "-Input";

    return (
        <div key={key} className="input-field null-field" data-value={value} data-name={fieldName} data-is-invisible={!isVisible}>
            <label htmlFor={ inputName } className="input-field-label">{displayedName}:</label>
            <input disabled={true} type="text" id={ inputName } value={value}></input>
            <div className="field-description">{description}</div>
        </div>
    );
}