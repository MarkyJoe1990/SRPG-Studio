/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin makes it so you can see how much
	HP you and your target will have left should
	you choose to initiate the current battle. It
	assumes all attacks will hit, and does not
	distinguish multiple hits from each other. It
	simply shows how much your total damage will
	be.
	
	This plugin overrides the original functions for:
	
	* PosAttackWindow.drawInfoTop
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
*/

(function () {
	//Sets PosAttackWindows to be able to access their sibling's damage data
	var alias1 = PosMenu.changePosTarget;
	PosMenu.changePosTarget = function(targetUnit) {
		alias1.call(this, targetUnit);

		this._posWindowLeft.setPosInfo2(this._posWindowRight);
		this._posWindowRight.setPosInfo2(this._posWindowLeft);
	}
	
	//Used for PosAttackWindow later
	var alias2 = PosBaseWindow.setPosInfo2;
	PosBaseWindow.setPosInfo2 = function(otherWindow) {
	}
	
	//Exclusive to PosAttackWindow. Allows you to access other window's damage data.
	var alias3 = PosAttackWindow.setPosInfo2;
	PosAttackWindow.setPosInfo2 = function(otherWindow) {
		var otherStatus = otherWindow._statusArray;
		if (otherStatus == null) {
			return;
		}
		
		//Other damage, and other roundcount
		this._otherDamage = otherStatus[0];
		this._otherAttackCount = otherWindow._roundAttackCount;
	}
	
	var alias4 = PosAttackWindow.drawInfoTop;
	PosAttackWindow.drawInfoTop = function(xBase, yBase) {
		var x = xBase;
		var y = yBase;
		var pic = root.queryUI('unit_gauge');
		var balancer = this._gaugeBar.getBalancer();
		
		if (this._unit !== null) {
			//this._gaugeBar.drawGaugeBar(x, y + 40, pic);
			//TRY DRAWING THE GAUGEBAR
			
			var damage = this._otherDamage;
			var attackCount = this._otherAttackCount;
			var currentHp = this._gaugeBar._balancer.getCurrentValue();
			var maxHp = this._gaugeBar._balancer.getMaxValue();
			var width = this._gaugeBar.getGaugeWidth();
			var colorIndex = this._gaugeBar._colorIndex;
			
			var totalDamage = damage * attackCount;
			
			if (currentHp - totalDamage < 0) {
				totalDamage = currentHp;
			}
			
			var destHp = currentHp - totalDamage;
			
			//root.log(totalDamage);
			
			ContentRenderer.drawHp(x, y + 20, currentHp, maxHp);
			ContentRenderer.drawGauge2(xBase, yBase + 40, destHp, totalDamage, maxHp, colorIndex, width, pic);
		}
	}
	
	ContentRenderer.drawHp2 = function(x, y, destHp, currentHp, maxHp) {
		var textHp = this._getHpText();
		var textSlash = '/';
		var dx = [0, 44, 60, 98];
		
		TextRenderer.drawSignText(x + dx[0], y, textHp);
		
		NumberRenderer.drawNumber(x + dx[1], y, currentHp);
		NumberRenderer.drawNumber(x + 22, y, destHp);
		
		TextRenderer.drawSignText(x + dx[2], y, textSlash);
		NumberRenderer.drawNumber(x + dx[3], y, maxHp);
	}
	
	ContentRenderer.drawGauge2 = function(x, y, destValue, totalDamage, maxValue, colorIndex, totalWidth, pic) {
		var i, n, per, full, per2, totalDamage;
		var width = UIFormat.GAUGE_WIDTH / 3;
		var height = UIFormat.GAUGE_HEIGHT / 4;
		var max = totalWidth / 10;
		
		var dx = 0;
		var alreadySet = false;
		
		if (pic === null) {
			return;
		}
		
		per = ((destValue / maxValue) * max);
		per2 = ((totalDamage / maxValue) * max);
		
		if (per > 0 && per < 1) {
			per = 0;
		}
		else {
			// per is greater than 1.
			// Subtract 1 so as to be 0 base.
			per -= 1;
		}
		
		for (i = 0; i < max; i++) {
			if (i === 0) {
				n = 0;
			}
			else if (i === max - 1) {
				n = 2;
			}
			else {
				n = 1;
			}
			
			if (per >= i) {
				full = colorIndex;
			}
			else if (per + per2 >= i) {
				full = 2;// + ((colorIndex+1) % 1);
			}
			else {
				full = 0;
			}
		
			pic.drawParts(x + (i * width), y, n * width, full * height, width, height);
			
			if (per >= i + 1) {
			}
			else if (per + per2 >= i && !alreadySet) {
				dx = i;
				alreadySet = true;
			}
		}
		
		NumberRenderer.drawRightNumberColor(x + (dx * width) + 8, y - 6, destValue, 0, 255);
	}
	
}) ();