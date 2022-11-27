( function () {
	var alias1 = ObjectiveWindow.setObjectiveData;
	var alias2 = ObjectiveWindow.drawWindowContent;
	var alias3 = ObjectiveWindow.moveWindowContent;
	
	ObjectiveWindow = defineObject(ObjectiveWindow, {
		_isMatch: false,
		_matchTurn: -1,
		_matchSwitchId: -1,
		
		moveWindowContent: function() {
			this._checkInput();
			return alias3.call(this);
		},
		
		_checkInput: function() {
			var session = root.getCurrentSession();
			var mapData = session.getCurrentMapInfo();
			var turnRewards = mapData.custom.turnRewards;
			
			if (turnRewards == undefined) {
				return;
			}
			
			var i, count = turnRewards.length;
			var maxDisplayedItems = this._isMatch == true ? 6 : 2;
			
			var count = turnRewards.length;
			var inputType = InputControl.getDirectionState();
			if ((inputType == InputType.UP || root.isMouseAction(MouseType.UPWHEEL)) && this._index > 0) {
				this._index--;
				if (inputType == InputType.UP) {
					MediaControl.soundDirect('commandcursor');
				}
			} else if ((inputType == InputType.DOWN || root.isMouseAction(MouseType.DOWNWHEEL)) && this._index + maxDisplayedItems < count) {
				this._index++;
				if (inputType == InputType.DOWN) {
					MediaControl.soundDirect('commandcursor');
				}
			}
		},
		setObjectiveData: function() {
			alias1.call(this);
			
			//Check if the turnRewards array has matching turns
			this._isMatch = true;
			this._index = 0;
			var session = root.getCurrentSession();
			var mapData = session.getCurrentMapInfo();
			var turnRewards = mapData.custom.turnRewards;
			
			if (turnRewards == undefined) {
				return;
			}
			
			this._edgeCursor = createObject(EdgeCursor);
			this._edgeCursor.setEdgeRange(32, 0);
			
			var i, count = turnRewards.length;
			this._matchTurn = turnRewards[0].turn == undefined ? -1 : turnRewards[0].turn;
			this._matchSwitchId = turnRewards[0].switchId == undefined ? -1 : turnRewards[0].switchId;
			for (i = 1; i < count; i++) {
				var currentReward = turnRewards[i];
				var currentTurn = currentReward.turn == undefined ? -1 : currentReward.turn;
				var currentSwitchId = currentReward.switchId == undefined ? -1 : currentReward.switchId;
				if (currentTurn != this._matchTurn || currentSwitchId != this._matchSwitchId) {
					this._isMatch = false;
					break;
				}
			}
		},
		drawWindowContent: function(x, y) {
			alias2.call(this, x, y);
			this._drawRewards(x, y);
		},
		_drawObjectiveArea: function(x, y) {
			var dx = 10;
			var dy = 25;
			
			y += 60;
			
			this._drawTitle(x, y, StringTable.Objective_Victory);
			this._scrollbarVictory.drawScrollbar(x + dx, y + dy);
			
			this._drawTitle(x + 265, y, StringTable.Objective_Defeat);
			this._scrollbarDefeat.drawScrollbar(x + dx + 265, y + dy);
		},
		_drawArea: function(x, y) {
			var i;
			var dx = 140;
			var count = this._objectArray.length;
			
			y += 260;
			
			x = LayoutControl.getCenterX(-1, count * dx);
			
			for (i = 0; i < count; i++) {
				this._objectArray[i].drawObjectiveParts(x, y);
				x += dx;
			}
			
		},
		_drawRewards: function(x, y) {
			var session = root.getCurrentSession();
			var mapData = session.getCurrentMapInfo();
			var turnRewards = mapData.custom.turnRewards;
			var turnCount = root.getCurrentSession().getTurnCount();
			
			var textui = root.queryTextUI("default_window");
			var font = textui.getFont();
			
			var baseData = root.getBaseData();
			
			if (turnRewards == undefined) {
				return;
			}
			
			var i, count = turnRewards.length;
			var maxDisplayedItems = this._isMatch ? 6 : 2;
			y += 180;
			if (this._index > 0) {
				this._edgeCursor.drawVertCursor(x + 460, y + 24, true, false);
			}
			if (this._index + maxDisplayedItems < count) {
				this._edgeCursor.drawVertCursor(x + 492, y + 6, false, true);
			}
			
			if (!this._isMatch) {
				TextRenderer.drawText(x, y, "Rewards & Conditions:", -1, ColorValue.KEYWORD, font);
				y += 32;
				for (i = this._index; i < count && i < 2 + this._index; i++) {
					var currentReward = turnRewards[i];
					var currentType = currentReward.type;
					
					var currentTurn = currentReward.turn == undefined ? -1 : currentReward.turn;
					var currentSwitchId = currentReward.switchId == undefined ? -1 : currentReward.switchId;
					
					var currentSwitchTable = session.getCurrentMapInfo().getLocalSwitchTable();
					var currentSwitchIndex = currentSwitchTable.getSwitchIndexFromId(currentSwitchId);
					var currentSwitchDescription = currentSwitchTable.getSwitchDescription(currentSwitchIndex);
					var currentSwitchOn = currentSwitchTable.isSwitchOn(currentSwitchIndex);
					
					var id = currentReward.id;
					var type = currentReward.type;
					var amount = currentReward.amount;
					
					var range = createRangeObject(x + 200, y-3, 320, 32);
					var plural = currentTurn == 1 ? "" : "s";

					var conditionMet;
					if (currentTurn == -1 && currentSwitchId != -1) {
						conditionMet = currentSwitchOn;
					} else {
						conditionMet = turnCount <= currentTurn || currentTurn == -1;
					}
					
					var currentColor = conditionMet ? ColorValue.INFO : ColorValue.DISABLE;
					var otherColor = conditionMet ? ColorValue.KEYWORD : ColorValue.DISABLE;
					
					if (currentTurn == -1) {
						// Allow use of switches
						if (currentSwitchId != -1) {
							TextRenderer.drawRangeText(range, TextFormat.RIGHT, currentSwitchDescription, -1, otherColor, font);
						} else {
							TextRenderer.drawRangeText(range, TextFormat.RIGHT, "Complete this chapter", -1, otherColor, font);
						}
					} else {
						TextRenderer.drawRangeText(range, TextFormat.RIGHT, "Complete this chapter within " + currentTurn + " turn" + plural, -1, otherColor, font);
					}
					
					switch(type) {
						case TurnRewardType.ITEM:
						ItemRenderer.drawItem(x, y, baseData.getItemList().getDataFromId(id), currentColor, font, false);
						break;
						case TurnRewardType.WEAPON:
						ItemRenderer.drawItem(x, y, baseData.getWeaponList().getDataFromId(id), currentColor, font, false);
						break;
						case TurnRewardType.GOLD:
						TextRenderer.drawText(x, y+3, "Gold Reward: ", -1, currentColor, font);
						NumberRenderer.drawNumber(x + 170, y+1, amount);
						break;
						case TurnRewardType.BONUS:
						TextRenderer.drawText(x, y+3, "Bonus Reward: ", -1, currentColor, font);
						NumberRenderer.drawNumber(x + 170, y+1, amount);
						break;
					}
					
					y += 32;
				}
			} else {
				var plural = this._matchTurn == 1 ? "" : "s";
				
				var currentSwitchId = this._matchSwitchId == undefined ? -1 : this._matchSwitchId;
				var currentSwitchTable = session.getCurrentMapInfo().getLocalSwitchTable();
				var currentSwitchIndex = currentSwitchTable.getSwitchIndexFromId(currentSwitchId);
				var currentSwitchDescription = currentSwitchTable.getSwitchDescription(currentSwitchIndex);
				var currentSwitchOn = currentSwitchTable.isSwitchOn(currentSwitchIndex);
				
				var conditionMet;
				if (this._matchTurn == -1 && this._matchSwitchId != -1) {
					conditionMet = currentSwitchOn;
				} else {
					conditionMet = turnCount <= this._matchTurn || this._matchTurn == -1;
				}
				var currentColor = conditionMet ? ColorValue.INFO : ColorValue.DISABLE;
				var otherColor = conditionMet ? ColorValue.KEYWORD : ColorValue.DISABLE;
				
				if (this._matchTurn == -1) {
					if (this._matchSwitchId != -1) {
						TextRenderer.drawText(x, y, currentSwitchDescription, -1, otherColor, font);
					} else {
						TextRenderer.drawText(x, y, "Complete this chapter to receive:", -1, otherColor, font);
					}
				} else {
					TextRenderer.drawText(x, y, "Complete this chapter within " + this._matchTurn + " turn" + plural + " to receive:", -1, otherColor, font);
				}
				y += 32;
				var dx = 0;
				for (i = this._index; i < count && i < 6 + this._index; i++) {
					var currentReward = turnRewards[i];
					var currentType = currentReward.type;
					
					var currentTurn = currentReward.turn;
					var id = currentReward.id;
					var type = currentReward.type;
					var amount = currentReward.amount;
					
					switch(type) {
						case TurnRewardType.ITEM:
						var item = baseData.getItemList().getDataFromId(id);
						if (item == null) {
							TextRenderer.drawText(x + dx, y+3, "INVALID ITEM ID", -1, color, font);
						} else {
							ItemRenderer.drawItem(x + dx, y, item, currentColor, font, false);
						}
						break;
						case TurnRewardType.WEAPON:
						var item = baseData.getWeaponList().getDataFromId(id);
						if (item == null) {
							TextRenderer.drawText(x + dx, y+3, "INVALID WEAPON ID", -1, currentColor, font);
						} else {
							ItemRenderer.drawItem(x + dx, y, item, currentColor, font, false);
						}
						break;
						case TurnRewardType.GOLD:
						TextRenderer.drawText(x + dx, y+3, "Gold Reward: ", -1, currentColor, font);
						NumberRenderer.drawNumber(x + 150 + dx, y+1, amount);
						break;
						case TurnRewardType.BONUS:
						TextRenderer.drawText(x + dx, y+3, "Bonus Reward: ", -1, currentColor, font);
						NumberRenderer.drawNumber(x + 150 + dx, y+1, amount);
						break;
					}
					
					if ((i - this._index) % 3 == 2) {
						y += 32;
						dx = 0;
					} else {
						dx += 180;
					}
				}
			}
		}
	});
	
	ObjectiveFaceZone = defineObject(ObjectiveFaceZone, {
		drawFaceZone: function(x, y) {
			var i, unitType, unit;
			var arr = [UnitType.PLAYER, UnitType.ENEMY, UnitType.ALLY];
			
			if (typeof NeutralControl != 'undefined') {
				arr.splice(2, 0, UnitType.NEUTRAL);
			}
			
			var count = arr.length;
			
			x += 0;
			y += 16;
			
			for (i = 0; i < count; i++) {
				unitType = arr[i];
				
				unit = this._getLeaderUnit(unitType);
				if (unit !== null) {
					//this._drawFaceImage(x, y, unit, unitType);
					var unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.alpha = 128;
					unitRenderParam.colorIndex = unit.getUnitType();
					unitRenderParam.handle = unit.getCharChipResourceHandle();
					UnitRenderer.drawDefaultUnit(unit, x+48, y, unitRenderParam);
					this._drawInfo(x, y, unit, unitType);
				}
				
				x += 132;
			}
		},
		
		_drawInfo: function(x, y, unit, unitType) {
			var textui = this._getTitleTextUI();
			var color = ColorValue.KEYWORD;
			var font = textui.getFont();
			var pic = textui.getUIImage();
			var text = [StringTable.UnitType_Player, StringTable.UnitType_Enemy, StringTable.UnitType_Ally];
			
			if (typeof NeutralControl != 'undefined') {
				text.push(NeutralSettings.NAME_FACTION);
			}
			
			x += 0;
			y -= 6;
			
			TitleRenderer.drawTitle(pic, x - 20 + 5, y - 10, TitleRenderer.getTitlePartsWidth(), TitleRenderer.getTitlePartsHeight(), 2);
			TextRenderer.drawText(x + 5, y + 12, text[unitType], -1, color, font);
			NumberRenderer.drawNumber(x + 83 + 5, y + 10, this._getTotalValue(unitType));
		}
	});
}) ();