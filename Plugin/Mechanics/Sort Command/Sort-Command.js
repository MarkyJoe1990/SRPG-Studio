var ItemSortMode = {
    SELECT: 0,
    SORT: 1
};

( function () {
    UnitCommand.Sort = defineObject(UnitListCommand, {
        _prevIndex: -1,

        openCommand: function() {
            this._itemListWindow = createWindowObject(ItemListWindow, this);
            this._itemListWindow.enableSelectCursor(true);
            this._commandCursor = createObject(CommandCursor);

            this._resetItemList();
        },

        _resetItemList: function() {
            var unit = this.getCommandTarget();
            var count = UnitItemControl.getPossessionItemCount(unit);
            var visibleCount = 8;
            
            if (count > visibleCount) {
                count = visibleCount;
            }

            this._itemListWindow.setItemFormation(count);
            this._itemListWindow.setUnitItemFormation(unit);
        },

        moveCommand: function() {
            var mode = this.getCycleMode();
            var input = this._itemListWindow.moveWindow();

            if (mode === ItemSortMode.SELECT) {
                if (input === ScrollbarInput.SELECT) {
                    this._prevIndex = this._itemListWindow.getItemIndex();
                    this._itemListWindow._drawParentData = this._drawPrevCursor;
                    this.changeCycleMode(ItemSortMode.SORT);
                } else if (input === ScrollbarInput.CANCEL) {
                    return MoveResult.CANCEL;
                }
            } else if (mode === ItemSortMode.SORT) {
                if (input === ScrollbarInput.SELECT) {
                    this._rearrangeItems();
                    this._itemListWindow._drawParentData = null;
                    this.changeCycleMode(ItemSortMode.SELECT);
                } else if (input === ScrollbarInput.CANCEL) {
                    this._itemListWindow._drawParentData = null;
                    this.changeCycleMode(ItemSortMode.SELECT);
                }
            }

            return MoveResult.CONTINUE;
        },

        _drawPrevCursor: function() {
            var parent = this.getParentInstance();
            var itemListWindow = parent._itemListWindow;
            var height = itemListWindow._scrollbar.getObjectHeight();
            var x = this.xRendering;
            var y = this.yRendering + (parent._prevIndex * height);
            var commandCursor = parent._commandCursor;

            commandCursor.drawCursor(x, y, false, root.queryUI("command_selectcursor"));
        },

        _rearrangeItems: function() {
            var unit = this.getCommandTarget();
            var targetIndex = this._prevIndex;
            var fastIndex = this._itemListWindow.getItemIndex();
    
            var item = UnitItemControl.getItem(unit, fastIndex);
            var targetItem = UnitItemControl.getItem(unit, targetIndex);
            UnitItemControl.setItem(unit, fastIndex, targetItem);
            UnitItemControl.setItem(unit, targetIndex, item);
            
            ItemControl.updatePossessionItem(unit);
    
            this._resetItemList();

            this._itemListWindow.setItemIndex(fastIndex);
        },

        drawCommand: function() {
            var x = LayoutControl.getUnitBaseX(this.getCommandTarget(), this._itemListWindow.getWindowWidth());
            var y = LayoutControl.getCenterY(-1, 340);

            this._itemListWindow.drawWindow(x, y);
        },
        
        getCommandName: function() {
            return "Sort";
        }
    });

}) ();