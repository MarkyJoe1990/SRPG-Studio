/*
    Smooth Camera Pan Component
    v1.0 by MarkyJoe1990

    This is a special component plugin that adds
    the CameraPan object to be used in code for smooth
    camera scrolling. This allows for the following features:

    - Smooth screen scrolling when moving the cursor around with
      a gamepad or keyboard.
    - Smooth screen scrolling when panning over to enemy units on
      enemy phase (Set Scroll Speed to Norm in in-game Config)
    - Smooth screen scrolling when panning over to reinforcements.
    - Smooth screen scrolling during the Phase Change animation
    - Smooth screen scrolling when snapping over to specific units
    - An Event Command for smoothly scrolling over to a position
      on the map.

    You can enable or disable specific parts of this plugin
    by opening up 00_config.js

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
*/