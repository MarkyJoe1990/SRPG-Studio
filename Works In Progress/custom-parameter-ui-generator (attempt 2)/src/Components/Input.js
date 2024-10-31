import NumberInput from "./Inputs/NumberInput.js";
import StringInput from "./Inputs/StringInput.js";
import DropdownInput from "./Inputs/DropdownInput.js";
import BooleanInput from "./Inputs/BooleanInput.js";
import ArrayInput from "./Inputs/ArrayInput.js";
import { useState } from "react";
import OutputConverter from "./OutputConverter.js";

function Input(props) {
    var inputSettings = props.settings;
    var inputName = inputSettings.name;
    var inputIndex = props.index;
    var inputName = inputSettings.parameterName;
    var oldUpdateFunc = props.updateFunc;
    var settingsArray = props.settingsArray;
    var i, settings, key, count = settingsArray.length;
    var items = [];
    
    var layer = props.layer;
    var nextLayer = layer + 1;

    const [outputArray, setOutputArray] = useState([]);
    var newUpdateFunc = function(index, name, value) {
        console.log("Lower Update");
        setOutputArray(previousState => {
            var newState = previousState.slice();
            newState[index] = {
                name: name,
                value: value
            };

            var string = OutputConverter(newState, nextLayer);
            oldUpdateFunc(inputIndex, inputName, string);

            return newState;
        });
    }

    for (i = 0; i < count; i++) {
        settings = settingsArray[i];
        key = "Layer " + layer + ", Item " + i;
        if (settings.type === "text") {
            items.push(
                <StringInput key={ key } layer={ nextLayer } index={i} settings={ settings } updateFunc={ oldUpdateFunc }/>
            );
        } else if (settings.type === "object") {
            items.push(
                <Input key={ key } layer={ nextLayer } index={i} settings={ settings } settingsArray={ settings.settings } updateFunc={ newUpdateFunc }/>
            );
        }
    }

    return (
        <div>
            <span>{ inputSettings.name }</span>
            <div className="Input" style={ {marginLeft: layer * 40} }>{ items }</div>
        </div>
    );
}

export default Input;