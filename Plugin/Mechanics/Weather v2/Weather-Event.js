// Mode 0 = Fade in
// Mode 1 = Fade out

var WeatherEventCommand = defineObject(BaseEventCommand, {
	enterEventCommandCycle: function() {
        this._prepareEventCommandMemberData();

        if(this._checkEventCommand() !== true) {
            return EnterResult.NOTENTER;
        }

		return this._completeEventCommandMemberData();
	},

    moveEventCommandCycle: function() {
        var mode = this.getCycleMode();

        if (InputControl.isStartAction() === true) {
            if (mode === 0) {
                this.mainEventCommand();
            }

            return MoveResult.END;
        }

        if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
            if (mode === 1) {
                return MoveResult.END;
            }

            this.mainEventCommand();
            this.changeCycleMode(1);
        };

		return MoveResult.CONTINUE;
	},
	
	drawEventCommandCycle: function() {
        var x = 0;
        var y = 0;
        var width = root.getGameAreaWidth();
        var height = root.getGameAreaHeight();
        var color = this._weather.getFadeColor();
        var alpha = this._getAlpha();

        root.getGraphicsManager().fillRange(x, y, width, height, color, alpha);
	},

    _checkEventCommand: function() {
        if (this._isValidWeather() !== true) {
            return false;
        }

		if (this.isSystemSkipMode() === true || this.isIgnoreUI() === true) {
			this.mainEventCommand();
			return false;
		}
		
		return true;
    },

    mainEventCommand: function() {
        WeatherControl.setWeather(this._weather.getName());
    },

    getEventCommandName: function() {
		return "Weather";
	},

    isIgnoreUI: function() {
        return this._isIgnoreUI;
    },

    isEventCommandSkipAllowed: function() {
        return false;
    },

    _prepareEventCommandMemberData: function() {
        var args = root.getEventCommandObject().getEventCommandArgument();
        this._weather = WeatherControl.getWeatherByName(args.name);
        this._isIgnoreUI = args.isIgnoreUI === true;
        this._counter = createObject(CycleCounter);
    },

    _completeEventCommandMemberData: function() {
        this._counter.setCounterInfo(40);
        this.changeCycleMode(0);
        this._playWeatherSound();

        return EnterResult.OK;
    },

    _isValidWeather: function() {
        return this._weather != null;
    },

    _playWeatherSound: function() {
        var handle = this._weather.getSoundHandle();

        if (handle.isNullHandle() !== true) {
            MediaControl.soundPlay(handle);
        }
    },

    _getAlpha: function() {
        var mode = this.getCycleMode();
        var counter = this._counter.getCounter();
        var max = this._counter._max;
        var percent = counter / max;
        var alpha = 255;
        if (mode !== 0) {
            percent = 1 - percent;
        }

        return Math.floor(alpha * percent);
    }
});