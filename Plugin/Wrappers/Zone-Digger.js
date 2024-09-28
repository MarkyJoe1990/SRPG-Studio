/*
    Version 1.0
    Made by MarkyJoe1990

    This plugin allows you to select parts of your map,
    fill them in with a specific tile of your choice,
    and build outward from the parts of the map you selected.

    It's a primitive form of map generation, but it might
    be useful to some people, so here ya go.

    Note that you will need a little programming
    knowledge to use this.

    The basic instructions are as follows.
    1) Create a Script Execute event command.
    2) Set it to Execute Code.
    3) In the code field, write the following.

    ZoneDigger.resetDigZone();
    ZoneDigger.setResourceHandle(true, 0, 0, 0, 0);
    ZoneDigger.fillRange(0, 0, 5, 5);
    ZoneDigger.setDigZone(0, 0, 5, 5);
    ZoneDigger.startDigging(100);

    This is a very basic piece of code that will place a bunch of
    grass tiles in the top left corner of your map, then procedurally
    "build outward" by placing 100 more grass tiles on the outer edge
    of where it started.

    Modify according to your needs. Be sure to look at the code below
    to understand all the options at your disposal.
*/

var ZoneDigger = {
    _handle: null,
    _isLayer: false,
    _digZone: null,

    // Sets the map chip that will be placed on the map for fillRange and startDigging.
    // isRuntime: Is the map chip from a runtime package, or original?
    // id: id of the Map Chip resource.
    // colorIndex: usually useless. Just set it to 0.
    // xSrc: The X position of the exact map chip in your map chip set.
    // ySrc: The y position of the exact map chip in your map chip set.
    setResourceHandle: function(isRuntime, id, colorIndex, xSrc, ySrc) {
        this._handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
    },

    // Set whether the map chip is to be treated as an ornament or not.
    setLayer: function(isLayer) {
        this._isLayer = isLayer;
    },

    // Sets the chosen position to use the map chip you set in setResourceHandle.
    placeMapChip: function(x, y) {
        root.getCurrentSession().setMapChipGraphicsHandle(x, y, this._isLayer, this._handle);
    },

    // Sets the chosen range on the map to use the map chip you set in setResourceHandle.
    fillRange: function(x, y, width, height) {
        var i, j;

        var finalX = x + width;
        var finalY = y + height;

        for (i = y; i < finalY; i++) {
            for (j = x; j < finalX; j++) {
                this.placeMapChip(j, i);
            }
        }
    },

    // Must be used to initialize the ZoneDigger.
    resetDigZone: function() {
        this._digZone = [];
    },

    // Sets a range from which the ZoneDigger will "build outward" from
    setDigZone: function(x, y, width, height) {
        if (this._digZone == null) {
            this._digZone = [];
        }

        var finalX = x + width;
        var finalY = y + height;

        for (i = y; i < finalY; i++) {
            for (j = x; j < finalX; j++) {
                this._digZone.push(createPos(j, i));
            }
        }

        return this._digZone;
    },

    // Sets a single position from which the ZoneDigger will "build outward" from
    addDigPos: function(x, y) {
        this._digZone.push(createPos(x, y));
    },

    // Returns an array of all valid positions where a map chip can
    // currently be placed.
    getDiggableSpots: function() {
        var digZone = this._digZone;

        var diggableSpots = []

        var j, count2;
        var i, count = digZone.length;
        var currentPos, relativePos;
        for (i = 0; i < count; i++) {
            currentPos = digZone[i];

            //Check adjacent tiles
            count2 = DirectionType.COUNT;
            for (j = 0; j < count2; j++) {
                relativePos = {};
                relativePos.x = currentPos.x + XPoint[j];
                relativePos.y = currentPos.y + YPoint[j];

                if (!CurrentMap.isMapInside(relativePos.x, relativePos.y)) {
                    continue;
                }

                if (this.isInDigZone(relativePos)) {
                    continue;
                }

                diggableSpots.push(relativePos);
            }
        }

        return diggableSpots;
    },

    // Checks if the currently chosen position is inside the
    // digging zone.
    isInDigZone: function(pos) {
        var digZone = this._digZone;
        var i, count = digZone.length;
        var currentDigZone;
        for (i = 0; i < count; i++) {
            currentDigZone = digZone[i];

            if (currentDigZone.x == pos.x && currentDigZone.y == pos.y) {
                return true;
            }
        }

        return false;
    },

    // Starts placing the map chip in valid diggable spots, and updates
    // what spots on the map are valid for digging.
    startDigging: function(count) {
        var i, diggableSpots, randomPos;
        for (i = 0; i < count; i++) {
            diggableSpots = this.getDiggableSpots();

            var index = Probability.getRandomNumber() % diggableSpots.length;

            randomPos = diggableSpots[index];

            this.placeMapChip(randomPos.x, randomPos.y);
            this.addDigPos(randomPos.x, randomPos.y);
        }
    }
}