export default function NullField(key: number, fieldName: string, displayedName: string, description: string, isVisible: boolean) {
    const inputName = fieldName + "-Input";

    return (
        <div key={key} className="input-field null-field" data-value={null} data-name={fieldName} data-is-invisible={!isVisible}>
            <label htmlFor={ inputName } className="input-field-label">{displayedName}:</label>
            <input placeholder="No type specified." type="text" id={ inputName }></input>
            <div className="field-description">{description}</div>
        </div>
    );
}