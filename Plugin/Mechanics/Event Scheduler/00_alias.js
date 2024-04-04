( function () {
    var alias1 = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function() {
        alias1.call(this);
        EventSchedulerControl.init();
    }

    var alias3 = PlayerTurn.moveTurnCycle;
    PlayerTurn.moveTurnCycle = function() {
        var mode = this.getCycleMode();
        if (mode != PlayerTurnMode.AUTOCURSOR && mode != PlayerTurnMode.AUTOEVENTCHECK) {
            EventSchedulerControl.moveScheduler(); // Only increment time when player has control.
        }

        return alias3.call(this);
    };

    // EventChecker._checkEvent...?
    var alias6 = EventChecker._checkEvent;
    EventChecker._checkEvent = function() {
        EventSchedulerControl.checkEvents();

        if (root.getBaseScene() === SceneType.REST) {
            return alias6.call(this);
        }

        IS_EVENT_SCHEDULE_MODE = root.getCurrentSession().getTurnType() === TurnType.PLAYER;
        var result = alias6.call(this);
        IS_EVENT_SCHEDULE_MODE = false;

        return result;
    }

    var alias2 = PlayerTurn._moveMap;
    PlayerTurn._moveMap = function() {
        if (EventSchedulerControl.isEventCheck() === true) {
            IS_EVENT_SCHEDULE_MODE = true;
            this.notifyAutoEventCheck();
            IS_EVENT_SCHEDULE_MODE = false;
        }

        return alias2.call(this);
    }

    var alias4 = MapParts.Terrain;
    MapParts.Terrain = defineObject(alias4, {
        _drawContent: function(x, y, terrain) {
            alias4._drawContent.call(this, x, y, terrain);

            if (terrain == null) {
                return;
            }

            if (EventSchedulerControl.getEventArray().length === 0) {
                return;
            }

            y += this.getIntervalY() * (alias4._getPartsCount.call(this, terrain) - 1);

            // Main stuff is here.
            var textui = this._getWindowTextUI();
            var color = textui.getColor();
            var font = textui.getFont();
            TextRenderer.drawText(x, y, "Timed Events", -1, color, font);
            y += this.getIntervalY();
            EventSchedulerRenderer.drawSchedulerContent(x, y);
        },

        _getPartsCount: function(terrain) {
            var count = EventSchedulerControl.getEventArray().length;

            if (count === 0) {
                return alias4._getPartsCount.call(this, terrain);
            }
            
            return alias4._getPartsCount.call(this, terrain) + (count * 2) + 1; // +1 is for "Timed Events" title
        },

        _getWindowWidth: function() {
            return alias4._getWindowWidth.call(this) + 20;
        }
    });

    var alias7 = CapsuleEvent.enterCapsuleEvent;
    CapsuleEvent.enterCapsuleEvent = function(event, isExecuteMark) {
		if (event === null) {
			return EnterResult.NOTENTER;
		}

        var type = event.getEventType();
        var eventId = event.getId();
        if (type === EventType.MAPCOMMON || type === EventType.AUTO) {
            var isCommon = type === EventType.MAPCOMMON;
            EventSchedulerControl.cancelEvent(eventId, isCommon);
        }

        return alias7.call(this, event, isExecuteMark);
    }

    // EventChecker now tracks the event type
    var alias5 = EventChecker.enterEventChecker;
    EventChecker.enterEventChecker = function(eventList, eventType) {
        this._eventType = eventType;
        return alias5.call(this, eventList, eventType);
    }

    EventChecker.getEventType = function() {
        return this._eventType;
    }

    EventChecker.getEventIndex = function() {
        return this._eventIndex;
    }

    BaseTurn.getEventChecker = function() {
        return this._eventChecker;
    }

    FreeAreaScene.getTurnStartObject = function() {
        return this._turnChangeStart;
    }

    BaseTurnChange.getEventChecker = function() {
        return this._eventChecker;
    }
}) ();