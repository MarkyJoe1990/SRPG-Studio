var EventSchedulerRenderer = {
    drawSchedulerContent: function(x, y) {
        var session = root.getCurrentSession();
        if (session == null) {
            return;
        }

        var mapData = session.getCurrentMapInfo();
        var time = EventSchedulerControl.getTime();

        var textui = this._getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        var eventArray = EventSchedulerControl.getEventArray();

        var autoEventList = session.getAutoEventList();
        var commonEventList = session.getMapCommonEventList();
        var i, currentScheduleEvent, currentEvent, finalTime, count = eventArray.length;
        for (i = 0; i < count; i++) {
            currentScheduleEvent = eventArray[i];
            if (currentScheduleEvent.isCommon === true) {
                currentEvent = commonEventList.getDataFromId(currentScheduleEvent.id);
            } else {
                currentEvent = autoEventList.getDataFromId(currentScheduleEvent.id);
            }

            if (currentEvent == null) {
                continue;
            }

            // Draw event name
            TextRenderer.drawText(x, y, currentEvent.getName(), -1, ColorValue.KEYWORD, font);
            y += this.getIntervalY();
            // Draw event time
            finalTime = currentScheduleEvent.time - time;
            if (finalTime < 0) {
                finalTime = 0;
            }
            this._drawTimer(x, y, finalTime);
            y += this.getIntervalY();
        }
    },

    getSchedulerHeight: function() {
        return EventSchedulerControl.getEventArray().length * 40;
    },

    _drawTimer: function(x, y, time) {
        var textui = this._getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        var hour = Math.floor(time / 216000);
        var minute = Math.floor(time / 3600) % 60;
        var second = Math.floor(time / 60) % 60;

        if (hour < 10) {
            NumberRenderer.drawRightNumber(x, y - 2, 0);
            x += 10;
        }
        NumberRenderer.drawRightNumber(x, y - 2, hour);
        x += 10;
        if (hour >= 10) {
            x += 10;
        }

        // Draw :
        TextRenderer.drawText(x, y, ":", -1, color, font);
        x += 10;

        if (minute < 10) {
            NumberRenderer.drawRightNumber(x, y - 2, 0);
            x += 10;
        }
        NumberRenderer.drawRightNumber(x, y - 2, minute);
        x += 10;
        if (minute >= 10) {
            x += 10;
        }


        // Draw :
        TextRenderer.drawText(x, y, ":", -1, color, font);
        x += 10;

        if (second < 10) {
            NumberRenderer.drawRightNumber(x, y - 2, 0);
            x += 10;
        }
        NumberRenderer.drawRightNumber(x, y - 2, second);
    },

    getIntervalY: function() {
        return 20;
    },

    _getTextUI: function() {
        return root.queryTextUI("default_window");
    }
};