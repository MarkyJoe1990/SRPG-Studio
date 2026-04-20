/*
	Randomized Frame Jumping
	by MarkyJoe1990 v1.0

	This implements a basic randomized frame jumping
	system for people looking to make their battle
	animations a little less stiff and predetermined.

	Simply go to the frame you want to have a branching
	animation for, go to custom parameters and create
	a property called frameJumpChanceArray. This will
	contain a list of all possible frames to jump to
	if their given percentage chance is met.

	Example:
	custom.frameJumpChanceArray: [
		{
			index: 10,
			percent: 33
		}
	],
	[
		{
			index: 15,
			percent: 50
		}
	]

	For this frame, there is a 33% chance to jump to frame 10
	of the battle animation. If that fails, it will roll a 50%
	chance to jump to frame 15 instead. If both checks fail,
	the animation will proceed forward as normal.
*/

( function () {
	var alias1 = BaseBattler._checkLoopZone;
	BaseBattler._checkLoopZone = function() {
		var motion = this._motion;
		var animeCustom = motion._animeData.getFrameCustom(motion._motionId, motion._frameIndex);

		// Add frame jump
		var frameJumpChanceArray = animeCustom.frameJumpChanceArray;
		if (frameJumpChanceArray != undefined) {
			var i, frameJumpChance, count = frameJumpChanceArray.length;
			for (i = 0; i < count; i++) {
				frameJumpChance = frameJumpChanceArray[i];
				if (Math.floor(Math.random() * 100) < frameJumpChance.percent) {
					motion.setFrameIndex(frameJumpChance.index, true);
					return false;
				}
			}
		}

		var isForceEnd = animeCustom.isForceEnd;
		if (isForceEnd === true) {
			return true;
		}

		return alias1.call(this);
	}
}) ();