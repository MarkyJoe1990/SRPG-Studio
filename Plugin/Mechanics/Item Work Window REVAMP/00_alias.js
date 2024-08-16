( function () {
    ItemSelectMenuMode.COMMAND = 3;

    var alias1 = ItemSelectMenu.isWorkAllowed;
    ItemSelectMenu.isWorkAllowed = function(index) {
        if (index !== -1) {
            return alias1.call(this, index);
        }

        return this._itemWorkWindow._scrollbar.getObject().isWorkAllowed();
    }

    var alias2 = ItemSelectMenu._doWorkAction;
    ItemSelectMenu._doWorkAction = function(index) {
        if (index !== -1) {
            return alias2.call(this, index);
        }

        this._itemWorkWindow._scrollbar.getObject().openCommand();
        this.changeCycleMode(ItemSelectMenuMode.COMMAND);
        return ItemSelectMenuResult.NONE;
    }

    var alias3 = ItemSelectMenu.moveWindowManager;
    ItemSelectMenu.moveWindowManager = function() {
        var mode = this.getCycleMode();
        if (mode === ItemSelectMenuMode.COMMAND) {

            var result = this._moveCommand();
            if (result !== MoveResult.CONTINUE) {
                this.changeCycleMode(ItemSelectMenuMode.ITEMSELECT);
            }

            this._itemInfoWindow.moveWindow();
            return result;
        }

        return alias3.call(this);
    }

    var alias4 = ItemSelectMenu.drawWindowManager;
    ItemSelectMenu.drawWindowManager = function() {
        alias4.call(this);

        var mode = this.getCycleMode();
        if (mode === ItemSelectMenuMode.COMMAND) {
            this._drawCommand();
        }
    }

    ItemSelectMenu._moveCommand = function() {
        return this._itemWorkWindow._scrollbar.getObject().moveCommand();
    }

    ItemSelectMenu._drawCommand = function() {
        return this._itemWorkWindow._scrollbar.getObject().drawCommand();
    }

}) ();
