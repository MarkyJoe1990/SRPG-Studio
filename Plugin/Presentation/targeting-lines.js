/*
	Version 3
	Made by MarkyJoe1990
	
	This implements enemy targeting lines similar to Fire Emblem: Three Houses.
	Unlike other scripts that implement this feature, this one is heavily
	optimized and should not cause any lag or slow down in performance.
	
	For this script to work, you will need my Enemy Range Collector script
	as well, since it collects the enemy ranges that this script uses.

	This plugin does not override any functions. However, the Enemy Range
	Collector does, so please be wary that it might conflict with other
	scripts you might have.
*/

var TARGETING_LINE_COLOR = 0xFF0000; // Red
var LINES_LONG_RANGE_COLOR = 0xFF00FF;
var LINES_STAFF_COLOR = 0x00FF00;

var LineGenerator = defineObject(BaseObject, {
	_enemiesInRange: [],
	_graphicsManager: null,
	_canvas: null,
	_x: -1,
	_y: -1,
	_cachedImage: null,
	
	initialize: function() {
		this._graphicsManager = root.getGraphicsManager();
		this._canvas = this._graphicsManager.getCanvas();
		this._enemiesInRange = [];

		// Requires Enemy Range Collector for grabbing enemy ranges
		this._rangeDataArray = CurrentMap.getEnemyRangeCollector().getRangeDataArray();
	},
	
	moveLineGenerator: function() {
		var mapSequenceArea = this.getParentInstance();

		// Check for changes in cursor movement.
		var mapX = root.getCurrentSession().getMapCursorX();
		var mapY = root.getCurrentSession().getMapCursorY();

		// Only update targeting line ranges if a unit is selected,
		// and the cursor has moved.
		if (mapX !== this._x || mapY !== this._y) {
			this._x = mapX;
			this._y = mapY;
			this._index = CurrentMap.getIndex(this._x, this._y);
			this._enemiesInRange = [];
			if (mapSequenceArea._isPlaceSelectable() === true) {
				var found;
				var i, currentRangeData, count = this._rangeDataArray.length;
				var x, count2;
				for (i = 0; i < count; i++) {
					currentRangeData = this._rangeDataArray[i];
	
					found = false;
					count2 = currentRangeData.weaponIndexArray.length;
					for (x = 0; x < count2; x++) {
						if (this._index == currentRangeData.weaponIndexArray[x]) {
							found = true;
							this._enemiesInRange.push(currentRangeData.unit);
							break;
						}
					}
	
					if (found === false) {
						count2 = currentRangeData.indexArray.length;
						for (x = 0; x < count2; x++) {
							if (this._index == currentRangeData.indexArray[x]) {
								this._enemiesInRange.push(currentRangeData.unit);
								break;
							}
						}
					}
				}
			}

			this.update();
		}
	},

	update: function() {
		this._cachedImage = this._graphicsManager.createCacheGraphics(CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH, CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT);
		this._graphicsManager.setRenderCache(this._cachedImage);

		// Draw the lines
		var myX = (this._x * GraphicsFormat.MAPCHIP_WIDTH) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
		var myY = (this._y * GraphicsFormat.MAPCHIP_HEIGHT) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
		
		var i, count = this._enemiesInRange.length;
		var j, currentItem, count2;

		for (i = 0; i < count; i++) {
			var currentUnit = this._enemiesInRange[i];
			if (currentUnit.getAliveState() != AliveType.ALIVE || currentUnit.isInvisible() === true) {
				continue;
			}

			var color = TARGETING_LINE_COLOR;
			var weapon = ItemControl.getEquippedWeapon(currentUnit);
			if (weapon != null) {
				var targetingLineColor = weapon.custom.targetingLineColor;
				if (targetingLineColor != undefined) {
					color = targetingLineColor;
				}
			} else {
				count2 = UnitItemControl.getPossessionItemCount(currentUnit);
				for (j = 0; j < count2; j++) {
					currentItem = UnitItemControl.getItem(currentUnit, j);
					if (!ItemControl.isItemUsable(currentUnit, currentItem)) {
						continue;
					}

					var targetingLineColor = currentItem.custom.targetingLineColor;
					if (targetingLineColor != undefined) {
						color = targetingLineColor;
					}
				}
			}

			
			var currentX = (currentUnit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) + Math.floor(GraphicsFormat.MAPCHIP_WIDTH / 2);
			var currentY = (currentUnit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + Math.floor(GraphicsFormat.MAPCHIP_HEIGHT / 2);
			
			var figure = this._canvas.createFigure();
			figure.beginFigure(currentX, currentY);
			
			var distance = Math.floor((currentX + myX) / 2);
			
			var myFocus = {
				x:distance,
				y:myY - 100
			}
			
			figure.addBezier(currentX, currentY, myFocus.x, myFocus.y, myX, myY);
			figure.addBezier(myX, myY, myFocus.x, myFocus.y, currentX, currentY);
			figure.endFigure()
			
			this._canvas.setStrokeInfo(color, 128, 3, false);
			this._canvas.setFillColor(0xFFFFFF, 128);
			this._canvas.drawFigure(0, 0, figure);
		}

		// End drawing the lines
		this._graphicsManager.resetRenderCache();
	},
	
	drawLineGenerator: function() {
		var session = root.getCurrentSession();
		var x = 0;
		var y = 0;
		var scrollX = session.getScrollPixelX();
		var scrollY = session.getScrollPixelY();
		var width = root.getGameAreaWidth();
		var height = root.getGameAreaHeight();

		if (this._cachedImage !== null) {
			if (this._cachedImage.isCacheAvailable()) {
				this._cachedImage.drawParts(x, y, scrollX, scrollY, width, height);
				return;
			}
		}
	}
});


(function () {
	var alias1 = MapSequenceArea._prepareSequenceMemberData;
	MapSequenceArea._prepareSequenceMemberData = function(parentTurnObject) {
		this._lineGenerator = createObjectEx(LineGenerator, this);
		alias1.call(this, parentTurnObject);
	}

	var alias2 = MapSequenceArea._moveArea;
	MapSequenceArea._moveArea = function() {
		this._lineGenerator.moveLineGenerator();
		return alias2.call(this);
	}

	var alias3 = MapSequenceArea._drawArea;
	MapSequenceArea._drawArea = function() {
		alias3.call(this);
		this._lineGenerator.drawLineGenerator();
	}
}) ();