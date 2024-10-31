import { useContext } from "react";

function DropdownInput(props) {
    var updateOutputArray = useContext(props.context);
    var settings = props.settings;
    var index = props.index;

    var dropdownChange = function (e) {
        var index = props.index;
        var name = settings.parameterName;
        var value = e.target.value;

        updateOutputArray(index, name, value);
    }

    var options = settings.options;
    var optionElements = options.map((option) => {
        return <option value={option.value} key={index + ":" + option.name}>
            {option.name}
        </option>
    });

    return (
        <div className="DropdownInput">
            {settings.name}: <select title={settings.name} type="text" onChange={dropdownChange}>
              {optionElements}
            </select>
        </div>
    );
}

export default DropdownInput;