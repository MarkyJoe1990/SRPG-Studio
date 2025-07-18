'use client'

import Schema from './components/schema';
import InputField from './components/inputfield';
import LooseObject from "./components/looseobject";
import { useState } from 'react';

export default function Home() {
  var arr = Schema.fields.map((entry: LooseObject, index: number) => (InputField(index, entry, true)));
  const [message, setMessage] = useState("");

  const copyText = () => {
    navigator.clipboard.writeText(resultText);
    setMessage("Output copied!");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

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

      <div id="input-area">
        <h1>{Schema.title}</h1>
        <div id="field-list">
          {arr}
        </div>
      </div>

      <div id="output-area">
        <h1>Output</h1>
        <textarea disabled={true} readOnly title="output" id="output" value={resultText}></textarea>
        <button type="button" onClick={() => {copyText()}}>Copy to clipboard</button>
        <span>{message}</span>
      </div>
    </div>
  );
}