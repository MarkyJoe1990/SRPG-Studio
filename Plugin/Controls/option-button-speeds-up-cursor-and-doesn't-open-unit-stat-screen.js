(function () {
	var alias1 = MapCursor._isAccelerate;
	MapCursor._isAccelerate = function() {
		//return InputControl.isOptionState();
		return root.isInputState(InputType.BTN3);
	}
	
	var alias2 = MapEdit._optionAction;
	MapEdit._optionAction = function() {
		return MapEditResult.NONE;
	}
}) ();