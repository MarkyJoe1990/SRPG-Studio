/*
	Version 1.3
	Made by MarkyJoe1990
	
	This plugin gives you additional settings to configure
	when starting a new game, or when calling the event
	command "Config". What the settings do are up to you,
	and you can define what variables and global switches
	it uses.
	
	How To Use:
	- NEW GAME CONFIG
		- Go to your Database -> Config -> Script -> Global Parameters
		- If you haven't already, add an open curly brace "{", and a closed curly brace "}"
		- If you want to add global switches...
			- add a property called "globalSwitchConfig". This is an array, so you will need to use []
			- Inside the [], add the ID number of each global switch you want to use, and separate them with commas.
			- The name and description of your global switches are used in the config screen.
		- If you want to add variables...
			- add a property called "variableConfig". This is an array, so you will need to use []
			- Inside the [], add another set of curly braces.
			- Include the curly braces, add the properties "table", "id", and "options".
			- Add a colon after each, and put in the table number of your variable and its id
				- Keep in mind that the first table is "0", NOT 1.
				- For the options, it's another []. Add either strings or numbers in this one.
				- Example: ["Yes", "No", "Maybe"]
				- Example 2: [25, 50, 75]
				- If you use strings, the variable's value will be set to the position the option was in the array.
					- For example, if you selected "Yes", it would be 0. If you selected "Maybe", it would be 2.
				- If you use numbers, the variable's value will instead be set to the value you put in, rather than the position of the option.
			- For each variable, you will need to separate them with commas.
		- If you want a custom name for your menu...
			- add a property called "configName". Set its value to "[YOUR NAME HERE]"
		- In the end, your global script should look something like this:
		
		{
			globalSwitchConfig: [0, 1],
			variableConfig: [
				{
					table: 0,
					id: 0,
					options: ["Yes", "No", "Maybe"]
				},
				{
					table: 0,
					id: 1,
					options: [25, 50, 75]
				}
			]
		}
		
	- EVENT COMMAND
		- Unlike the New Game config, Event Commands also support local switches with the localSwitchConfig property.
			- It functions exactly like global switches, but for local.
		- Create a "Script Execute" event command
		- Set the type to "Call Event Command", and Object Name to "Config"
		- Follow all the same steps for New Game Config, but instead of Global Parameters, use the Property field of your event command.
	
	To Do:
	- Request by Repeat: Allow for option to increment variables (with min and max values) instead of having a set of options.
*/