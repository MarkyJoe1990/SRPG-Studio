const schema = {
    title: "Doop",
    name: "Doop",
    parameterName: "doop",
    settings: [
        /*
        {
            type: "number",
            name: "Ear Size",
            parameterName: "earSize"
        },
        {
            type: "text",
            name: "How badly do you want it",
            parameterName: "wantedness"
        },
        {
            type: "boolean",
            name: "Has feet",
            parameterName: "hasFeet"
        },
        {
            type: "dropdown",
            name: "Preference",
            parameterName: "preference",
            options: [
                {
                    name: "Shoes",
                    value: 0
                },
                {
                    name: "Gloves",
                    value: 1
                },
                {
                    name: "Pants",
                    value: 2
                }
            ]
        },*/
        {
            type: "object",
            name: "Sub Object",
            parameterName: "subObject",
            settings: [
                {
                    type: "text",
                    name: "How subbadly do you want it",
                    parameterName: "subwantedness"
                },
                {
                    type: "text",
                    name: "How subgoodly do you want it",
                    parameterName: "subgoodliness"
                },
                {
                    type: "object",
                    name: "Sub Sub Object",
                    parameterName: "subSubObject",
                    settings: [
                        {
                            type: "text",
                            name: "Dooper doop",
                            parameterName: "dooperDoop"
                        }
                    ]
                }
            ]
        }
    ]
};

export default schema;