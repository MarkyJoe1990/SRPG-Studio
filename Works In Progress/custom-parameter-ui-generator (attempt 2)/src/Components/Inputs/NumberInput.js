import { useContext } from "react";

function NumberInput(props) {
    var updateOutputArray = useContext(props.context);
    var settings = props.settings;

    var numberChange = function(e) {
        var index = props.index;
        var name = settings.parameterName;
        var value = e.target.value;
        
        if (value > settings.max) {
            value = settings.max.toString();
        } else if (value < settings.min) {
            value = settings.min.toString();
        }

        e.target.value = value;
        updateOutputArray(index, name, value);
    }

    return (
        <div className="NumberInput">
            {settings.name}: <input type="number" onChange={ numberChange }></input>
        </div>
    );
}

export default NumberInput;