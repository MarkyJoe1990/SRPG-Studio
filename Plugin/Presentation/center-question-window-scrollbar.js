/*
    Made by MarkyJoe1990

    A simple plugin that centers the Yes/No options
    on the Question Window.
*/

( function () {
    var alias1 = QuestionWindow.drawWindowContent;
    QuestionWindow.drawWindowContent = function(x, y) {
		var length = this._getTextLength();
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		y += 10;
		TextRenderer.drawText(x, y, this._message, length, color, font);
		
        x += Math.floor((this.getWindowWidth() - this._scrollbar.getScrollbarWidth()) / 2);
		this._scrollbar.drawScrollbar(x, y);
    }

    var alias2 = QuestionScrollbar.getScrollXPadding;
    QuestionScrollbar.getScrollXPadding = function() {
        return 0;
    }
}) ();