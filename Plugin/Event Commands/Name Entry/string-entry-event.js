var StringEntryControl = {
    _string: "",

    getString: function() {
        return this._string;
    },

    setString: function(string) {
        this._string = string;
    }
};

var StringEntryEventCommand = defineObject(NameEntryEventCommand, {
    mainEventCommand: function() {
        StringEntryControl.setString(this._windowManager.getNameEntry());
    },

    getEventCommandName: function() {
		return 'String Entry';
	}
});