/*
    Smooth Camera Pan Component
    v1.0 by MarkyJoe1990

    This is a special component plugin that adds
    the CameraPan object to be used in code for smooth
    camera scrolling.

    In addition, this plugin has a new event command
    that utilizes the CameraPan object, and a config
    option to enable smooth camera panning for
    when reinforcements appear.

    How to use "Camera" event command:
    - Create an event command "Script Execute"
    - Set the type to "Call Event Command"
    - Set Object Name to "Camera"
    - From here, you have a few options.
    - For setting coordinates as the camera destination:
        - In the "Property" field, you can set {x: YOUR_MAP_X_COORDINATE, y: YOUR_MAP_Y_COORDINATE }
        - Alternatively, you can go into the Original Data tab and set Value 1 and Value 2
        for your X and Y coordinates respectively.
    - For setting a unit as the camera destination
        - In the "Property" field, add { useUnit: true }
        - In the Original Data Tab, go to the "Unit" field and select your unit.

    How to enable smooth camera for reinforcements:
    - Go to 00_config.js
    - Set enableReinforcementPan to true

    If you enable smooth camera panning, do note
    that the following functions will be overwritten:
    - ReinforcementChecker.drawReinforcementChecker
    - ReinforcementChecker.startMove
    - ReinforcementChecker._moveWait
*/