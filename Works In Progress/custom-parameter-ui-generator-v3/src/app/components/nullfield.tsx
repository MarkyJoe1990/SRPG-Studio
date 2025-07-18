export default function NullField(key: number, fieldName: string, displayedName: string) {
    const inputName = fieldName + "-Input";

    return (
        <div key={key} className="input-field null-field" data-value={null} data-name={fieldName}>
            <label htmlFor={ inputName }>{displayedName}</label>: 
            <input placeholder="No type specified." type="text" id={ inputName }></input>
        </div>
    );
}