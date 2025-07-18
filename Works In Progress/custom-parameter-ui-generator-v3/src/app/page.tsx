'use client'

import Schema from './components/schema';
import InputField from './components/inputfield';
import LooseObject from "./objects/looseobject";

export default function Home() {
  var arr = Schema.map((entry: LooseObject, index: number) => (InputField(index, entry)));

  // Get the values of all fields

  var resultText = "{";

  arr.forEach((element, index, array) => {
    resultText += element.props["data-name"] + ": " + element.props["data-value"]
    if (index < array.length - 1) {
      resultText += ",\n";
    }
  });

  resultText += "}";

  return (
    <div className="main">
      <h1>Custom Parameter Generator</h1>

      <div id="field-list">
        {arr}
      </div>

      <label htmlFor="output">Output</label>
      <textarea readOnly title="output" placeholder="Output will be put here." id="output" value={resultText}></textarea>
    </div>
  );
}