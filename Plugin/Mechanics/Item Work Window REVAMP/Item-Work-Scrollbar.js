// Uses BaseListCommand objects

( function () {
    // Overwrites ItemWorkScrollbar
    ItemWorkScrollbar = defineObject(ItemWorkScrollbar, {
        drawScrollContent: function(x, y, object, isSelect, index) {
            var command = object;
            var length = this.getObjectWidth();
            var textui = this.getParentTextUI();
            var color = textui.getColor();
            var font = textui.getFont();

            if (!this._isEnabled(command)) {
                color = ColorValue.DISABLE;
            }
        
            TextRenderer.drawKeywordText(x, y, command.getCommandName(), length, color, font);
        },

        playSelectSound: function() {
            var object = this.getObject();
            var isSelect = this._isEnabled(object);
            
            if (isSelect) {
                MediaControl.soundDirect('commandselect');
            }
            else {
                MediaControl.soundDirect('operationblock');
            }
        },

        _isEnabled: function(command) {
            var workIndex = command.getOriginalWorkIndex();
            if (workIndex != -1) {
                return this.getParentInstance().getParentInstance().isWorkAllowed(workIndex);
            }

            return command.isWorkEnabled();
        }
    });
}) ();