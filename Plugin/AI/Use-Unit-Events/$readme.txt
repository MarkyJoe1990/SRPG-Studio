/*
    Enemies Can Use Unit Events
    v0.5 By MarkyJoe1990

    This plugin allows enemy and ally units to
    use unit events, so long as you have a player
    unit in the database with the "global" custom
    parameter set to true.

    Enemies will use events from the designated
    global unit's event list. Scoring criteria
    as well as other properties need to be set
    by the user. Since this requires some
    programming knowledge, this plugin is only
    recommended for advanced users.

    As of currently, the functionality is very
    primitive. Enemy can only target other units,
    and can only handle a single "step" of input,
    such as selecting which unit to use the event on.

    How to use:
    - Create a player unit. Set a custom parameter for
    "global", and set it to "true", like so:
    {
        global: true
    }
    - Create a unit event. Set any event commands in
    the event that require input to only be triggered
    when the active unit is a player.
    - Create a Script Execute event command with
    "Save return value as variable" checked, and an
    ID variable specified. Copy this code:

    var combination = UnitEventAIControl.getCurrentCombination();
    var unit = combination.targetUnit;
    unit.getId();

    - This code gets the unit the enemy has chosen to target,
    so that it can be used in place of Extract Map Pos for enemies.
    - Once you've set up the event command's functionality, it's time
    to set the event's custom parameters.
    - Right click your event -> Details -> Custom Parameters.
    - Here's a whooole bunch of custom parameters.

    {
        aiSteps: [
            {
                getScore: function(unit, combination) {
                    return 1000;
                },
                startRange: 1,
                endRange: 2,
                rangeType: SelectionRangeType.MULTI,
                unitFilterFlag: 0x07
            }
        ]
    }

    - Let's briefly explain what each of these does.

    aiSteps: Mostly here for future proofing if I ever
    choose to allow the enemy to have more steps in decision
    making. You still need it, but you can only have an array
    of a single step: unit selection.

    getScore: A function that allows you to set some decision
    making criteria for the event to be used. Higher numbers
    as return value makes the AI more encouraged to take this action.
    You will need to know how to handle unit and combination objects
    to get the most out of this. For my example, I just have the command
    have a score value of 1000 for testing purposes.

    startRange: Since the enemy AI cannot use Extract Map Pos, you will
    need to designate the start and end range of the unit event. This
    is the minimum range.

    endRange: Max range of the unit event.

    rangeType: Determines if the range of the unit event is user-only,
    the entire map, or a specific range. Right now, only
    "SelectionRangeType.MULTI" is usable.

    unitFilterFlag: Determines which units can be targetted.
    UnitFilterFlag.PLAYER - Targets ally units.
    UnitFilterFlag.ENEMY - Targets the opposing army.
    UnitFilterFlag.ALLY - Targets allies as well.

    You can use 0x07 to target all units.

    - Once you have all of this set up, the unit event should be
    usable now.

    KNOWN ISSUES:
    - Currently, there is no way to set conditions for making
    the event usable, so enemies will always have it in their
    arsenal.
    - There's no way to have more than one step in the decision
    making process (unit selection)
    - Can only select units and not map positions
*/