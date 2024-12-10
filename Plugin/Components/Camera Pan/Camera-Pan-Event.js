var CameraPanEvent = defineObject(BaseEventCommand, {
    _enableDebug: false,

    enterEventCommandCycle: function() {
        var evObj = root.getEventCommandObject();
        var args = evObj.getEventCommandArgument();
        var content = evObj.getOriginalContent();

        var x, y;
        if (args.useUnit === true) {
            var unit = content.getUnit();
            x = unit.getMapX();
            y = unit.getMapY();
        } else {
            x = args.x;
            if (x == undefined) {
                x = content.getValue(0);
            }
    
            y = args.y;
            if (y == undefined) {
                y = content.getValue(1);
            }
        }

        this._cameraPan = createObject(CameraPan);
        this._cameraPan.setDestinationTrueTileCenter(x, y);
        this._enableDebug = args.enableDebug === true;

        if (this.isEventCommandContinue() !== true) {
            return EnterResult.NOTENTER;
        }

        this._cameraPan.startCameraPan();

		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
		return this._cameraPan.moveCameraPan();
	},
	
	drawEventCommandCycle: function() {
		this._cameraPan.drawDebug();
	},

    mainEventCommand: function() {
        this._cameraPan.endCameraPan();
    },

    getEventCommandName: function() {
        return "Camera";
    }
});