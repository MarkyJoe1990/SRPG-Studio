import OutputConverter from "./OutputConverter";

function Output(props) {
    return (
        <textarea title="Output" className="Output" disabled value={ OutputConverter(props.outputArray, 0) }></textarea>
    );
}

export default Output;