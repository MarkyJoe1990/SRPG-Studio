/*
	Version 1.0
	Made by MarkyJoe1990 (Additions by Stephen Molen)
	
	This plugin interpolates movement during battle animations, making them
	significantly smoother and allowing them to display at 60 FPS without
	extreme effort. This is achieved by positioning the unit and their weapon
	based on the current animation frame's coordinates, the upcoming
	animation frame's, and the time it takes between the two.
	
	This plugin overrides the original functions for:
	
	* AnimeMotion.drawMotion
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
	
*/

(function() {
	var getAnimeDifference = function(animeMotion, i) {
		var motionCategoryType = animeMotion._animeData.getMotionCategoryType(animeMotion._motionId)
		var spriteType = animeMotion._animeData.getSpriteType(animeMotion._motionId, animeMotion._frameIndex, i)
		var weaponThrown = false;
		
		//Check every previous frame for the weapon being thrown
		for (x = 0; x <= animeMotion._frameIndex; x++) {
			if (animeMotion._animeData.isThrowFrame(animeMotion._motionId, x)) {
				weaponThrown = true;
				break;
			}
		}
		
		//Prevent melee weapon from freaking out during swings
		if (motionCategoryType == MotionCategoryType.ATTACK && spriteType != spriteType.KEY) {
			return 0;
		}
		
		if ( (motionCategoryType == MotionCategoryType.SHOOT || motionCategoryType == MotionCategoryType.THROW) && !weaponThrown) {
			return 0;
		}
		
		//Credit to Stephen Molen
		if (motionCategoryType === MotionCategoryType.MAGICATTACK  && spriteType != spriteType.KEY)
		{
			return 0;	
		}
		
		var currentX = animeMotion._animeData.getSpriteX(animeMotion._motionId, animeMotion._frameIndex, i);
		var nextX = animeMotion._animeData.getSpriteX(animeMotion._motionId, animeMotion._frameIndex + 1, i);
		if (nextX == -1) {
			nextX = currentX;
		}
		
		var difference = Math.abs(currentX - nextX);
		var timerDivide = animeMotion._counter.getCounter() / animeMotion._counter._max;
		
		var finalInterpolation = Math.floor(difference * timerDivide);
		if (!animeMotion._animeRenderParam.isRight) {
			finalInterpolation *= -1;
		}
		
		
		return finalInterpolation;
	}
	
	var alias1 = RealAutoScroll.startScroll;
	RealAutoScroll.startScroll = function(xGoal) {
		alias1.call(this, xGoal);
		this._counter.setCounterInfo(-1);
	}
	
	var alias2 = AnimeMotion.getFocusX;
	AnimeMotion.getFocusX = function() {
		result = alias2.call(this);
		var index = this._getSpriteIndexFromFocus();
		var interpolation = 0;
		
		interpolation = getAnimeDifference(this, index);
		
		return result - interpolation;
	}
	
	var alias3 = AnimeMotion.drawMotion;
	AnimeMotion.drawMotion = function(xScroll, yScroll) {
		var i, spriteType;
		var count = this._animeData.getSpriteCount(this._motionId, this._frameIndex);
		var motionCategoryType = this._animeData.getMotionCategoryType(this._motionId);
		var keyIndex = this._getSpriteIndexFromSpriteType(SpriteType.KEY, this._frameIndex);
		var animeCoordinates = StructureBuilder.buildAnimeCoordinates();
		var interpolation = 0;
		
		// If the weapon or the optional sprite coordinate is calculated, the information of the key sprite is needed.
		animeCoordinates.keySpriteWidth = this._animeData.getSpriteWidth(this._motionId, this._frameIndex, keyIndex);
		animeCoordinates.xCenter = Math.floor(GraphicsFormat.BATTLEBACK_WIDTH / 2) - Math.floor(animeCoordinates.keySpriteWidth / 2);
		animeCoordinates.keySpriteHeight = this._animeData.getSpriteHeight(this._motionId, this._frameIndex, keyIndex);
		animeCoordinates.yCenter = GraphicsFormat.BATTLEBACK_HEIGHT - root.getAnimePreference().getBoundaryHeight() - animeCoordinates.keySpriteHeight;
		
		for (i = 0; i < count; i++) {
			spriteType = this._animeData.getSpriteType(this._motionId, this._frameIndex, i);
			if (this._isSpriteHidden(i, spriteType, motionCategoryType)) {
				continue;
			}
			
			if (!this._animeData.isSpriteEnabled(this._motionId, this._frameIndex, i)) {
				continue;
			}
			
			interpolation = getAnimeDifference(this, i);
			
			animeCoordinates.xBase = this._xBase[i] - xScroll - interpolation;
			animeCoordinates.yBase = this._yBase[i] - yScroll;
			animeCoordinates.dx = this._xOffset;
			animeCoordinates.dy = this._yOffset;
			if (spriteType === SpriteType.KEY || spriteType === SpriteType.OPTION) {	
				this._animeSimple.drawMotion(this._frameIndex, i, this._animeRenderParam, animeCoordinates);
			}
			else {
				if (this._isWeaponShown) {
					this._animeSimple.drawWeapon(this._frameIndex, i, this._animeRenderParam, animeCoordinates);
				}
			}
		}
	}
	
}) ();