function selfSwitchInterpret(selfSwitch) {
	if (typeof selfSwitch == "number") {
		return selfSwitch;
	}
	
	if (selfSwitch == null) {
		return selfSwitch;
	}
	
	result = selfSwitch.toLowerCase();
	
	return result.charCodeAt(0) - 97;
}