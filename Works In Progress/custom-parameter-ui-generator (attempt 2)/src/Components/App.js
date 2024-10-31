import { useState } from "react";
import Input from "./Input.js";
import Output from "./Output.js";
import schema from "./Schema.js";
import "./App.css";

function App() {
    const layer = 0;
    const [outputArray, setOutputArray] = useState([]);
    const updateOutputArray = function(index, name, value) {
        console.log("Top Update");

        setOutputArray(previousState => {
            var newState = previousState.slice();
            newState[index] = {
                name: name,
                value: value
            };

            console.log(newState);

            return newState;
        });
    }

    return (
        <div className="App">
            <div className="main-container">
                <Input key={ "Layer " + layer + ", Item 0" } index={0} layer={ layer } settings={schema} settingsArray={ schema.settings } updateFunc={ updateOutputArray }></Input>
                <Output key={ "Layer "+ layer + ", Item 1" } index={1} layer={ layer } outputArray={ outputArray }></Output>
            </div>
        </div>
    );
}

export default App;