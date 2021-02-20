var StatInfluencerControl = {
	getStatInfluencerArray: function(object) {
		return object.custom.statInfluencerArray != undefined ? object.custom.statInfluencerArray : this.createStatInfluencerArray(object);
	},
	
	createStatInfluencerArray: function(object) {
		var count = ParamGroup.getParameterCount();
		var i = 0;
		object.custom.statInfluencerArray = [];
		
		for (i = 0; i < count; i++) {
			object.custom.statInfluencerArray.push(0);
		}
		
		return object.custom.statInfluencerArray;
	}
};