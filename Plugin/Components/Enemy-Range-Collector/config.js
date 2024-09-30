var ENEMY_RANGE_COLLECTOR_CONFIG = {
    disableIndividualRangeMarking: false, // If you want to use someone else's individual range marker plugin, disable this.
    disableCustomRangeDisplay: false, // Set to true if you don't want to use any custom graphics for range display.
    disableUpdateOnUnitMove: false, // If your game is lagging after you move a player unit, try disabling this.
    disableMarkingIcon: false, // If your name is SquidNow, disable this.
    disableTargetingLines: false, // If you don't want to use my targeting lines script, disable this.
    customRangeDisplayImage: "32x32.png", // Options: "32x32.png", "48x48.png" and "64x64.png".
    markingColor: 0xFF0000, // Original color was 0xffdc00
    markingIcon: { // If you want to use a different icon for individual enemy marking, modify these settings.
        id: 0, // Id of icon image sheet you want to use.
        isRuntime: true, // Is the image sheet part of the runtime package, or an original set of graphics?
        xSrc: 8, // How many spaces from the right is your desired icon on the sheet?
        ySrc: 18 // How many spaces from the top is your desired icon on the sheet?
    }
};