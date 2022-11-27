var SPLASH_CONTROL_EXISTS = SPLASH_CONTROL_EXISTS || typeof SplashControl != "undefined";

var SkillTypeName = [];
SkillTypeName[0] = "Preemptive Strike";
SkillTypeName[1] = "Multi Strike"; // Show number of hits
SkillTypeName[2] = "Counter Attack Critical";
SkillTypeName[3] = "Absorb Damage Dealt";
SkillTypeName[4] = "Certain Strike"; //Need to use sub categories
SkillTypeName[5] = "State Inflicting Attack"; // Show State
SkillTypeName[10] = "Damage Reduction"; // Show weapon types & guard rate
SkillTypeName[11] = "Survival Fatal Blows"; // Show avoid or survive with 1 hp
SkillTypeName[20] = "Enable Follow Up Attacks";
SkillTypeName[21] = "Enable Critical Hits";
SkillTypeName[22] = "Invalidation"; // Show list of invalidated stuff
SkillTypeName[23] = "Infinite Weapon Durability"; // Show Weapon Types
SkillTypeName[24] = "Battle Restriction"; // Half or seal attack
SkillTypeName[25] = "Enable Counter Attacks";
SkillTypeName[30] = "Recovery HP Each Turn"; // Show recovery amount
SkillTypeName[31] = "Experience Bonus"; // Show multiplier
SkillTypeName[32] = "Shopping Discount"; // Show Discount rate
SkillTypeName[33] = "Support Bonus"; // Show range type, range, and battle stats
SkillTypeName[34] = "Stat Bonus"; // Show Parameter Bonuses
SkillTypeName[40] = "Steal Command"; // Show Command name, EXP (maybe not?), and all steal rules
SkillTypeName[41] = "Grant Extra Turns Command"; // Show command name, EXP (maybe not?), and single vs surrounding units
SkillTypeName[42] = "Lock Picking Command"; // List what things can be unlocked.
SkillTypeName[43] = "Fusion Command"; // Show fusion type... may need to grab fusion info.
SkillTypeName[44] = "Transformation Command"; // Command name, EXP (maybe not?), transform name. Maybe transform info.
SkillTypeName[50] = "Use Leftover Move";
SkillTypeName[51] = "Gain Extra Turns"; // Show chance and turns until next activation
SkillTypeName[100] = "Custom"; // Show custom parameters (may need to do that anyway even for the above skills)

var CustomSkillTranslator = {
	"": "Unknown Type",
	"Rally": "Inflict State On Units Command",
	"wand_master": "Staves Don't End Your Turn",
	"item_master": "Items Don't End Your Turn",
	"OT_AbsorptionDamage": "Absorb Damage Taken",
	"OT_Assault": "Go Additional Rounds Of Combat",
	"OT_BoisterousDance": "Skill Activation Combo",
	"OT_BreakAttack": "Armor Break",
	"OT_Cancel": "Cancel Counter Attack",
	"OT_Critical": "Critical Attack",
	"OT_StatusAttack": "Stat Dependent Attack",

	translateCustomKeyword: function(skill) {
		var keyword = skill.getCustomKeyword();
		var translatedKeyword = this[keyword];

		return translatedKeyword == undefined ? keyword : translatedKeyword;
	}
}

var BaseSkillSentence = defineObject(BaseObject, {
	_skillInfoWindow: null,
	
	setParentWindow: function(skillInfoWindow) {
		this._skillInfoWindow = skillInfoWindow;
	},
	moveSkillSentence: function() {
		return MoveResult.CONTINUE;
	},
	drawSkillSentence: function(x, y, skill) {
	},
	getSkillSentenceCount: function(skill) {
		return 0;
	},
	getTextUI: function() {
		if (this._skillInfoWindow == null) {
			return root.queryTextUI("default_window");
		}
		
		return this._skillInfoWindow.getWindowTextUI();
	},
	drawAttribute: function(x, y, name, number) {
		ItemInfoRenderer.drawKeyword(x, y, name);
		x += 80;
		this.drawNumber(x, y + 1, number);
	},
	drawNumber: function(x, y, number) {
		if (typeof number == "function") {
			this.drawItDepends(x, y);
		}
		
		var newNumber = number;
		
		if (number < 0) {
			newNumber = Math.abs(number);
			var textui = this.getTextUI();
			var font = textui.getFont();
			var color = textui.getColor();
			var length = -1;
			TextRenderer.drawText(x, y+2, "-", length, color, font)
			x += 20;
			NumberRenderer.drawRightNumberColor(x, y, newNumber, 3, 255);
		} else {
			NumberRenderer.drawRightNumberColor(x, y, newNumber, 1, 255);
		}
	},
	drawItDepends: function(x, y) {
		var textui = this.getTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		TextRenderer.drawText(x, y+2, "It depends", -1, color, font);
	},
	isUsefulValue: function(value) {
		return value == undefined ? false : value == 0 ? false : true;
	},
	getSpiritEvent: function(skill) {
		if (skill.getCustomKeyword() == "Spirit-Event" && skill.custom.eventId != undefined) {
			var eventId = skill.custom.eventId;
			var playerList = root.getBaseData().getPlayerList();
			var i, count = playerList.getCount();
			
			for (i = 0; i < count; i++) {
				var currentUnit = playerList.getData(i);
				if (currentUnit.custom.global === true) {
					var x, count2 = currentUnit.getUnitEventCount();
					for (x = 0; x < count2; x++) {
						var currentEvent = currentUnit.getUnitEvent(x);
						if (currentEvent.getId() == eventId) {
							return currentEvent;
						}
					}
					
					break;
				}
			}
		}
		
		return skill;
	}
});

var SkillSentence = {};

SkillSentence.SpiritSkillType = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var text = this._isSpiritSkillType(skill);
		var textui = this.getTextUI();
		var font = textui.getFont();
		var color = ColorValue.KEYWORD
		var length = -1;
		
		TextRenderer.drawKeywordText(x, y, text, length, color, font);
	},
	getSkillSentenceCount: function(skill) {
		return this._isSpiritSkillType(skill).length > 0 ? 1 : 0;
	},
	_isSpiritSkillType: function(skill) {
		if (skill.getCustomKeyword() == "Spirit-Event") {
			return "Special Command";
		}
		if (skill.getCustomKeyword() == "Splash") {
			return "Map Attack";
		}
		
		return "";
	}
});

SkillSentence.Name = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var textui;
		var range = createRangeObject();
		
		if (this._skillInfoWindow == null) {
			textui = root.queryTextUI("default_window");
			range.width = root.getWindowWidth();
		} else {
			textui = this._skillInfoWindow.getWindowTextUI();
			range.width = this._skillInfoWindow.getWindowWidth() - (DefineControl.getWindowXPadding() * 2);
		}
		
		var font = textui.getFont();
		var color = textui.getColor();
		
		range.x = x;
		range.y = y;
		range.height = GraphicsFormat.ICON_HEIGHT;
		
		var spiritSkillType = this._getSpiritSkillType(skill);
		var text;
		
		if (spiritSkillType.length > 0) {
			text = skill.getName() + " <" + spiritSkillType + ">";
		} else {
			text = skill.getName();
		}

		TextRenderer.drawRangeText(range, TextFormat.LEFT, text, -1, color, font);
	},
	getSkillSentenceCount: function(skill) {
		return 1;
	},
	
	_getSpiritSkillType: function(skill) {
		if (skill.getCustomKeyword() == "Spirit-Event") {
			return "Command";
		}
		if (skill.getCustomKeyword() == "Splash") {
			return "Map Attack";
		}
		
		return "";
	}
});

SkillSentence.Invocation = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var invocationType = skill.getInvocationType();
		var invocationValue = skill.getInvocationValue();
		
		if (invocationType === InvocationType.ABSOLUTE && invocationValue === 100) {
			return;
		}
		
		var textui = this.getTextUI();
		var font = textui.getFont();
		var color = textui.getColor();
		var length = -1;
		
		var text = InvocationRenderer.getInvocationText(invocationValue, invocationType);
		
		TextRenderer.drawKeywordText(x, y, StringTable.SkillWord_Invocation, length, ColorValue.KEYWORD, font);
		x += ItemInfoRenderer.getSpaceX();
		
		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
	},
	getSkillSentenceCount: function(skill) {
		var invocationType = skill.getInvocationType();
		var invocationValue = skill.getInvocationValue();
		
		if (invocationType === InvocationType.ABSOLUTE && invocationValue === 100) {
			return 0;
		}
		
		return 1;
	}
});

SkillSentence.Aggregation = defineObject(BaseSkillSentence, {
	_aggregationViewer: null,
	
	setParentWindow: function(skillInfoWindow) {
		BaseSkillSentence.setParentWindow.call(this, skillInfoWindow);
		
		this._aggregationViewer = this._getAggregationViewer();
	},
	moveSkillSentence: function() {
		if (this._aggregationViewer !== null) {
			this._aggregationViewer.moveAggregationViewer();
		}
		
		return MoveResult.CONTINUE;
	},
	drawSkillSentence: function(x, y, skill) {
		if (this._aggregationViewer !== null) {
			this._aggregationViewer.drawAggregationViewer(x, y, this._getMatchName(skill));
		}
	},
	getSkillSentenceCount: function(skill) {
		return this._aggregationViewer.getAggregationViewerCount();
	},
	_getAggregationViewer: function() {
		if (this._skillInfoWindow !== null) {
			return this._skillInfoWindow._aggregationViewer;
		}

		return null;
	},
	_getMatchName: function(skill) {
		var text;
		
		var matchtype = skill.getTargetAggregation().getMatchType();
		
		if (matchtype === MatchType.MATCH) {
			text = StringTable.Aggregation_Match;
		}
		else if (matchtype === MatchType.MISMATCH) {
			text = StringTable.Aggregation_Mismatch;
		}
		else if (matchtype === MatchType.MATCHALL) {
			text = StringTable.Aggregation_MatchAll;
		}
		else {
			text = StringTable.Aggregation_MismatchAll;
		}
		
		return text;
	}
});

SkillSentence.ObjectType = defineObject(BaseSkillSentence, {
	setParentWindow: function(skillInfoWindow) {
		BaseSkillSentence.setParentWindow.call(this, skillInfoWindow);
	},
	drawSkillSentence: function(x, y, skill) {
		var text = this._getSkillTypeText();
		var textui = this.getTextUI();
		var font = textui.getFont();
		var color = textui.getColor();
		var length = -1;
		
		if (text !== '') {
			skillText = root.queryCommand('skill_object');
			TextRenderer.drawKeywordText(x, y, text + ' ' + skillText, length, ColorValue.KEYWORD, font);
		}
		else {
			text = this._getCategoryText(skill);
			TextRenderer.drawKeywordText(x, y, text, length, ColorValue.KEYWORD, font);
		}
	},
	getSkillSentenceCount: function(skill) {
		return 1;
	},
	_getCategoryText: function(skill) {
		var text;
		var skilltype = skill.getSkillType();
		
		if (skilltype < 10) {
			text = StringTable.SkillCategory_BattleAttack;
		}
		else if (skilltype < 20) {
			text = StringTable.SkillCategory_BattleDefence;
		}
		else if (skilltype < 30) {
			text = StringTable.SkillCategory_BattleAllowed;
		}
		else if (skilltype < 40) {
			text = StringTable.SkillCategory_Allowed;
		}
		else if (skilltype < 50) {
			text = StringTable.SkillCategory_Command;
		}
		else if (skilltype < 60) {
			text = StringTable.SkillCategory_Action;
		}
		else {
			text = StringTable.SkillCategory_Custom;
		}
		
		return '<' + text + '>';
	},
	_getSkillTypeText: function() {
		var text = '';
		var objecttype = this._getObjectType();
		
		if (objecttype === ObjectType.UNIT) {
			text = root.queryCommand('unit_object');
		}
		else if (objecttype === ObjectType.CLASS) {
			text = root.queryCommand('class_object');
		}
		else if (objecttype === ObjectType.WEAPON) {
			text = root.queryCommand('weapon_object');
		}
		else if (objecttype === ObjectType.ITEM) {
			text = root.queryCommand('item_object');
		}
		else if (objecttype === ObjectType.STATE) {
			text = root.queryCommand('state_object');
		}
		else if (objecttype === ObjectType.TERRAIN) {
			text = root.queryCommand('terrain_object');
		}
		else if (objecttype === ObjectType.FUSION) {
			text = root.queryCommand('fusion_object');
		}
		else {
			text = '';
		}
		
		return text;
	},
	_getObjectType: function() {
		if (this._skillInfoWindow !== null) {
			return this._skillInfoWindow._objecttype;
		}
		
		return ObjectType.NULL;
	}
});

SkillSentence.Range = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);

		if (this.isUsefulValue(skill.custom.startRange) || this.isUsefulValue(skill.custom.endRange)) {
			var text = root.queryCommand('range_capacity');
			ItemInfoRenderer.drawKeyword(x, y, text);
			var dx = ItemInfoRenderer.getSpaceX();
			this._drawRange(x + dx, y, skill);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return (this.isUsefulValue(skill.custom.startRange) || this.isUsefulValue(skill.custom.endRange)) ? 1 : 0;
	},

	_drawRange: function(x, y, skill) {
		var startRange = skill.custom.startRange;
		var endRange = skill.custom.endRange;
		var textui = root.queryTextUI('default_window');
		var color = textui.getColor();
		var font = textui.getFont();
		
		if (startRange == undefined) {
			startRange = endRange;
		}

		if (endRange == undefined) {
			endRange = startRange;
		}

		if (startRange === endRange) {
			NumberRenderer.drawRightNumber(x, y, startRange);
		} else {
			NumberRenderer.drawRightNumber(x, y, startRange);
			TextRenderer.drawKeywordText(x + 17, y, StringTable.SignWord_WaveDash, -1, color, font);
			NumberRenderer.drawRightNumber(x + 40, y, endRange);
		}
	}
});

SkillSentence.SpCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.cost)) {
			this.drawAttribute(x, y, "Cost", skill.custom.cost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.cost) ? 1 : 0;
	}
});

SkillSentence.HpCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.hpCost)) {
			this.drawAttribute(x, y, "Hp Cost", skill.custom.hpCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.hpCost) ? 1 : 0;
	}
});

SkillSentence.HeroismCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.heroismCost)) {
			this.drawAttribute(x, y, "Her Cost", skill.custom.heroismCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.heroismCost) ? 1 : 0;
	}
});

SkillSentence.EternityCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.eternityCost)) {
			this.drawAttribute(x, y, "Etr Cost", skill.custom.eternityCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.eternityCost) ? 1 : 0;
	}
});

SkillSentence.TenorCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.tenorCost)) {
			this.drawAttribute(x, y, "Tnr Cost", skill.custom.tenorCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.tenorCost) ? 1 : 0;
	}
});

SkillSentence.ComboCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.comboCost)) {
			this.drawAttribute(x, y, "Cmb Cost", skill.custom.comboCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.comboCost) ? 1 : 0;
	}
});

SkillSentence.TranquilityCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.tranquilityCost)) {
			this.drawAttribute(x, y, "Trq Cost", skill.custom.tranquilityCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.tranquilityCost) ? 1 : 0;
	}
});

SkillSentence.SpiteCost = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.spiteCost)) {
			this.drawAttribute(x, y, "Spt Cost", skill.custom.spiteCost);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.spiteCost) ? 1 : 0;
	}
});

SkillSentence.ShoveAmount = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.shoveAmount)) {
			if (skill.custom.shoveAmount >= 0) {
				this.drawAttribute(x, y, "Push", skill.custom.shoveAmount);
			} else {
				this.drawAttribute(x, y, "Pull", skill.custom.shoveAmount);
			}
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.shoveAmount) ? 1 : 0;
	}
});

SkillSentence.Attack = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.attack)) {
			this.drawAttribute(x, y, "Attack", skill.custom.attack);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.attack) ? 1 : 0;
	}
});

SkillSentence.Defense = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.defense)) {
			this.drawAttribute(x, y, "Defense", skill.custom.defense);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.defense) ? 1 : 0;
	}
});

SkillSentence.Hit = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.hit)) {
			this.drawAttribute(x, y, "Hit", skill.custom.hit);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.hit) ? 1 : 0;
	}
});

SkillSentence.Avoid = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.avoid)) {
			this.drawAttribute(x, y, "Avoid", skill.custom.avoid);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.avoid) ? 1 : 0;
	}
});

SkillSentence.Critical = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.critical)) {
			this.drawAttribute(x, y, "Critical", skill.custom.critical);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.critical) ? 1 : 0;
	}
});

SkillSentence.CriticalAvoid = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var skill = this.getSpiritEvent(skill);
		if (this.isUsefulValue(skill.custom.criticalAvoid)) {
			this.drawAttribute(x, y, "C. Avoid", skill.custom.criticalAvoid);
		}
	},
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return this.isUsefulValue(skill.custom.criticalAvoid) ? 1 : 0;
	}
});

SkillSentence.ActAfter = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var textui = this.getTextUI();
		var color = ColorValue.KEYWORD;
		var font = textui.getFont();
		
		var skill = this.getSpiritEvent(skill);
		if (skill.custom.freeAction === true) {
			TextRenderer.drawText(x, y + ContentLayout.KEYWORD_HEIGHT, "Can act after", -1, color, font)
		}
	},
	
	getSkillSentenceCount: function(skill) {
		var skill = this.getSpiritEvent(skill);
		return skill.custom.freeAction == true ? 1 : 0;
	}
});

SkillSentence.Splash = defineObject(BaseSkillSentence, {
	
	setParentWindow: function(skillInfoWindow) {
		this._skillInfoWindow = skillInfoWindow;

		if (!SPLASH_CONTROL_EXISTS) {
			return;
		}
		
		//You then need to get the info window's parent.
		
		this._splashDisplay = createObject(SplashDisplay);
		this._skill = this.getSpiritEvent(this._skillInfoWindow._skill);
		
		if (SplashControl.hasSplashTiles(this._skill)) {
			var width = 31;
			var height = 21;
			var splashTiles = SplashControl.getSplashTiles(this._skill);
			var secondTiles = SplashControl.getSecondTiles(this._skill);
			if (secondTiles == undefined) {
				secondTiles = []
			}
			var allowedTiles = SplashControl.getAllowedTiles(this._skill);
			var flipType = SplashControl.getFlipType(this._skill);
			
			this._splashDisplay.setUp(this._skill, width, height, splashTiles, secondTiles, allowedTiles, flipType);
		}
	},
	
	//THIS ISN'T ACTUALLY EVER CALLED
	moveSkillSentence: function() {
		if (!SPLASH_CONTROL_EXISTS) {
			return MoveResult.CONTINUE;
		}

		if (SplashControl.hasSplashTiles(this._skill)) {
			this._splashDisplay.moveDisplay();
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawSkillSentence: function(x, y, skill) {
		if (!SPLASH_CONTROL_EXISTS) {
			return;
		}

		if (!SplashControl.hasSplashTiles(skill)) {
			return;
		}
		
		this._splashDisplay.drawDisplay(x, y);
	},
	
	getSkillSentenceCount: function(skill) {
		if (!SPLASH_CONTROL_EXISTS) {
			return 0;
		}

		var skill = this.getSpiritEvent(skill);
		if (SplashControl.hasSplashTiles(skill)) {
			return 6;
		}
		
		return 0;
	}
});

SkillSentence.SkillType = defineObject(BaseSkillSentence, {
	drawSkillSentence: function(x, y, skill) {
		var textui = this.getTextUI();
		var color = ColorValue.KEYWORD;
		var font = textui.getFont();
		
		var skill = this.getSpiritEvent(skill);
		var skillType = skill.getSkillType();
		var text;
		if (skillType == SkillType.CUSTOM) {
			text = CustomSkillTranslator.translateCustomKeyword(skill);
		} else {
			text = SkillTypeName[skillType]
		}
		TextRenderer.drawText(x, y + ContentLayout.KEYWORD_HEIGHT, text, -1, color, font)
	},
	
	getSkillSentenceCount: function(skill) {
		return 1;
	}
});