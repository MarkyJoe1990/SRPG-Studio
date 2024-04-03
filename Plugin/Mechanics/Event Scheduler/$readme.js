/*
    Event Scheduler v1.0
    By MarkyJoe1990

    This plugin allows you to set events to run
    after a certain amount of real time has passed.

    The script only considers time to be passing when:
    - The player is in a battle.
    - It's the player's turn.
    - No other events are currently running.

    So what is the practical use for this? Well,
    for one, if you wish to have a chess timer in
    your game, you could set up an event that forcefully
    ends the player's turn after enough time has passed.

    Another possible implementation would be if you
    were remaking BS Fire Emblem, which had voice overs
    that played at specific times during gameplay.

    Instructions:
    Set up your event that you want to schedule.
    When setting it's conditions, go to the script
    tab and put the following code:

    EventSchedulerControl.isEventActive();

    Then, in one of your other events, create a Script
    Execute event command. Set it to "Execute Code"
    and put this code in there:

    EventSchedulerControl.scheduleEvent(eventId, isCommon, time, isAbsolute);

    Within the parenthesis, replace each property as follows:
    eventId - Set to the ID number of your event.
    isCommon - Set to true if this is a Map Common event. If it's an auto event, set to false.
    time - the number of frames that need to pass for the event to execute.
        Note that 60 frames is a second, 3600 frames is a minute, and 216000 is an hour.
    isAbsolute - Ignore this for now and set it to false.

    To be clear, your code should look something like this when you are done:
    EventSchedulerControl.scheduleEvent(0, false, 3600, false);

    This should add information on the terrain window that tells you when
    the event will fire off.
*/