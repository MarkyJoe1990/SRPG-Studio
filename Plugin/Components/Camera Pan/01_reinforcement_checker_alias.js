( function () {
    if (CameraPanConfig.enableReinforcementPan !== true) {
        return;
    }

    ReinforcementCheckerMode.MOVE = 2; // Not defined before...?
    ReinforcementCheckerMode.SCROLL = 3;

    var alias1 = ReinforcementChecker._prepareMemberData;
    ReinforcementChecker._prepareMemberData = function(isSkipMode) {
        alias1.call(this, isSkipMode);
        this._cameraPan = createObject(CameraPan);
    }

    var alias2 = ReinforcementChecker.moveReinforcementChecker;
    ReinforcementChecker.moveReinforcementChecker = function() {
        var mode = this.getCycleMode();

        if (mode === ReinforcementCheckerMode.SCROLL) {
            return this._moveScroll();
        }

        return alias2.call(this);
    }

    // Override
    ReinforcementChecker.drawReinforcementChecker = function() {
		var i, reinforceUnit, unitRenderParam;
		var count = this._reinforceUnitArray.length;
		
		for (i = 0; i < count; i++) {
			reinforceUnit = this._reinforceUnitArray[i];
			
			unitRenderParam = StructureBuilder.buildUnitRenderParam();
			unitRenderParam.direction = reinforceUnit.direction;
			unitRenderParam.animationIndex = reinforceUnit.unitCounter.getAnimationIndexFromUnit(reinforceUnit.unit);
			unitRenderParam.isScroll = true;
            // EDITTED THIS LINE BELOW
			unitRenderParam.direction != DirectionType.NULL && UnitRenderer.drawScrollUnit(reinforceUnit.unit, reinforceUnit.xPixel, reinforceUnit.yPixel, unitRenderParam);
		}
	}

    // Override
    // It says start move, but it's actually start scroll now
    ReinforcementChecker.startMove = function() {
        this._cameraPan.setDestination(this._xScroll * GraphicsFormat.MAPCHIP_WIDTH, this._yScroll * GraphicsFormat.MAPCHIP_HEIGHT);
        this._cameraPan.startCameraPan();
        this.changeCycleMode(ReinforcementCheckerMode.SCROLL);
    }

    // New function
    ReinforcementChecker._moveScroll = function() {
        if (this._cameraPan.moveCameraPan() !== MoveResult.CONTINUE) {
            this._startMove();
        }

        return MoveResult.CONTINUE;
    }

    // New function
    ReinforcementChecker._startMove = function() {
        this._waitCounter.setCounterInfo(20);
		this.changeCycleMode(ReinforcementCheckerMode.MOVE);
    }

    // Override
    ReinforcementChecker._moveWait = function() {
		if (this._waitCounter.moveCycleCounter() !== MoveResult.CONTINUE) {
            this.startMove();
		}
		
		return MoveResult.CONTINUE;
	}
}) ();