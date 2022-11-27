/*

    Battle Forecast Busts Config Option
    by HeyItsKyo
    
    Usage:
    To begin, go to Database -> Config -> Script -> Env Parameters.
    Add:
    {
        forecastBusts: 0
    }
    With the number set to what you want the default setting for the option to be.
    0 is ON, 1 is OFF.
    Formatting for Env Parameters is the same as Custom Parameters.
    
    Check the status of the option with
    root.getExternalData().env.forecastBusts;
    
    For example
    if (root.getExternalData().env.forecastBusts == 1) {
        root.log("ForecastBusts are OFF");
    }
    if (root.getExternalData().env.forecastBusts == 0) {
        root.log("ForecastBusts are ON");
    }

*/
(function() {
var alias1 = ConfigWindow._configureConfigItem;
ConfigWindow._configureConfigItem = function(groupArray) {
    
    alias1.call(this, groupArray);
    groupArray.appendObject(ConfigItem.ForecastBusts);
    
},

ConfigItem.ForecastBusts = defineObject(BaseConfigtItem,
{
	selectFlag: function(index) {
		root.getExternalData().env.forecastBusts = index;
	},
	
	getFlagValue: function() {
		if (typeof root.getExternalData().env.forecastBusts !== 'number') {
			return 1;
		}
	
		return root.getExternalData().env.forecastBusts;
	},
    
    getFlagCount: function() {
		return 2;
	},
	
	getConfigItemTitle: function() {
		return "Battle Forecast Busts";
	},
    
	getConfigItemDescription: function() {
		return "Display character busts on the battle forecast screen.";
	}
}
);
}) ();