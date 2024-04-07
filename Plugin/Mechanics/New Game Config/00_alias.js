( function () {
	var alias2 = DifficultyFlowEntry.enterFlowEntry;
	var OriginalDifficultyFlowEntry = defineObject(DifficultyFlowEntry, {

		enterFlowEntry: function(newGameCommand) {
			if (typeof RogueLikeControl == "undefined") {
				return EnterResult.NOTENTER;
			}

			if (RogueLikeControl.isRogueLikeMode() == true) {
				return EnterResult.NOTENTER;
			}

			return alias2.call(this, newGameCommand);
		},

		_startSession: function(index) {
			var difficulty = this._difficultyArray[index];

			root.getMetaSession().setDifficulty(difficulty);
		}
	});
	
	DifficultyFlowEntry.enterFlowEntry = function(newGameCommand) {
		if (typeof RogueLikeControl == "undefined") {
			return alias2.call(this, newGameCommand);
		}

		var list = root.getBaseData().getDifficultyList();
		var difficulty = list.getData(0);
		root.getSceneController().initializeMetaSession(difficulty);

		return EnterResult.NOTENTER;
	};

	var alias1 = TitleCommand.NewGame._pushFlowEntries;
	TitleCommand.NewGame._pushFlowEntries = function(straightFlow) {
		alias1.call(this, straightFlow); //Difficulty setting must come first, since it initializes the meta session.
		//straightFlow.pushFlowEntry(NameEntryFlowEntry); // To be added at a later date
		straightFlow.pushFlowEntry(NewGameConfigFlowEntry);
		straightFlow.pushFlowEntry(OriginalDifficultyFlowEntry);
	};
}) ();