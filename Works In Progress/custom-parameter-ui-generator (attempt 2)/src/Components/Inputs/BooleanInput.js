import { useContext } from "react";

function BooleanInput(props) {
    var updateOutputArray = useContext(props.context);
    var settings = props.settings;

    var booleanChange = function(e) {
        var index = props.index;
        var name = settings.parameterName;
        var value = e.target.checked;

        e.target.value = value;
        updateOutputArray(index, name, value);
    }

    return (
        <div className="BooleanInput">
            {settings.name}: <input type="checkbox" onChange={ booleanChange }></input>
        </div>
    );
}

export default BooleanInput;