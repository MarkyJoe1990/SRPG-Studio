/*
    Allow New Game Cancel
    v1.0 by MarkyJoe1990

    Self explanatory. You can now cancel out of the
    new game screen back to the title screen.
*/

( function () {
    NewGameMode.CANCEL = 2;

    var alias2 = TitleCommand.NewGame.openCommand;
    TitleCommand.NewGame.openCommand = function() {
        alias2.call(this);
        this._questionWindow = createObject(QuestionWindow);
        this._questionWindow.setQuestionMessage("Return to title screen?");
    };

    var alias3 = TitleCommand.NewGame.drawCommand;
    TitleCommand.NewGame.drawCommand = function() {
        alias3.call(this);
        if (this.getCycleMode() == NewGameMode.CANCEL) {
            this._drawFlow();
            this._drawQuestion();
        }
    }

    var alias4 = TitleCommand.NewGame.moveCommand;
    TitleCommand.NewGame.moveCommand = function() {
        var mode = this.getCycleMode();
        var result = alias4.call(this);

        if (mode == NewGameMode.CANCEL) {
            result = this._moveQuestion();
        }

        return result;
    }

    TitleCommand.NewGame.startCancelAction = function() {
        MediaControl.soundDirect("commandcancel");
        this._questionWindow.setQuestionActive(true);
        this.changeCycleMode(NewGameMode.CANCEL);
    };

    var alias5 = DifficultyFlowEntry.moveFlowEntry;
    DifficultyFlowEntry.moveFlowEntry = function() {
        if (InputControl.isCancelAction() === true) {
            this._newGameCommand.startCancelAction();
        };

        return alias5.call(this);
    }

    var alias7 = DifficultyFlowEntry._prepareMemberData;
    DifficultyFlowEntry._prepareMemberData = function(newGameCommand) {
        alias7.call(this, newGameCommand);
        this._newGameCommand = newGameCommand;
    }

    var alias6 = ClearPointFlowEntry.moveFlowEntry;
    ClearPointFlowEntry.moveFlowEntry = function() {
        if (InputControl.isCancelAction() === true) {
            this._newGameCommand.startCancelAction();
        };

        return alias6.call(this);
    }

    var alias8 = ClearPointFlowEntry._prepareMemberData;
    ClearPointFlowEntry._prepareMemberData = function(newGameCommand) {
        alias8.call(this, newGameCommand);
        this._newGameCommand = newGameCommand;
    }

    TitleCommand.NewGame._moveQuestion = function() {

		if (this._questionWindow.moveWindow() != MoveResult.CONTINUE) {
			var ans = this._questionWindow.getQuestionAnswer();
			if (ans == QuestionAnswer.YES) {
				return MoveResult.END;
			} else if (ans == QuestionAnswer.NO) {
				this._questionWindow.setQuestionActive(false);
				this.changeCycleMode(NewGameMode.FLOW);
			}
		}

        return MoveResult.CONTINUE;
    }

    TitleCommand.NewGame._drawQuestion = function() {
        var x = LayoutControl.getCenterX(-1, this._questionWindow.getWindowWidth());
        var y = LayoutControl.getCenterY(-1, this._questionWindow.getWindowHeight());

        this._questionWindow.drawWindow(x, y);
    }
}) ();