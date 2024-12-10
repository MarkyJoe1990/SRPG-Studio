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
    _prevEnemyRangeCollectorData: null,
    _flagMarkCache: null,
    _rangeDisplayCache: null,
    _counter: null,
    _isReverse: false,

    initialize: function() {
        var enemyRangeCollectorData = this.reloadRangeData();

        // Combined
        this._rangeDataArray = enemyRangeCollectorData.rangeDataArray;
        this._combinedIndexArray = enemyRangeCollectorData.combinedIndexArray;
        this._switchArray = enemyRangeCollectorData.switchArray;
        this._weaponSwitchArray = enemyRangeCollectorData.weaponSwitchArray;

        // Individual
        this._individualIndexArray = enemyRangeCollectorData.individualIndexArray;
        this._individualSwitchArray = enemyRangeCollectorData.individualSwitchArray;
        this._individualWeaponSwitchArray = enemyRangeCollectorData.individualWeaponSwitchArray;

        this._isSplashControlEnabled = typeof SplashControl != "undefined";
        this._isEaseControl = typeof EaseControl != "undefined" && AnimationEasingConfig.enableEnemyRangeCollectorFlagWave === true;

        // Other
        this._counter = createObject(CycleCounter);
        this._counter.disableGameAcceleration();
        this._counter.setCounterInfo(42);
        this._isReverse = false;
        this.reset();
    },

    reset: function(sortFunction) {
        this._timePassed = 0;
        this._enemyList = root.getCurrentSession().getEnemyList();
        this._enemyCount = this._enemyList.getCount();
        this._currentIndex = 0;

        this._sortIndexArray = [];

        var i, count = this._enemyCount;
        for (i = 0; i < count; i++) {
            this._sortIndexArray[i] = i;
        }

        if (sortFunction != undefined) {
            this._sortIndexArray.sort(sortFunction);
        }
    },

    saveState: function() {
        this._prevEnemyRangeCollectorData = this._buildEnemyRangeCollectorData();
        this._prevIndex = this._currentIndex;
        var i, count = this._rangeDataArray.length;

        var enemyRangeCollectorData = root.getMetaSession().global.enemyRangeCollectorData;
        for (i = 0; i < count; i++) {
            this._prevEnemyRangeCollectorData.rangeDataArray[i] = this._copyRangeData(this._rangeDataArray[i]);
        }

        this._prevEnemyRangeCollectorData.combinedIndexArray = {
            indexArray: enemyRangeCollectorData.combinedIndexArray.indexArray.slice(),
            weaponIndexArray: enemyRangeCollectorData.combinedIndexArray.weaponIndexArray.slice()
        };

        this._prevEnemyRangeCollectorData.individualIndexArray = {
            indexArray: enemyRangeCollectorData.individualIndexArray.indexArray.slice(),
            weaponIndexArray: enemyRangeCollectorData.individualIndexArray.weaponIndexArray.slice()
        }

        this._prevEnemyRangeCollectorData.switchArray = enemyRangeCollectorData.switchArray.slice();
        this._prevEnemyRangeCollectorData.weaponSwitchArray = enemyRangeCollectorData.weaponSwitchArray.slice();
        this._prevEnemyRangeCollectorData.individualSwitchArray = enemyRangeCollectorData.individualSwitchArray.slice();
        this._prevEnemyRangeCollectorData.individualWeaponSwitchArray = enemyRangeCollectorData.individualWeaponSwitchArray.slice();
    },

    loadState: function() {
        root.getMetaSession().global.enemyRangeCollectorData = this._prevEnemyRangeCollectorData;

        // Combined
        this._rangeDataArray = this._prevEnemyRangeCollectorData.rangeDataArray;
        this._combinedIndexArray = this._prevEnemyRangeCollectorData.combinedIndexArray;
        this._switchArray = this._prevEnemyRangeCollectorData.switchArray;
        this._weaponSwitchArray = this._prevEnemyRangeCollectorData.weaponSwitchArray;

        // Individual
        this._individualIndexArray = this._prevEnemyRangeCollectorData.individualIndexArray;
        this._individualSwitchArray = this._prevEnemyRangeCollectorData.individualSwitchArray;
        this._individualWeaponSwitchArray = this._prevEnemyRangeCollectorData.individualWeaponSwitchArray;
        this._currentIndex = this._prevIndex;
        this.updateRangeDisplay();
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
            unit = this._enemyList.getData(this._sortIndexArray[this._currentIndex]);

            if (unit == null) {
                continue;
            }

            SkillArrayCacher.cacheSkillArray(unit);
            SkillArrayCacher.setCacherReady(true);
            attackRange = UnitRangePanel.getUnitAttackRange(unit);

            // Check rangeData
            rangeData = this._rangeDataArray[this._sortIndexArray[this._currentIndex]];

            if (rangeData != undefined) {
                if (rangeData.unit != unit) {
                    this.removeFromCombinedIndexArray(rangeData);
                    
                    var nextRangeData = this.getRangeDataFromId(unit.getId());
                    if (nextRangeData != null) {
                        rangeData.unit = unit;
                        rangeData = nextRangeData;
                        this.addToCombinedIndexArray(rangeData);
                        this._rangeDataArray[this._sortIndexArray[this._currentIndex]] = rangeData;
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
                this._rangeDataArray[this._sortIndexArray[this._currentIndex]] = rangeData;
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
                    this.updateVisuals();
                }
            } else {
                this.removeFromCombinedIndexArray(rangeData);
                this.nullRangeData(rangeData);
                this.addToCombinedIndexArray(rangeData);

                rangeData.isMarked = false;

                this.updateVisuals();
            }

            SkillArrayCacher.clearSkillArray();
            SkillArrayCacher.setCacherReady(false);

            break;
        }

        if (this._currentIndex >= this._enemyCount) {
            while (this._enemyCount < this._rangeDataArray.length) {
                this.removeFromCombinedIndexArray(this._rangeDataArray.pop());
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
            if (currentRangeData.unit === unit) {
                return currentRangeData;
            }
        }
        
        return null;
    },

    getRangeDataFromId: function(id) {
        var i, currentRangeData, count = this._rangeDataArray.length;
        for (i = 0; i < count; i++) {
            currentRangeData = this._rangeDataArray[i];
            if (currentRangeData.id === id) {
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
        var color = 0xFFCCCC;
        var font = textui.getFont();
        var session = root.getCurrentSession();

        var scrollX = session.getScrollPixelX();
        var scrollY = session.getScrollPixelY();

        var i, count = this._switchArray.length;
        var x, y;
        // Combined
        for (i = 0; i < count; i++) {
            x = (CurrentMap.getX(i) * GraphicsFormat.MAPCHIP_WIDTH) - scrollX;
            y = (CurrentMap.getY(i) * GraphicsFormat.MAPCHIP_HEIGHT) - scrollY;

            TextRenderer.drawText(x, y, this._switchArray[i], -1, color, font);
        }

        // Individual
        var width = 0;
        count = this._individualSwitchArray.length;
        color = 0x88FF88;
        for (i = 0; i < count; i++) {
            x = (CurrentMap.getX(i) * GraphicsFormat.MAPCHIP_WIDTH) - scrollX + GraphicsFormat.MAPCHIP_WIDTH;
            y = (CurrentMap.getY(i) * GraphicsFormat.MAPCHIP_HEIGHT) - scrollY;

            width = TextRenderer.getTextWidth(this._individualSwitchArray[i], font);

            TextRenderer.drawText(x - width, y, this._individualSwitchArray[i], -1, color, font);
        }
    },

    updateVisuals: function() {
        this._updateFlagMarkCache();
        this.updateRangeDisplay();
    },

    _updateFlagMarkCache: function() {
        if (ENEMY_RANGE_COLLECTOR_CONFIG.disableMarkingIcon === true) {
            return;
        }
        
        var graphicsManager = root.getGraphicsManager();

        this._flagMarkCache = graphicsManager.createCacheGraphics(CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH, CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT);
        graphicsManager.setRenderCache(this._flagMarkCache);

        var config = ENEMY_RANGE_COLLECTOR_CONFIG.markingIcon;
        var handle = root.createResourceHandle(config.isRuntime, config.id, 0, config.xSrc, config.ySrc);

        // Draw Start
        var i, x, y, currentRangeData, count = this._rangeDataArray.length;
        var width = GraphicsFormat.MAPCHIP_WIDTH;
        var xOffset = Math.floor(GraphicsFormat.MAPCHIP_WIDTH - GraphicsFormat.ICON_WIDTH) / 2;
        var height = GraphicsFormat.MAPCHIP_HEIGHT;
        for (i = 0; i < count; i++) {
            currentRangeData = this._rangeDataArray[i];
            if (currentRangeData.isMarked === true) {
                // draw flag
                x = (currentRangeData.x * width) + xOffset;
                y = currentRangeData.y * height;
                GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
            }
        }

        // Draw end
        graphicsManager.resetRenderCache();
    },

    moveFlagMark: function() {
        if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
            this._isReverse = this._isReverse !== true;
        };

        return MoveResult.CONTINUE;
    },

    drawFlagMark: function() {
        if (ENEMY_RANGE_COLLECTOR_CONFIG.disableMarkingIcon === true) {
            return;
        }

        if (this._flagMarkCache !== null) {
            if (this._flagMarkCache.isCacheAvailable() === true) {
                var session = root.getCurrentSession();
                var counter = this._counter.getCounter();
                var max = this._counter._max;
                var x = -10;
                
                var yOffset = -10;
                if (this._isEaseControl === true) {
                    x = 0;
                    if (this._isReverse === true) {
                        yOffset = EaseControl.easeInOutQuad(max - counter, -10, -20, max);
                    } else {
                        yOffset = EaseControl.easeInOutQuad(counter, -10, -20, max);
                    }
                }

                this._flagMarkCache.drawParts(x, yOffset, session.getScrollPixelX(), session.getScrollPixelY(), root.getGameAreaWidth(), root.getGameAreaHeight());
                return;
            }
        }
    },

    updateRangeDisplay: function(markingPanel) {
        if (ENEMY_RANGE_COLLECTOR_CONFIG.disableCustomRangeDisplay === true) {
            return;
        }

        if (markingPanel == undefined) {
            markingPanel = MapLayer.getMarkingPanel();
        }

        if (markingPanel == null) {
            return;
        }

        var graphicsManager = root.getGraphicsManager();

        this._rangeDisplayCache = graphicsManager.createCacheGraphics(CurrentMap.getWidth() * GraphicsFormat.MAPCHIP_WIDTH, CurrentMap.getHeight() * GraphicsFormat.MAPCHIP_HEIGHT);
        graphicsManager.setRenderCache(this._rangeDisplayCache);
        // Draw start

        // Draw all range first

        var individualIndexArray = this.getIndividualIndexArray();
        var individualSwitchArray = this.getIndividualSwitchArray();
        
		if (markingPanel._isVisible === true) {
            var indexArray = this._subtractArray(individualSwitchArray, this.getCombinedIndexArray().indexArray);
            var switchArray = this.getSwitchArray();
            EdgeRangeControl.drawEdgeRange(indexArray, switchArray, ENEMY_RANGE_IMAGE_SET, 1);
        } 

        EdgeRangeControl.drawEdgeRange(individualIndexArray.indexArray, individualSwitchArray, ENEMY_RANGE_IMAGE_SET, 0);

        // Draw end
        graphicsManager.resetRenderCache();
    },

    drawRangeDisplay: function() {
        if (this._rangeDisplayCache !== null) {
            if (this._rangeDisplayCache.isCacheAvailable() === true) {
                var session = root.getCurrentSession();
                this._rangeDisplayCache.drawParts(0, 0, session.getScrollPixelX(), session.getScrollPixelY(), root.getGameAreaWidth(), root.getGameAreaHeight());
                return;
            }
        }
    },

    _subtractArray: function(subtractArray, destArray) {
        var arr = destArray.slice();

        var i, count = arr.length;
        for (i = count - 1; i >= 0; i--) {
            subtractArray[arr[i]] > 0 && arr.splice(i, 1);
        }

        return arr;
    },

    _isInvisible: function(unit) {
        if (unit.isInvisible() === true) {
            return true;
        }

        if (CurrentMap.checkInvisibleUnit(unit.getMapX(), unit.getMapY(), UnitType.PLAYER) === true) {
            return true;
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
            if (this._isSplashControlEnabled === true && weapon != null && SplashControl.hasSplashTiles(weapon) === true) {
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
                    if (splashPlaceEventInfo.getCustomKeyword() === "Splash") {
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

        if (rangeData.isMarked === true && ENEMY_RANGE_COLLECTOR_CONFIG.disableIndividualRangeMarking !== true) {
            this.removeFromIndividualIndexArray(rangeData);
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

        if (rangeData.isMarked === true && ENEMY_RANGE_COLLECTOR_CONFIG.disableIndividualRangeMarking !== true) {
            this.addToIndividualIndexArray(rangeData);
        }
    },

    addToIndividualIndexArray: function(rangeData) {
        var destIndexArray = this._individualIndexArray.indexArray;
        var destWeaponIndexArray = destIndexArray; // this._combinedIndexArray.weaponIndexArray;

        var rangeDataIndexArray = rangeData.indexArray;
        var rangeDataWeaponIndexArray = rangeData.weaponIndexArray;

        var switchArray = this._individualSwitchArray;
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

    removeFromIndividualIndexArray: function(rangeData) {
        var destIndexArray = this._individualIndexArray.indexArray;
        var destWeaponIndexArray = destIndexArray; // this._combinedIndexArray.weaponIndexArray;

        var rangeDataIndexArray = rangeData.indexArray;
        var rangeDataWeaponIndexArray = rangeData.weaponIndexArray;

        var switchArray = this._individualSwitchArray;
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

    getCombinedIndexArray: function() {
        return this._combinedIndexArray;
    },

    getSwitchArray: function() {
        return this._switchArray;
    },

    getIndividualIndexArray: function() {
        return this._individualIndexArray;
    },

    getIndividualSwitchArray: function() {
        return this._individualSwitchArray;
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

    createSortByDistance: function(unit) {
        var unitX = unit.getMapX();
        var unitY = unit.getMapY();
        var self = this;

        return function(a, b) {
            var rangeDataA = self._rangeDataArray[a];
            if (rangeDataA === undefined) {
                return 0;
            }

            var rangeDataB = self._rangeDataArray[b];
            if (rangeDataB === undefined) {
                return 0;
            }

            var distA = Math.abs(unitX - rangeDataA.x) + Math.abs(unitY - rangeDataA.y);
            var distB = Math.abs(unitX - rangeDataB.x) + Math.abs(unitY - rangeDataB.y);

            return distA - distB;
        }
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
        var unitType = unit.getUnitType();

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
                if (targetUnit !== null && targetUnit !== unit && targetUnit.getUnitType() !== unitType && isPassUnit !== true) {
                    movePoint = 0;
                } else {
                    movePoint = PosChecker.getMovePointFromUnit(relativeX, relativeY, unit);
                }
                
                if (movePoint !== movePointArray[i]) {
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
                if (targetUnit !== null && targetUnit !== unit && targetUnit.getUnitType() !== unit.getUnitType() && isPassUnit !== true) {
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
        var requiredTiles = weapon.custom.requiredTiles;
        if (requiredTiles == undefined) {
            requiredTiles = SplashFlag.ALL;
        } else if (requiredTiles == SplashFlag.NONE) {
            requiredTiles = SplashFlag.ALL;
        }

        var requiredSplashTiles = SplashControl.getRequiredSplashTiles(splashTiles, requiredTiles);
		var flipType = SplashControl.getFlipType(weapon);
		
		var i, count = filteredIndexArray.length;
		for (i = 0; i < count; i++) {
			var x = CurrentMap.getX(filteredIndexArray[i]);
			var y = CurrentMap.getY(filteredIndexArray[i]);
			
			splashWeaponIndexArray = SplashControl.createSplashRangeIndexArray(x, y, allowedTiles, requiredSplashTiles, flipType, splashWeaponIndexArray, prevAllowedArray, disallowedArray);
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

            if (element === array[guess]) {
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
            movePointArray: [],
            isMarked: false
        }
    },

    // Shallow copies attackRange and prevAttackRange
    _copyRangeData: function(rangeData) {
        var newRangeData = {};

        for (prop in rangeData) {
            if (typeof rangeData[prop].length === "number") {
                newRangeData[prop] = rangeData[prop].slice();
            } else {
                newRangeData[prop] = rangeData[prop];
            }
        }

        return newRangeData;
    },

    _buildEnemyRangeCollectorData: function() {
        var switchArray = Array(CurrentMap.getSize());
        var i, count = switchArray.length;
        for (i = 0; i < count; i++) {
            switchArray[i] = 0;
        }

        return {
            rangeDataArray: [],
            // Combined Enemy Ranges
            combinedIndexArray: {
                indexArray: [],
                weaponIndexArray: []
            },
            switchArray: switchArray.slice(),
            weaponSwitchArray: switchArray.slice(),

            // Individual Enemy Ranges
            individualIndexArray: {
                indexArray: [],
                weaponIndexArray: []
            },
            individualSwitchArray: switchArray.slice(),
            individualWeaponSwitchArray: switchArray.slice()
        }
    }
});