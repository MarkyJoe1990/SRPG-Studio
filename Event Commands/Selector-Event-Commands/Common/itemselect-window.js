var ItemSelectorWindow = defineObject(BaseWindow,
{
	//Our unit
	_unit : null,
	
	//The unit's list of items
	_itemList: null,
	
	//A scrollbar for the window
	_itemScrollbar: null,
	
	//
	_listType: null,
	
	//No clue
	_isWindowEnabled: true,
	_drawParentData: null,
	
	initialize: function() {
	},
	
	setUp: function() {
		//Create a scrollbar, which... just shows the item icons,
		//names, and gives us the item's object or index upon selection
		//See itemselect-scrollbar.js
		//root.log("Window Item List: " + this._itemList[0].getName());
		this._itemScrollbar = createScrollbarObject(ItemSelectScrollbar, this);
		//
		this._itemScrollbar.setObjectType(this._listType);
		//No clue what this does, but Goinza's Combat Arts script has it, so it must be good :V
        this._itemScrollbar.setScrollFormation(1, 10);
		//Sets what items are displayed in the window...?
		//I might be able to filter this based on the user's "multiple data" argument
        this._itemScrollbar.setObjectArray(this._itemList);
		//Makes the cursor work...?
        this._itemScrollbar.enableSelectCursor(true);
	},
	
	//moveWindow: function() {
	//	return this.moveWindowContent();
	//},
	
	//Runs every frame. Stops once we've either selected an item
	//Or canceled out
	moveWindowContent: function() {
		//Default to MoveResult.CONTINUE if scrollbar input isn't SELECT or CANCEL
        var result = MoveResult.CONTINUE;
		//Moves scrollbar, and also results input
        var input = this._itemScrollbar.moveInput();
        
        if (input == ScrollbarInput.SELECT) {
            result = MoveResult.SELECT;
        }
        else if (input == ScrollbarInput.CANCEL) {
            result = MoveResult.CANCEL;
        }

        return result;
	},
	
	//Sets what unit to show the inventory of so we can
	//select our item
	setUnit: function(unit) {
		this._unit = unit;
	},
	
	setItemList: function(itemList, listType) {
		this._itemList = itemList;
		this._listType = listType;
	},
	
	//Grabs our selected item from our scrollbar
	//This then proceeds to get passed all the way back up
	//to our event object to be used.
	getSelectedItem: function() {
		return this._itemScrollbar.getObject();
	},
	
	getSelectedIndex: function() {
		return this._itemScrollbar.getIndex();
	},
	
	//Draws the god damn window, finally.
	drawWindow: function(x, y) {
		var width = this.getWindowWidth();
		var height = this.getWindowHeight();
		
		if (!this._isWindowEnabled) {
			return;
		}
		
		this._drawWindowInternal(x, y, width, height);
		
		if (this._drawParentData !== null) {
			this._drawParentData(x, y);
		}
		
		// The move method enables to refer to the coordinate with a mouse.
		this.xRendering = x + this.getWindowXPadding();
		this.yRendering = y + this.getWindowYPadding();
		
		this.drawWindowContent(x + this.getWindowXPadding(), y + this.getWindowYPadding());
		
		this.drawWindowTitle(x, y, width, height);
	},
	
	//Draws the scrollbar for the window (Basically the actual list of items)
	drawWindowContent: function(x, y) {
		this._itemScrollbar.drawScrollbar(x,y);
	},
	
	//I just threw this in here, not knowing what it does.
	drawWindowTitle: function(x, y, width, height) {
		var color, font, pic, titleWidth, dx;
		var titleCount = 6;
		var textui = this.getWindowTitleTextUI();
		var text = this.getWindowTitleText();
		
		if (textui === null || text === '') {
			return;
		}
		
		color = textui.getColor();
		font = textui.getFont();
		pic = textui.getUIImage();
		titleWidth = TitleRenderer.getTitlePartsWidth() * (titleCount + 2);
		dx = Math.floor((width - titleWidth) / 2);
		TextRenderer.drawFixedTitleText(x + dx, y - 50, text, color, font, TextFormat.CENTER, pic, titleCount);
	},
	
	//Didn't touch this or any of the other stuff below.
	getWindowTextUI: function() {
		return root.queryTextUI('default_window');
	},
	
	getWindowTitleTextUI: function() {
		return root.queryTextUI('eventmessage_title');
	},
	
	getWindowTitleText: function() {
		title = ""
		
		if (this._listType == SelectorListType.ITEM) {
			title = 'Select an item';
		}
		else if (this._listType == SelectorListType.SKILL) {
			title = "Select a skill";
		}
		else if (this._listType == SelectorListType.CLASS) {
			title = "Select a class";
		}
		else if (this._listType == SelectorListType.UNIT) {
			title = "Select a unit";
		}
		else if (this._listType == SelectorListType.STATE) {
			title = "Select a state";
		}
		else if (this._listType == SelectorListType.ART) {
			title = "Select an art";
		}
		
		return title;
	},
	
	getWindowWidth: function() {
		return this._itemScrollbar.getObjectWidth() + (this.getWindowXPadding() * 2);;
	},
	
	getWindowHeight: function() {
		result = this._itemScrollbar.getObjectCount() * this._itemScrollbar.getObjectHeight() + (this.getWindowYPadding() * 2);
		
		if (result > 332) {
			result = 332;
		}
		
		return result; 
	},
	
	getWindowXPadding: function() {
		return DefineControl.getWindowXPadding();
	},
	
	getWindowYPadding: function() {
		return DefineControl.getWindowYPadding();
	},
	
	enableWindow: function(isWindowEnabled) {
		this._isWindowEnabled = isWindowEnabled;
	},
	
	setDrawingMethod: function(method) {
		this._drawParentData = method;
	},
	
	_drawWindowInternal: function(x, y, width, height) {
		var pic = null;
		var textui = this.getWindowTextUI();
		
		if (textui !== null) {
			pic = textui.getUIImage();
		}
		
		if (pic !== null) {
			WindowRenderer.drawStretchWindow(x, y, width, height, pic);
		}
	}
}
);