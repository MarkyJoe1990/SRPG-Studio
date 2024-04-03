// Timer counts up internally
// Timer is always displayed as counting up, or not displayed at all.
// Queued events conversely count down relative to the main timer.
// Can add/subtract time from queued events, OR
//  Add/subtract time from the main timer.
// Scheduler should allow player to finish their current action
//  before taking over.

// Enable - Only used when doing certain actions so player can view animations
// Freeze - Allows user to decide when time is allowed to progress.

var IS_EVENT_SCHEDULE_MODE = false; // Prevents auto events from running outside of the scheduler.

var EventSchedulerControl = {

    // prepareMap
    init: function() {
        this._schedulerData = this.reloadSchedulerData();
    },

    scheduleEvent: function(eventId, isCommon, time, isAbsolute) {
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

    freezeScheduler: function(isFrozen) {
        this.getSchedulerData().isFrozen = isFrozen;
    },

    addTime: function(time) {
        this.getSchedulerData().time += time;
        this.checkEvents();
    },

    setTime: function(time) {
        this.getSchedulerData().time = time;
        this.checkEvents();
    },

    getTime: function() {
        return this.getSchedulerData().time;
    },

    freezeScheduledEvent: function(eventId, isCommon, isFrozen) {
        var scheduledEvent = this.getEventFromId(eventId, isCommon);
        if (scheduledEvent == null) {
            return;
        }

        scheduledEvent.isFrozen = isFrozen;
    },

    addTimeToEvent: function(eventId, isCommon, time) {
        var event = this.getEventFromId(eventId, isCommon);
        if (event == null) {
            return;
        }

        event.time += time;
        this.checkEvents();
    },

    setTimeForEvent: function(eventId, isCommon, time) {
        var event = this.getEventFromId(eventId, isCommon);
        if (event == null) {
            return;
        }

        event.time = time;
        this.checkEvents();
    },

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

    isEventActive: function() {
        var startEndType = root.getCurrentSession().getStartEndType();
        var eventChecker;
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
        var eventType = eventChecker.getEventType();
        var event = eventChecker._eventArray[eventIndex];
        var eventId = event.getId();
        if (eventType !== EventType.MAPCOMMON && eventType !== EventType.AUTO) {
            return false;
        }
        var isCommon = eventType === EventType.MAPCOMMON;

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

    getEventArray: function() {
        return this.getSchedulerData().eventArray;
    },

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