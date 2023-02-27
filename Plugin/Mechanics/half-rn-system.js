/*
	Version 1.0
	Made by MarkyJoe1990 with help from Goinza
	
	Normally, when determining if an attack will hit, the game generates an RN,
	or Random Number between 0 and 99. If that value is less than your hit rate,
	then the move connects. In a 2RN system, two RNs are generated, then averaged
	before being compared to your hit rate. 2RN has the effect of making higher
	hit rates much more likely to hit than what the game displays, and lower hit
	rates much less likely to hit than what the game displays.
	
	However, this script creates what I'll call a "Half RN" system. It makes high
	hit rates LESS likely to hit than what is displayed, and low hit rates more likely.
	Whereas 2RN increases the "consistency" of hit rates, this system decreases it,
	which might make it the perfect mechanic for games designed to frustrate the player.
*/

(function(){
	var alias1 = Probability.getProbability;
	Probability.getProbability = function(percent) {
		var n, m, t;
		
		if (percent >= this.getMaxPercent()) {
			// If it's greater than 100, return true without condition.
			return true;
		}
		
		if (percent <= 0) {
			return false;
		}
		
		// n is a value between 0 and 99.
		n = this.getRandomNumber() % 100;
		if (n < 50) {
			m = this.getRandomNumber() % (n + 1);
		} else {
			m = (this.getRandomNumber() % (100 - n + 1)) + n;
		}
		t = Math.floor( (n+m) / 2);
		
		if (isNaN(t)) {root.msg("Whoa! Looks like the random number value turned out to be NaN!\n\nTake a screenshot of this and tell MarkyJoe about it.\n\nn = " + n + "\nm = " + m + "")}
		
		return percent > t;
	}
}) ();