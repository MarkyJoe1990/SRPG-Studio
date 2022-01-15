/*
	Version 2.0
	Made by MarkyJoe1990
	
	This plugin allows states to have additional effects
	after their timer runs out, whether it be dealing
	damage to the inflicted unit, giving them a separate
	status effect, or even running an event set up by
	the user (more on that later)
	
	If this status effect is removed via an event command,
	the effects will still apply, so be aware of this.
	
	How to use:
	- Create a status effect
	- Click the "Custom Parameters" button.
	- IF YOU WANT IT TO INFLICT ANOTHER STATE
		- Create a parameter called "exitState"
		- Set its ID to match that of the state you want inflicted.
		- Alternatively, you can set it to a function that uses "unit" and "state" as arguments in that order.
	- IF YOU WANT IT TO DAMAGE THE USER
		- Create a parameter called "exitDamage"
		- Set the damage as a flat number
		- Alternatively, you can set it to a function that uses "unit" and "state" as arguments in that order.
	- IF YOU WANT IT TO RUN AN EVENT COMMAND
		- ... Hoo boy. Here we go.
		- Create a parameter called "isAutoEventCheck"
		- Set it to true.
		- If you don't have ID Variables enabled, go to a map in your game, and click the orange "VA" button.
		- Go to the options tab and check the box to enabled ID variables.
		- Go to either your map's auto events, or go to your map common events.
		- Create a new event. Right click and go to Details -> Custom Parameters.
		- Create a parameter called "isStateEndEvent", set it to true.
		- Next, go to your event's conditions (right below the page 1 tab).
		- Go to the script tab and check the box that enables the use of scripts.
		- Add this code: StateEndControl.isQueuedState(YOUR_STATE_ID_HERE);
		- replace YOUR_STATE_ID_HERE with the same state id as the one you're using.
		- Now you can start adding event commands. However, if you want to use the inflicted unit or their status effect for anything, you'll need to store their IDs in an ID variable
			- Create an Event Command called Script Execute.
			- Set the Type to "Execute Code"
			- Check the box that says "Save return value as variable"
			- Set the variable as an ID variable of your choosing. NORMAL VARIABLES WILL NOT WORK.
			- In the Code area, use StateEndControl.getStateEndUnitId() if you want to store the unit as a variable.
			- Alternatively, use StateEndControl.getStateEndStateId() for storing their state as a variable.
			- From there, you are free to use these variables for whatever nefarious ideas you may have. Enjoy~
	- IF YOU WANT THE EFFECTS TO ONLY FIRE UNDER SPECIFIC CONDITIONS
		- Create a parameter called "triggerConditions"
		- Set its value to a function that uses "unit" and "state" as arguments in that order.
		- Write your code. Make sure the return value is boolean (true or false).
	- Plugin allows for any combination of custom parameters to work.
	- Done
	
*/

// state.custom.exitState - Status effect to inflict after this one ends.
// state.custom.exitDamage - Damage to deal after this state ends.
// state.custom.isAutoEventCheck - Run specific auto events with the custom parameter "isStateEndEvent" set to true.
// state.custom.triggerConditions - Set the conditions for which the above effects will happen.

(function () {
	var alias1 = StateControl.arrangeState;
	StateControl.arrangeState = function(unit, state, increaseType) {
		if (increaseType === IncreaseType.DECREASE) {
			var exitEffectConditions = state.custom.exitEffectConditions || function(unit, state) { return true };
			
			if (exitEffectConditions(unit, state) == true) {
				if (state.custom.exitState != undefined) {
					var stateEndEffect = createObject(InflictStateEndEffect);
					stateEndEffect.setStateEndEffect(unit, state);
					
					StateEndControl.addToQueue(stateEndEffect);
				}
				
				if (state.custom.exitDamage != undefined) {
					var stateEndEffect = createObject(DamageStateEndEffect);
					stateEndEffect.setStateEndEffect(unit, state);
					
					StateEndControl.addToQueue(stateEndEffect);
				}
				
				if (state.custom.isAutoEventCheck == true) {
					var stateEndEffect = createObject(EventStateEndEffect);
					stateEndEffect.setStateEndEffect(unit, state);
					
					StateEndControl.addToQueue(stateEndEffect);
				}
			}
		}
		
		return alias1.call(this, unit, state, increaseType);
	}
	
	var alias2 = TurnChangeStart.pushFlowEntries;
	TurnChangeStart.pushFlowEntries = function(straightFlow) {
		alias2.call(this, straightFlow);
		straightFlow.pushFlowEntry(StateEndFlow);
	}
}) ();