var IS_EVENT_SCHEDULE_MODE = false; // Prevents auto events from running outside of the scheduler.

var EventSchedulerControl = {

    init: function() {
        this._schedulerData = this.reloadSchedulerData();
    },

    scheduleEvent: function(eventId, isCommon, time, isAbsolute) {
        if (this._getEvent(eventId, isCommon) === null) {
            root.msg("Event with ID " + eventId + "(isCommon: " + isCommon + ") failed to be scheduled.\n\nPlease verify that the event exists in the editor.");
            return;
        }

        var schedulerData = this.getSchedulerData();

        var scheduledEvent = this.buildScheduledEvent();
        scheduledEvent.id = eventId;
        scheduledEvent.isCommon = isCommon;
        if (isAbsolute === true) {
            scheduledEvent.time = time;
        } else {
            scheduledEvent.time = this.getTime() + time;
        }

        schedulerData.eventArray.push(scheduledEvent);
    },

    cancelEvent: function(eventId, isCommon) {
        var eventArray = this.getEventArray();
        var index = this.getEventIndexFromId(eventId, isCommon);
        index !== -1 && eventArray.splice(index, 1);
    },

    isEventActive: function() {
        var session = root.getCurrentSession();
        if (session.getTurnType() !== TurnType.PLAYER) {
            return false;
        }
        
        if (root.getBaseScene() !== SceneType.FREE) {
            return false;
        }
        
        var eventChecker;
        var startEndType = session.getStartEndType();
        if (startEndType === StartEndType.NONE) {
            eventChecker = SceneManager.getActiveScene().getTurnObject().getEventChecker();
        } else if (startEndType === StartEndType.PLAYER_START) {
            eventChecker = SceneManager.getActiveScene().getTurnStartObject().getEventChecker();
        } else {
            return false;
        }

        if (eventChecker == null) {
            return false;
        }
        
        var eventIndex = eventChecker.getEventIndex() - 1; // Minus 1 is because of how EventChecker does things. It's weird.
        var event = eventChecker._eventArray[eventIndex];
        var eventType = event.getEventType();
        if (eventType !== EventType.MAPCOMMON && eventType !== EventType.AUTO) {
            return false;
        }
        
        var eventId = event.getId();
        var isCommon = event.getEventType() === EventType.MAPCOMMON;

        var scheduledEvent = this.getEventFromId(eventId, isCommon);
        if (scheduledEvent == null) {
            return false;
        }

        if (scheduledEvent.isCommon !== isCommon) {
            return false;
        }

        var time = this.getTime();
        var eventTime = scheduledEvent.time;

        return IS_EVENT_SCHEDULE_MODE && eventTime <= time;
    },

    // Freezes the main timer
    freezeScheduler: function(isFrozen) {
        this.getSchedulerData().isFrozen = isFrozen;
    },

    // Add or subtract frames to the main timer.
    addTime: function(time) {
        this.getSchedulerData().time += time;
        this.checkEvents();
    },

    // Set the main timer
    setTime: function(time) {
        this.getSchedulerData().time = time;
        this.checkEvents();
    },

    // Get the current number of frames passed on the main timer.
    getTime: function() {
        return this.getSchedulerData().time;
    },

    // Freeze a specific schedule event's timer
    freezeScheduledEvent: function(eventId, isCommon, isFrozen) {
        var scheduledEvent = this.getEventFromId(eventId, isCommon);
        if (scheduledEvent == null) {
            return;
        }

        scheduledEvent.isFrozen = isFrozen;
    },

    // Add or subtract frames to a specific schedule event's timer
    addTimeToEvent: function(eventId, isCommon, time) {
        var event = this.getEventFromId(eventId, isCommon);
        if (event == null) {
            return;
        }

        event.time += time;
        this.checkEvents();
    },

    // Set the time for a specific schedule event
    setTimeForEvent: function(eventId, isCommon, time) {
        var event = this.getEventFromId(eventId, isCommon);
        if (event == null) {
            return;
        }

        event.time = time;
        this.checkEvents();
    },

    // Grabs an event from the scheduler.
    // Refer to SRPG Studio API for properties and methods.
    getEventFromId: function(eventId, isCommon) {
        var eventArray = this.getSchedulerData().eventArray;
        var i, currentEvent, count = eventArray.length;
        for (i = 0; i < count; i++) {
            currentEvent = eventArray[i];
            if (currentEvent.id === eventId && currentEvent.isCommon === isCommon) {
                return currentEvent;
            }
        }

        return null;
    },

    // Grabs the index of an event from the
    // array of scheduled events.
    getEventIndexFromId: function(eventId, isCommon) {
        var eventArray = this.getSchedulerData().eventArray;
        var i, currentEvent, count = eventArray.length;
        for (i = 0; i < count; i++) {
            currentEvent = eventArray[i];
            if (currentEvent.id === eventId && currentEvent.isCommon === isCommon) {
                return i;
            }
        }

        return -1;
    },

    // Grabs the array of scheduled events.
    getEventArray: function() {
        return this.getSchedulerData().eventArray;
    },

    // All methods below here should not be used by the end user.
    moveScheduler: function() {
        if (this.isFrozen() === true || this.isEnabled() !== true) {
            return MoveResult.CONTINUE;
        }

        // On every frame, check every scheduled event.
        var schedulerData = this.getSchedulerData();
        if (this.isEventCheck() !== true) {
            var eventArray = schedulerData.eventArray;
            var i, currentEvent, count = eventArray.length;
            for (i = 0; i < count; i++) {
                currentEvent = eventArray[i];
                if (currentEvent.time <= schedulerData.time) {
                    this.setEventCheck(true);
                }

                if (currentEvent.isFrozen === true) {
                    currentEvent.time++;
                }
            }
        }

        schedulerData.time++;

        return MoveResult.CONTINUE;
    },

    getSchedulerData: function() {
        return this._schedulerData;
    },

    isEventCheck: function() {
        return this.getSchedulerData().isEventCheck;
    },

    setEventCheck: function(isEventCheck) {
        this.getSchedulerData().isEventCheck = isEventCheck;
    },

    isEnabled: function() {
        return this.getSchedulerData().isEnabled;
    },

    setEnabled: function(isEnabled) {
        this.getSchedulerData().isEnabled = isEnabled;
    },

    isFrozen: function() {
        return this.getSchedulerData().isFrozen;
    },

    setFrozen: function(isFrozen) {
        this.getSchedulerData().isFrozen = isFrozen;
    },

    reloadSchedulerData: function() {
        var meta = root.getMetaSession();
        if (meta == null) {
            return null;
        }

        var schedulerData = meta.global.schedulerData;
        var mapId = root.getCurrentSession().getCurrentMapInfo().getId();
        if (schedulerData == undefined || schedulerData.mapId !== mapId) {
            schedulerData = this.buildSchedulerData();
            schedulerData.mapId = mapId;
            meta.global.schedulerData = schedulerData;
        }

        return schedulerData;
    },

    _getEvent: function(eventId, isCommon) {
        var session = root.getCurrentSession();
        if (session == null) {
            return null;
        }
        
        var list;
        if (isCommon === true) {
            list = root.getCurrentSession().getMapCommonEventList();
        } else {
            list = root.getCurrentSession().getAutoEventList();
        }

        return list.getDataFromId(eventId);
    },

    buildScheduledEvent: function() {
        return {
            id: -1,
            isCommon: false,
            time: 0,
            isFrozen: false
        }
    },

    buildSchedulerData: function() {
        return {
            eventArray: [],
            isFrozen: false,
            isEnabled: true,
            isEventCheck: false,
            time: 0,
            mapId: -1
        };
    },

    checkEvents: function() {
        var schedulerData = this.getSchedulerData();
        var eventArray = schedulerData.eventArray;
        var i, currentEvent, count = eventArray.length;
        for (i = 0; i < count; i++) {
            currentEvent = eventArray[i];
            if (currentEvent.time <= schedulerData.time) {
                this.setEventCheck(true);
                return;
            }
        }

        this.setEventCheck(false);
    }
};