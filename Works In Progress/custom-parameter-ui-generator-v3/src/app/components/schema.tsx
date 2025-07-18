const schema = {
    title: "Custom Parameter Generator",
    fields: [
        {
            displayedName: "Start Range",
            fieldName: "startRange",
            description: "Moves unit's starting attack range X tiles away",
            type: "number",
            min: 0,
            max: 10
        },
        {
            displayedName: "End Range",
            fieldName: "endRange",
            description: "Moves unit's ending attack range X tiles away",
            type: "number",
            min: 0,
            max: 10
        },
        {
            displayedName: "Message",
            fieldName: "message",
            description: "What the unit says when they attack",
            type: "text",
        },
        {
            displayedName: "Did you eat the chicken?",
            fieldName: "isChickenEaten",
            description: "Flag for when unit has eaten the chicken",
            type: "boolean"
        },
        {
            displayedName: "Favorite Food",
            fieldName: "favoriteFood",
            description: "Unit's favorite food. Three possible choices.",
            type: "dropdown",
            options: [
                {
                    name: "Chicken",
                    value: "FoodType.CHICKEN"
                },
                {
                    name: "Pizza",
                    value: "FoodType.PIZZA"
                },
                {
                    name: "Bacon",
                    value: "FoodType.BACON"
                }
            ],
            defaultIndex: 0
        },
        {
            displayedName: "Secret Code",
            fieldName: "secretCode",
            description: "The secret code needed to romance the unit",
            type: "array",
            elementData: {
                displayedName: "Number",
                fieldName: "number",
                description: "",
                type: "number",
                min: 0,
                max: 9
            }
        },
        {
            displayedName: "Coordinates",
            fieldName: "coordinates",
            description: "Map coordinates unit must go to for special prize",
            type: "object",
            propArray: [
                {
                    displayedName: "X",
                    fieldName: "x",
                    description: "",
                    type: "number",
                    min: 0,
                    max: 9
                },
                {
                    displayedName: "Y",
                    fieldName: "y",
                    description: "",
                    type: "number",
                    min: 0,
                    max: 9
                },
                {
                    displayedName: "Words",
                    fieldName: "words",
                    description: "Words unit will say upon reaching coordinates",
                    type: "text"
                }
            ]
        }
    ]
}

export default schema;