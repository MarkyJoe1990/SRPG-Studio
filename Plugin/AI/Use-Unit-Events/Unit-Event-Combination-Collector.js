( function () {
    CombinationCollector.UnitEvent = defineObject(BaseCombinationCollector, {
        collectCombination: function(misc) {
            var list = UnitEventAIControl.getUnitEventList();
            var i, event, rangeMetrics, aiSteps, filter, count = list.getCount();
            var j, aiStep, count2;

            for (i = 0; i < count; i++) {
                event = list.getData(i);

                misc.event = event;
                aiSteps = event.custom.aiSteps;
                count2 = 1; // Hard coded to only have 1 at the moment. // aiSteps.length;

                // For now, only have one step.
                for (j = 0; j < count2; j++) {
                    aiStep = aiSteps[j];
                    rangeMetrics = StructureBuilder.buildRangeMetrics();
                    rangeMetrics.startRange = aiStep.startRange;
                    rangeMetrics.endRange = aiStep.endRange;
    
                    filter = aiStep.unitFilterFlag;
                    this._setUnitRangeCombination(misc, filter, rangeMetrics);
                }
            }
        }
    });

    var alias1 = CombinationBuilder._configureCombinationCollector;
	CombinationBuilder._configureCombinationCollector = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.appendObject(CombinationCollector.UnitEvent);
	}
}) ();