/*
    Debug Menu v1.0
    By MarkyJoe1990

    This plugin enables a new command during battles called "Debug".
    When selected, a list of events will be displayed that can
    be fired off anywhere, anytime, and as many times as you want.

    The event list comes from the Bookmark Event tab in the editor,
    and only includes events with the "isDebugEvent" custom parameter
    set to true, like so:

    {
        isDebugEvent: true
    }

    This can be useful for enabling or disabling debug features,
    setting units to be invincible, or whatever else you want
    to be able to do when testing your projects.
*/