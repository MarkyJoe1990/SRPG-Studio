const arr = [
    {
        displayedName: "Start Range",
        fieldName: "startRange",
        type: "number",
        min: 0,
        max: 10
    },
    {
        displayedName: "End Range",
        fieldName: "endRange",
        type: "number",
        min: 0,
        max: 10
    },
    {
        displayedName: "Message",
        fieldName: "message",
        type: "text",
    },
    {
        displayedName: "Did you eat the chicken?",
        fieldName: "isChickenEaten",
        type: "boolean"
    },
    {
        displayedName: "Favorite Food",
        fieldName: "favoriteFood",
        type: "dropdown",
        options: [
            {
                name: "Chicken",
                value: 0
            },
            {
                name: "Pizza",
                value: 1
            },
            {
                name: "Bacon",
                value: 2
            }
        ],
        defaultIndex: 0
    },
    {
        displayedName: "Ingredients",
        fieldNames: "ingredients",
        type: "array",
        elementData: {
            displayedName: "Ingredient",
            fieldName: "ingredient",
            type: "number",
            min: 0,
            max: 10
        }
    }
];

export default arr;