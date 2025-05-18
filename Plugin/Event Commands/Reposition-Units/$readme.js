/*

    Reposition Units Event Command
    v1.0 By MarkyJoe1990

    When this event command runs, the player is
    given an opportunity to reposition their team.
    You can designate what positions on the map
    are allowed, and if you want, you can also
    require the player to fill all the positions,
    or at least as many as they can.

    How to Use:
    - Create a Script Execute Event Command.
    - Set the type to "Event Command"
    - Set the Object Name to "Reposition Units"
    - For the parameters, you have two. "positions" and "isForce"
    - "positions" is an array of positions the player can move units to
    - "isForce" determines if the player is required to fill as many spots as
    possible, or if it's completely optional for the player to move their units.
        - NOTE: Once a player has moved their unit, they won't be able to undo it.
        - This will likely be addressed in a later update.
    - Your parameters should look something like this:

    {
        positions: [
            createPos(5, 5),
            createPos(5, 6),
            createPos(6, 5)
        ],
        isForce: true
    }
*/