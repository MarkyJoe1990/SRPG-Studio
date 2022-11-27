(function () {
	SkillInfoWindow = defineObject(SkillInfoWindow, {
		setSkillInfoData: function(skill, objecttype) {
			this._skill = skill;
			if (this._skill === null) {
				// Don't allow to draw the window frame etc.
				this.enableWindow(false);
				return;
			}
			var partsCount = 0;
			this._windowHeight = 0;
			
			this._aggregationViewer = createObject(AggregationViewer);
			this._aggregationViewer.setEnabled(DataConfig.isAggregationVisible());
			this._aggregationViewer.setAggregationViewer(skill.getTargetAggregation());
			
			this._matchtype = skill.getTargetAggregation().getMatchType();
			
			this._objecttype = objecttype;
			
			this._groupArray = [];
			this._configureSkill(this._groupArray);
			
			var i, count = this._groupArray.length;
			for (i = 0; i < count; i++) {
				this._groupArray[i].setParentWindow(this);
				partsCount += this._groupArray[i].getSkillSentenceCount(this._skill);
			}
			
			this._windowHeight = (partsCount + 1) * ItemInfoRenderer.getSpaceY();
			
			this.enableWindow(true);
		},
		moveWindowContent: function() {
			return MoveResult.CONTINUE;
		},
		drawWindowContent: function(x, y) {
			if (this._skill === null) {
				return;
			}
			
			var i, count = this._groupArray.length;
			for (i = 0; i < count; i++) {
				this._groupArray[i].drawSkillSentence(x, y, this._skill);
				y += this._groupArray[i].getSkillSentenceCount(this._skill) * ItemInfoRenderer.getSpaceY();
			}
		},
		getWindowHeight: function() {
			return this._windowHeight;
		},
		getWindowWidth: function() {
			return 252;
		},
		_configureSkill: function(groupArray) {
			//groupArray.appendObject(SkillSentence.SpiritSkillType);
			groupArray.appendObject(SkillSentence.Name);
			groupArray.appendObject(SkillSentence.SkillType);
			groupArray.appendObject(SkillSentence.Invocation); // Only shows when percentage is not 100%
			groupArray.appendObject(SkillSentence.Aggregation); // NEEDS TO BE ENABLED IN CONFIG TAB
			groupArray.appendObject(SkillSentence.ObjectType);
			groupArray.appendObject(SkillSentence.Range);
			groupArray.appendObject(SkillSentence.SpCost);
			groupArray.appendObject(SkillSentence.HpCost);
			groupArray.appendObject(SkillSentence.HeroismCost);
			groupArray.appendObject(SkillSentence.EternityCost);
			groupArray.appendObject(SkillSentence.TenorCost);
			groupArray.appendObject(SkillSentence.ComboCost);
			groupArray.appendObject(SkillSentence.TranquilityCost);
			groupArray.appendObject(SkillSentence.SpiteCost);
			groupArray.appendObject(SkillSentence.ShoveAmount);
			groupArray.appendObject(SkillSentence.Attack);
			groupArray.appendObject(SkillSentence.Defense);
			groupArray.appendObject(SkillSentence.Hit);
			groupArray.appendObject(SkillSentence.Avoid);
			groupArray.appendObject(SkillSentence.Critical);
			groupArray.appendObject(SkillSentence.CriticalAvoid);
			groupArray.appendObject(SkillSentence.ActAfter);
			groupArray.appendObject(SkillSentence.Splash);
		}
	});
}) ();