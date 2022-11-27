/*
	Version 1.0
	by MarkyJoe1990

	This plugin takes unit events and consolidates them
	into a sub-menu similar to how the Attack command
	brings you to a sub-menu of weapons to select.
	
	It also adds numerous additional functionality, such as:
	
	- Option to make unit event not waste a turn
	- A skill that makes all unit events not waste a turn
	- Ability to have "global" unit events that apply to all units
	- Long descriptions
	- ability to check if unit event "costs" something
	- ability to apply that cost to the unit
	
	This plugin overrides one function, UnitCommand._appendUnitEvent.
	Be warey of any plugins that use this function, since they will
	likely be effected.
	
	Setting a global unit:
	The process is simple. Just go to your preferred player unit, go into
	their custom parameters, and write {global:true}. Any unit events this
	unit has will be available to all units that meet the requirements.
	
	Creating the "Free-Action" skill:
	Create a skill, set it to custom, click the Keyword field, and write
	"Free-Action"
	
	Custom Parameters:
	To start, be aware that you can check and set an event's custom
	parameters by going to the event, right clicking, selecting "details",
	then "Custom Parameters".
	
	excludeFromSubMenu:
	Forces the Unit Event to be in the main command menu rather than
	in the Unit Event sub menu.
	
	freeAction:
	Makes the unit event not cost a turn to use.
	
	description:
	a description that will be displayed when hovering the cursor on
	the unit event
	
	cost:
	How much of something the unit event costs to use. What the cost
	is will be something you have to define in the code. Check for
	_applyCost and _meetsCost in the sub-menu.js file.
	
*/

var UNIT_EVENT_SUB_MENU_NAME = "Unit Event";