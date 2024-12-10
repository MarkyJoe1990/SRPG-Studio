function StringInput(props) {
    var updateFunc = props.updateFunc;
    var settings = props.settings;

    var stringChange = function(e) {
        var index = props.index;
        var name = settings.parameterName;
        var value = e.target.value;

        e.target.value = value;
        updateFunc(index, name, "\"" + value + "\"");
    }

    return (
        <div className="StringInput">
            {settings.name}: <input type="text" onChange={ stringChange }></input>
        </div>
    );
}

export default StringInput;