// This is a global object

// Needs to have a method that queues checking all enemies on the map
// This is not a movable object. It acts partly as a wrapper.
// Line Generator will be movable and will mostly handle drawing lines
// and checking unit ranges.

var ENABLE_ENEMY_RANGE_DEBUG = false;

var EnemyRangeCollector = defineObject(BaseObject, {
    _rangeDataArray: null,
    _enemyList: null,
    _enemyCount: 0,
    _currentIndex: 0,
    _combinedIndexArray: null,
    _switchArray: null,
    _weaponSwitchArray: null,
    _timePassed: 0,

    initialize: function() {
        var enemyRangeCollectorData = this.reloadRangeData();
        this._rangeDataArray = enemyRangeCollectorData.rangeDataArray;
        this._combinedIndexArray = enemyRangeCollectorData.combinedIndexArray;
        this._switchArray = enemyRangeCollectorData.switchArray;
        this._weaponSwitchArray = enemyRangeCollectorData.weaponSwitchArray;

        this._isSplashControlEnabled = typeof SplashControl != "undefined";
        this._isEnemyRangeEnabled = typeof EnemyRange != "undefined";
        this.reset();
    },

    reset: function() {
        this._timePassed = 0;
        this._enemyList = root.getCurrentSession().getEnemyList();
        this._enemyCount = this._enemyList.getCount();
        this._currentIndex = 0;
    },

    // Check units every two frames
    moveEnemyRangeCollector: function() {
        if (this._timePassed % 2 === 0) {
            this.checkNextUnit();
        }
    },

    // returns boolean isContinue
    checkNextUnit: function() {
        var unit = null;
        var attackRange = null;
        var rangeData = null;

        for (; this._currentIndex < this._enemyCount; this._currentIndex++) {
            unit = this._enemyList.getData(this._currentIndex);

            if (unit == null) {
                continue;
            }

            attackRange = UnitRangePanel.getUnitAttackRange(unit);

            // Check rangeData
            rangeData = this._rangeDataArray[this._currentIndex];

            if (rangeData != undefined) {
                if (rangeData.unit != unit) {
                    this.removeFromCombinedIndexArray(rangeData);
                    
                    var nextRangeData = this.getRangeDataFromId(unit.getId());
                    if (nextRangeData != null) {
                        rangeData = nextRangeData;
                        this.addToCombinedIndexArray(rangeData);
                        this._rangeDataArray[this._currentIndex] = rangeData;
                    } else {
                        rangeData = undefined;
                    }
                }
            }
            
            if (rangeData == undefined) {
                rangeData = this._buildRangeData();
                rangeData.unit = unit;
                rangeData.id = unit.getId();
                rangeData.attackRange = attackRange;
                this._rangeDataArray[this._currentIndex] = rangeData;
            }

            // Update and track attack range in case it changed.
            rangeData.prevAttackRange = rangeData.attackRange;
            rangeData.attackRange = attackRange;

            // Will this unit have a relevant attack range?
            if (this.isValidUnit(unit) === true) {
                // If not, can this unit's range be skipped?
                if (this.isRangeDataSkippable(rangeData) === false) {
                    // If not, update!
                    this.removeFromCombinedIndexArray(rangeData);
                    this.updateRangeData(rangeData);
                    this.addToCombinedIndexArray(rangeData);
                    if (this._isEnemyRangeEnabled === true) {
                        EnemyRange.updateRange();
                        UnitStateAnimator.updateIcons();
                    }

                    break;
                }
            } else {
                this.removeFromCombinedIndexArray(rangeData);
                this.nullRangeData(rangeData);
                this.addToCombinedIndexArray(rangeData);
                if (this._isEnemyRangeEnabled === true) {
                    EnemyRange.updateRange();
                    UnitStateAnimator.updateIcons();
                }
            }
        }

        if (this._currentIndex >= this._enemyCount) {

            if (this._enemyCount < this._rangeDataArray.length) {
                // Trim off any leftover rangeData from when
                // units were removed from the enemy list.
                var i, count = this._rangeDataArray.length;
                for (i = count - 1; i >= this._enemyCount; i--) {
                    this.removeFromCombinedIndexArray(this._rangeDataArray[i]);
                    this._rangeDataArray.pop();
                }
            }

            return false;
        }

        this._currentIndex++;
        return true;
    },

    getUnitRangeData: function(unit) {
        var i, currentRangeData, count = this._rangeDataArray.length;
        for (i = 0; i < count; i++) {
            currentRangeData = this._rangeDataArray[i];
            if (currentRangeData.unit == unit) {
                return currentRangeData;
            }
        }
        
        return null;
    },

    getRangeDataFromId: function(id) {
        var i, currentRangeData, count = this._rangeDataArray.length;
        for (i = 0; i < count; i++) {
            currentRangeData = this._rangeDataArray[i];
            if (currentRangeData.id == id) {
                return currentRangeData;
            }
        }
        
        return null;
    },

    getCurrentIndex: function() {
        return this._currentIndex;
    },

    getEnemyCount: function() {
        return this._enemyList.getCount();
    },

    getRangeDataArray: function() {
        return this._rangeDataArray;
    },

    isRangeDataSkippable: function(rangeData) {
        // Check for change in position may not be needed
        // depending on how indexArray is generated.
        var currentAttackRange = rangeData.attackRange;
        var prevAttackRange = rangeData.prevAttackRange;
        if (currentAttackRange.endRange != prevAttackRange.endRange || currentAttackRange.startRange != prevAttackRange.startRange) {
            return false;
        }

        if (this._isPosChanged(rangeData) === true) {
            return false;
        }

        // Check for changes in movement points
        if (this._isTerrainChanged(rangeData) === true) {
            return false;
        }

        return true;
    },

    isValidUnit: function(unit) {
        if (unit === null) {
            return false;
        }

        if (unit.getAliveState() != AliveType.ALIVE) {
            return false;
        }

        if (this._isInvisible(unit) === true) {
            return false;
        }
		
		return true;
	},

    drawDebug: function() {
        var textui = root.queryTextUI("default_window");
        var color = textui.getColor();
        var font = textui.getFont();
        var session = root.getCurrentSession();

        var scrollX = session.getScrollPixelX();
        var scrollY = session.getScrollPixelY();

        var i, count = this._switchArray.length;
        var x, y;
        for (i = 0; i < count; i++) {
            x = (CurrentMap.getX(i) * GraphicsFormat.MAPCHIP_WIDTH) - scrollX;
            y = (CurrentMap.getY(i) * GraphicsFormat.MAPCHIP_HEIGHT) - scrollY;

            TextRenderer.drawText(x, y, this._switchArray[i], -1, color, font);
        }

    },

    _isInvisible: function(unit) {
        if (unit.isInvisible() === true) {
            return true;
        }

        if (typeof CurrentMap.checkInvisibleUnit != "undefined") {
            if (CurrentMap.checkInvisibleUnit(unit.getMapX(), unit.getMapY(), UnitType.PLAYER) === true) {
                return true;
            }
        }

        return false;
    },

    isAttackerUnit: function(rangeData) {
        var unit = rangeData.unit;

        if (rangeData.attackRange.endRange === 0) {
            return false;
        }

        if (StateControl.isBadStateOption(unit, BadStateOption.NOACTION) === true) {
            return false;
        }

        if (unit.custom.alwaysIncludeAttackRange === true) {
            return true;
        }


        if (unit.custom.neverIncludeAttackRange === true) {
            return false;
        }

        var aiPattern = unit.createAIPattern();
		if (aiPattern == null) {
			return false;
		}

		if (aiPattern.getPatternType() === PatternType.MOVE) {
            if (aiPattern.getMovePatternInfo().getMoveAIType() === MoveAIType.MOVEONLY) {
                return false;
            }
        };
        
		if (aiPattern.getPatternType() === PatternType.WAIT) {
            if (aiPattern.getWaitPatternInfo().isWaitOnly() === true) {
                return false;
            }
        };

        return true;
    },

    updateRangeData: function(rangeData) {
        var unit = rangeData.unit;
        var attackRange = rangeData.attackRange;
        var isWeapon = this.isAttackerUnit(rangeData);
        var simulator = root.getCurrentSession().createMapSimulator();

        // Update coordinates
        rangeData.x = unit.getMapX();
        rangeData.y = unit.getMapY();
        rangeData.indexArray = [];
        rangeData.weaponIndexArray = [];
        rangeData.isPassUnit = this._isPassUnit(unit);

        if (rangeData.isPassUnit === true) {
            simulator.disableMapUnit();
        }

        // Update indexArray
        if (isWeapon === true) {
            simulator.startSimulationWeapon(unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
        } else {
            simulator.startSimulation(unit, attackRange.mov);
        }

        if (StateControl.isBadStateOption(unit, BadStateOption.NOACTION) === true) {
            rangeData.indexArray = [CurrentMap.getIndex(rangeData.x, rangeData.y)];
        } else {
            rangeData.indexArray = simulator.getSimulationIndexArray();
        }
        
        // Update Weapon Index Array
        if (isWeapon === true) {
            var weapon = ItemControl.getEquippedWeapon(unit);
            if (this._isSplashControlEnabled === true && weapon != null && SplashControl.hasSplashTiles(weapon)) {
                rangeData.weaponIndexArray = this._getSplashWeaponIndexArray(rangeData.indexArray, weapon);
            } else {
                rangeData.weaponIndexArray = simulator.getSimulationWeaponIndexArray();
            }
        }

        // DON'T FORGET LOCATION SPLASH TILES!
        if (this._isSplashControlEnabled === true) {
            var indexArray = rangeData.indexArray;
            var disallowedArray = SplashControl.createDisallowedArray(indexArray);
            var i, currentIndex, count = indexArray.length;
            for (i = 0; i < count; i++) {
                currentIndex = indexArray[i];
                var x = CurrentMap.getX(currentIndex);
                var y = CurrentMap.getY(currentIndex);
                
                var splashPlace = PosChecker.getPlaceEventFromPos(PlaceEventType.CUSTOM, x, y);
                if (splashPlace == null) {
                    continue;
                }
                
                if (splashPlace.custom.ignoreUnlessPrioritized === true && unit.custom.prioritizeSplashPlace != true) {
                    continue;
                }
                
                var occupantUnit = PosChecker.getUnitFromPos(x, y);
                if (occupantUnit == null || occupantUnit == unit) {
                    var splashPlaceEventInfo = splashPlace.getPlaceEventInfo();
                    if (splashPlaceEventInfo.getCustomKeyword() == "Splash") {
                        var allowedTiles = SplashControl.getAllowedTiles(splashPlace);
                        var splashTiles = SplashControl.getSplashTiles(splashPlace);
                        var flipType = SplashControl.getFlipType(splashPlace);
                        var prevAllowedArray = Array(CurrentMap.getSize());
                        
                        rangeData.weaponIndexArray = SplashControl.createSplashRangeIndexArray(x, y, allowedTiles, splashTiles, flipType, rangeData.weaponIndexArray, prevAllowedArray, disallowedArray);
                    }
                }
            }
        }
        // END SPLASH PLACE
        
        // Update movePointArray
        rangeData.movePointArray = this._createMovePointArray(rangeData);

        this._rangeDataArray[this._currentIndex] = rangeData;
    },

    nullRangeData: function(rangeData) {
        // rangeData.x = -1;
        // rangeData.y = -1;
        rangeData.indexArray = [];
        rangeData.weaponIndexArray = [];
        // rangeData.targetCount = 0;
        // rangeData.movePointArray = [];
    },

    removeFromCombinedIndexArray: function(rangeData) {
        var destIndexArray = this._combinedIndexArray.indexArray;
        var destWeaponIndexArray = destIndexArray; // this._combinedIndexArray.weaponIndexArray;

        var rangeDataIndexArray = rangeData.indexArray;
        var rangeDataWeaponIndexArray = rangeData.weaponIndexArray;

        var switchArray = this._switchArray;
        var weaponSwitchArray = switchArray; // this._weaponSwitchArray;

        var i, count = rangeDataIndexArray.length;
        for (i = 0; i < count; i++) {
            this.nonRedundantRemove(rangeDataIndexArray[i], destIndexArray, switchArray);
        }

        count = rangeDataWeaponIndexArray.length;
        for (i = 0; i < count; i++) {
            this.nonRedundantRemove(rangeDataWeaponIndexArray[i], destWeaponIndexArray, weaponSwitchArray /* this._weaponSwitchArray */);
        }
    },

    // For weapon indexes to not overlap with walk indexes
    // all walk indexes need to be known first.
    addToCombinedIndexArray: function(rangeData) {
        var destIndexArray = this._combinedIndexArray.indexArray;
        var destWeaponIndexArray = destIndexArray; // this._combinedIndexArray.weaponIndexArray;

        var rangeDataIndexArray = rangeData.indexArray;
        var rangeDataWeaponIndexArray = rangeData.weaponIndexArray;

        var switchArray = this._switchArray;
        var weaponSwitchArray = switchArray; // this._weaponSwitchArray;

        var i, count = rangeDataIndexArray.length;
        for (i = 0; i < count; i++) {
            this.nonRedundantAdd(rangeDataIndexArray[i], destIndexArray, switchArray);
        }

        count = rangeDataWeaponIndexArray.length;
        for (i = 0; i < count; i++) {
            this.nonRedundantAdd(rangeDataWeaponIndexArray[i], destWeaponIndexArray, weaponSwitchArray /* this._weaponSwitchArray */);
        }
    },

    getCombinedIndexArray: function() {
        return this._combinedIndexArray;
    },

    reloadRangeData: function() {
        // When reloading IDs, make sure you reset the unit property as well
        var global = root.getMetaSession().global;
        var session = root.getCurrentSession();
        var mapData = session.getCurrentMapInfo();
        var mapId = mapData.getId();
        if (global.enemyRangeCollectorData == undefined || global.enemyRangeCollectorMapId != mapId) {
            global.enemyRangeCollectorMapId = mapData.getId();
            global.enemyRangeCollectorData = this._buildEnemyRangeCollectorData();
            return global.enemyRangeCollectorData;
        }

        // rangeData.unit is broken, so we need to reload it.
        var rangeDataArray = global.enemyRangeCollectorData.rangeDataArray;
        var i, currentRangeData, count = rangeDataArray.length;
        for (i = count - 1; i >= 0; i--) {
            currentRangeData = rangeDataArray[i];
            currentRangeData.unit = this._reloadUnitFromId(currentRangeData.id);
            if (currentRangeData.unit == null) {
                rangeDataArray.splice(i, 1);
            }
        }

        return global.enemyRangeCollectorData;
    },

    _isPassUnit: function(unit) {
        if (typeof SURINUKE_SKILL_NAME != "undefined") {
            if (SkillControl.getPossessionCustomSkill(unit, SURINUKE_SKILL_NAME) != null) {
                return true;
            }
        }

        return false;
    },

    _reloadUnitFromId: function(id) {
        return root.getCurrentSession().getEnemyList().getDataFromId(id);
    },

    _isPosChanged: function(rangeData) {
        var unit = rangeData.unit;
        var currentX = unit.getMapX();
        var currentY = unit.getMapY();
        var previousX = rangeData.x;
        var previousY = rangeData.y;

        if (currentX != previousX) {
            return true;
        }

        if (currentY != previousY) {
            return true;
        }

        return false;
    },

    // Check if the movement points have changed at all
    // as well if an opposing unit moved into one of them
    _isTerrainChanged: function(rangeData) {
		var unit = rangeData.unit;
        var endRange = rangeData.attackRange.mov;
        var prevEndRange = rangeData.prevAttackRange.mov;

        if (endRange !== prevEndRange) {
            return true;
        }

        var unit = rangeData.unit;
        var baseX = rangeData.x;
        var baseY = rangeData.y;
        var tilesMovedX, tilesMovedY = -endRange;
        var height = endRange;
        var mapWidth = CurrentMap.getWidth();
        var mapHeight = CurrentMap.getHeight();
        var movePointArray = rangeData.movePointArray;
        var isPassUnit = rangeData.isPassUnit;
        var movePoint, targetUnit;
        var width;

        // Use the range stuff to once again
        // check the move points
        var relativeY, relativeX, i = 0;
        for (; tilesMovedY <= height; tilesMovedY++) {
            relativeY = baseY + tilesMovedY;
            width = endRange - Math.abs(tilesMovedY);
            tilesMovedX = -width;
            if (relativeY < 0 || relativeY >= mapHeight) {
                continue;
            }

            for (; tilesMovedX <= width; tilesMovedX++) {
                relativeX = baseX + tilesMovedX;

                if (relativeX < 0 || relativeX >= mapWidth) {
                    continue;
                }

                targetUnit = PosChecker.getUnitFromPos(relativeX, relativeY);
                if (targetUnit != null && targetUnit != unit && targetUnit.getUnitType() != unit.getUnitType() && isPassUnit == false) {
                    movePoint = 0;
                } else {
                    movePoint = PosChecker.getMovePointFromUnit(relativeX, relativeY, unit);
                }
                
                if (movePoint != movePointArray[i]) {
                    return true;
                };

                i++;
            }
        }
		
		return false;
    },

    _createMovePointArray: function(rangeData) {
        var endRange = rangeData.attackRange.mov;
        var unit = rangeData.unit;
        var baseX = rangeData.x;
        var baseY = rangeData.y;
        var movePointArray = [];
        var tilesMovedX, tilesMovedY = -endRange;
        var height = endRange;
        var mapWidth = CurrentMap.getWidth();
        var mapHeight = CurrentMap.getHeight();
        var isPassUnit = rangeData.isPassUnit;
        var width;
        var value;

        var relativeY, relativeX, targetUnit;
        for (; tilesMovedY <= height; tilesMovedY++) {
            relativeY = baseY + tilesMovedY;
            width = endRange - Math.abs(tilesMovedY);
            tilesMovedX = -width;
            if (relativeY < 0 || relativeY >= mapHeight) {
                continue;
            }

            for (; tilesMovedX <= width; tilesMovedX++) {
                relativeX = baseX + tilesMovedX;

                if (relativeX < 0 || relativeX >= mapWidth) {
                    continue;
                }

                targetUnit = PosChecker.getUnitFromPos(relativeX, relativeY);
                if (targetUnit != null && targetUnit != unit && targetUnit.getUnitType() != unit.getUnitType() && isPassUnit == false) {
                    value = movePointArray.push(0);
                } else {
                    value = movePointArray.push(PosChecker.getMovePointFromUnit(relativeX, relativeY, unit));
                }
            }
        }

        return movePointArray;
    },

    _getSplashWeaponIndexArray: function(indexArray, weapon) {
		var filteredIndexArray = this._filterMovementIndexArray(indexArray);
		
		var splashWeaponIndexArray = [];
		var prevAllowedArray = [];
		var disallowedArray = SplashControl.createDisallowedArray(indexArray);
			
		var allowedTiles = SplashControl.getAllowedTiles(weapon);
		if (!allowedTiles) {
			allowedTiles = SplashControl.generateAllowedTilesFromRange(weapon);
		}
		
		var splashTiles = SplashControl.getSplashTiles(weapon);
		var flipType = SplashControl.getFlipType(weapon);
		
		var i, count = filteredIndexArray.length;
		for (i = 0; i < count; i++) {
			var x = CurrentMap.getX(filteredIndexArray[i]);
			var y = CurrentMap.getY(filteredIndexArray[i]);
			
			splashWeaponIndexArray = SplashControl.createSplashRangeIndexArray(x, y, allowedTiles, splashTiles, flipType, splashWeaponIndexArray, prevAllowedArray, disallowedArray);
		}
		
		return splashWeaponIndexArray;
	},

	_filterMovementIndexArray: function(indexArray) {
		//Grab indexArray. Check if any tiles adjacent 
		var filteredMovementIndexArray = [];
		var yFactor = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
		var relativeIndex = [-1, 1, yFactor, yFactor * -1];
		var j, relCount = relativeIndex.length;
        var switchArray = Array(CurrentMap.getSize());

        var i, currentIndex, count = switchArray.length;
        for (i = 0; i < count; i++) {
            switchArray[i] = 0;
        }
		
		count = indexArray.length;
		for (i = 0; i < count; i++) {
			var currentIndex = indexArray[i];
			
			for (j = 0; j < relCount; j++) {
				this.nonRedundantAdd(currentIndex, filteredMovementIndexArray, switchArray);
			}
		}
		
		return filteredMovementIndexArray;
    },

    nonRedundantAdd: function(element, array, switchArray) {
       if (switchArray[element] === 0) {
            var guess;
            for (var min = 0, max = array.length; min < max;) {
                guess = min + max >>> 1;
                if (array[guess] < element) {
                    min = guess + 1;
                } else {
                    max = guess;
                }
            }

            if (element > array[guess]) {
                guess++;
            }

            array.splice(guess, 0, element);
        }

        switchArray[element]++
        return;
    },

    nonRedundantRemove: function(element, array, switchArray) {
        if (switchArray[element] === 1) {
            var guess;
            for (var min = 0, max = array.length; min < max;) {
                guess = min + max >>> 1;
                if (array[guess] === element) {
                    break;
                } else if (array[guess] < element) {
                    min = guess + 1;
                } else {
                    max = guess;
                }
            }

            if (element == array[guess]) {
                array.splice(guess, 1);
            }
        };

        switchArray[element]--;
        return;
    },

    _buildRangeData: function() {
        return {
            unit: null,
            id: -1,
            attackRange: null,
            prevAttackRange: null,
            x: -1,
            y: -1,
            isPassUnit: false,
            indexArray: [],
            weaponIndexArray: [],
            movePointArray: []
        }
    },

    _buildEnemyRangeCollectorData: function() {
        var switchArray = Array(CurrentMap.getSize());
        var i, count = switchArray.length;
        for (i = 0; i < count; i++) {
            switchArray[i] = 0;
        }

        return {
            rangeDataArray: [],
            combinedIndexArray: {
                indexArray: [],
                weaponIndexArray: []
            },
            switchArray: switchArray.slice(),
            weaponSwitchArray: switchArray.slice()
        }
    }
});