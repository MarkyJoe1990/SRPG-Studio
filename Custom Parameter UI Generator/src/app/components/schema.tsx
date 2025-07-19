import Presets from "./presets";

const Schema = {
    title: "Custom Parameter Generator",
    description: (<span>This is a placeholder description. Useful for any additiona instructions or <a href="https://www.paypal.com/paypalme/markyjoe">links</a> that you might want to include for your plugin. Note that this accepts JSX as an argument.</span>),
    fields: [
        {
            displayedName: "Number Example",
            fieldName: "numberExample",
            description: "A number field with a minimum of 0, and a maximum of 10.",
            type: "number",
            min: 0,
            max: 10
        },
        {
            displayedName: "Text Example",
            fieldName: "textExample",
            description: "The user can input a string of any kind here.",
            type: "text",
        },
        {
            displayedName: "Boolean Example",
            fieldName: "booleanExample",
            description: "Check this box and the custom parameter will be made true.",
            type: "boolean"
        },
        {
            displayedName: "Dropdown Example",
            fieldName: "dropdownExample",
            description: "This one is great for custom parameters that use enumerations. The output can be any variable type (number, string, boolean, etc.), but for strings, the value field of an option needs to have \\\" at the start and end of it.",
            type: "dropdown",
            options: [
                {
                    name: "Option 1",
                    value: "OptionType.FIRST"
                },
                {
                    name: "Option 2",
                    value: "OptionType.SECOND"
                },
                {
                    name: "Option 3",
                    value: "OptionType.THIRD"
                }
            ],
            defaultIndex: 0
        },
        {
            displayedName: "Array Example",
            fieldName: "arrayExample",
            description: "Note that the user can only add a maximum of 10 items to the array. Depending on how much it's needed, I can make the limitation more flexible down the line though.",
            type: "array",
            elementData: {
                displayedName: "Number",
                fieldName: "number",
                description: "A type must be specified for the array. This array uses numbers!",
                type: "number",
                min: 0,
                max: 9
            }
        },
        {
            displayedName: "Object Example",
            fieldName: "objectExample",
            description: "Object fields can hold values of any kind, including other objects!",
            type: "object",
            propArray: [
                {
                    displayedName: "X",
                    fieldName: "x",
                    description: "X Coordinate on the map",
                    type: "number",
                    min: 0,
                    max: 100
                },
                {
                    displayedName: "Y",
                    fieldName: "y",
                    description: "Y Coordinate on the map",
                    type: "number",
                    min: 0,
                    max: 80
                }
            ]
        },
        {
            displayedName: "Flag Example",
            fieldName: "flagExample",
            description: "For custom parameters that use flags such as UnitFilterFlag, this field type is recommended!",
            type: "flag",
            flagArray: [
                {
                    displayedName: "Player",
                    value: 0x01
                },
                {
                    displayedName: "Enemy",
                    value: 0x02
                },
                {
                    displayedName: "Ally",
                    value: 0x04
                },
                {
                    displayedName: "Neutral",
                    value: 0x08
                }
            ]
        },
        {
            displayedName: "Fixed Example",
            fieldName: "fixedExample",
            description: "This value cannot be changed. Not sure what it'd be useful for, but maybe someone can find something! Similar to the dropdown type, strings must have \\\" at the start and end of them.",
            type: "fixed",
            value: "\"This value is unchangeable.\""
        }
    ]
}

export default Schema;