function selfSwitchInterpret(selfSwitch) {
	if (typeof selfSwitch == "number") {
		return selfSwitch;
	}
	
	result = selfSwitch.toLowerCase();
	
	return result.charCodeAt(0) - 97;
}