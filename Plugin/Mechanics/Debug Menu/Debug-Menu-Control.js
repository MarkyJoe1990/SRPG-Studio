var DebugMenuControl = {
    getDebugEventArray: function() {
        var currentEvent, bookmarkEventList = root.getBaseData().getBookmarkEventList();
        var arr = [];

        var i, count = bookmarkEventList.getCount();
        for (i = 0; i < count; i++) {
            currentEvent = bookmarkEventList.getData(i);
            if (currentEvent.custom.isDebugEvent === true) {
                arr.push(currentEvent);
            }
        }

        return arr;
    }
}