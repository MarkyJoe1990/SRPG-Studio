/*
    Weather 2.0
    By MarkyJoe1990

    WHAT DOES THIS DO?
    This plugin adds weather effects to your game.
    It can also theoretically add other persistent
    effects if you know how to modify the code.

    This plugin does not overwrite any functions.

    INSTRUCTIONS:
    - First, make absolutely sure you downloaded
    the material folder from my github.
    - Inside my material folder is another folder
    called "Weather", put that in your own Material
    folder.
    - Next, take the folder containing this plugin
    and add it to your own plugin folder.

    TO START MAPS WITH WEATHER:
    - Go to a map of your choosing.
    Map Information -> Custom Parameters.
    - Add the property "weather" and set it to
    the name of your desired weather (options below).
    Example:
        {
            weather: "Rain"
        }

    TO CHANGE THE WEATHER THROUGH AN EVENT:
    - Create an event and add the event command
    "Script Execute".
    - Set it to "Call Event Command" and set the object
    to "Weather". This is case sensitive.
    - In the property area, simply add "name" and set
    it to the name of your desired weather (options below).
    Example:
        {
            name: "Rain"
        }
    When your event runs, you should see the game state
    transition into your weather.

    OPTIONS:
    - Clear
    - Snow
    - Rain
    - Sand
    - Petal
    - Bubble
    - Rain-Detailed
    - Snow-Detailed
*/