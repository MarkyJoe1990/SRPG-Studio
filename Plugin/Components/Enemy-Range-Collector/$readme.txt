/*
    Version 1.5
    Made by MarkyJoe1990

    What the heck does this do?
    ===========================
    It scans the enemy team, then collects, stores
    and updates their movement and attack ranges
    in an efficient matter.

    I don't get it. What's the practical use for this?
    ==================================================
    Aside from being necessary for some of my plugins to
    work, It's actually very useful for improving performance
    (aka reducing lag and slowdown) for your game! By having
    a separate component handle all enemy range data, it
    means other scripts and functions don't have to waste
    time doing it themselves. And since they're all grabbing
    that data from the same place, the data used will be
    consistent between all of them.

    If you're still not sure what any of that means, then try
    this instead: make a map with 100 enemies, then
    right-click/hit cancel on an empty tile to display all of
    their ranges at once. See how slow that is? Now place this
    script in your plugins folder and watch how insanely fast
    those same ranges load!

    What functions does this overwrite?
    ===================================
    MarkingPanel.drawMarkingPanel
    MarkingPanel.updateMarkingPanel
    MarkingPanel.updateMarkingPanelFromUnit
*/