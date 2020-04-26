var ItemSelectScrollbar = defineObject(BaseScrollbar, {
	_listType: null,
	//Draws the item list in our Item Selection Window
    drawScrollContent: function(x, y, object, isSelect, index) {
		var icon;
        var item = object;
        
        var name = item.getName();
		var range = createRangeObject(x,y,this.getScrollbarWidth()-24,24);

        var textui = this.getParentTextUI();
		var color = textui.getColor();
		var font = textui.getFont();

		if (this._listType == SelectorListType.UNIT) {
			UnitRenderer.drawDefaultUnit(item, x, y-4, null)
		} else if (this._listType == SelectorListType.CLASS) {
			icon = item.getCharChipResourceHandle();
			GraphicsRenderer.drawImage(x-15,y-20, icon, GraphicsType.CHARCHIP);
		} else {
			icon = item.getIconResourceHandle();
			GraphicsRenderer.drawImage(x+10, y, icon, GraphicsType.ICON);
		}
        
        TextRenderer.drawText(x + 32+10, y + 2, name, -1, color, font);
		
		if (this._listType == SelectorListType.ITEM) {
			var durability = item.getLimit();
			NumberRenderer.drawNumber(x+200,y,durability);
		}
		if (this._listType == SelectorListType.ART) {
			var cost = item.custom.cost;
			NumberRenderer.drawNumber(x+200,y,cost);
		}
		if (this._listType == SelectorListType.STATE) {
			var turns = item.getTurn();
			NumberRenderer.drawNumber(x+200,y,turns);
		}
    },
    
	setObjectType: function(objectType) {
		this._listType = objectType;
	},
	
	//Didn't touch this or the one below it
    getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
    },
	
	playCancelSound: function() {
	}
})