// import GlobalContext from "./GlobalContext";
import { useContext } from "react";

function ArrayInput (props) {
    // var updateOutputArray = useContext(props.context);
    var settings = props.settings;

    return (
        <div className="ArrayInput">
            {settings.name}: <button type="button" onClick={ function() {} }>{ settings.buttonText }</button>
        </div>
    )
}

export default ArrayInput;