function selfSwitchInterpret(selfSwitch) {
	var type = typeof selfSwitch;
	if (type == "number" || selfSwitch == null) {
		return selfSwitch;
	}
	
	result = selfSwitch.toLowerCase();
	
	return result.charCodeAt(0) - 97;
}