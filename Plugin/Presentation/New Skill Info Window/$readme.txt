/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin restructures the Skill Info Window shown on the
    unit stat screen, allowing it to be more flexible and making
    it easier to add new skill information on it. This plugin
    also puts additional information on the window so the player
    has more detail as to what the skill does.

    Since custom skills can have all sorts of different effects,
    I added a "translator" function that will better describe
    what custom skills will do. However, this is incomplete, and
    never will be fully complete. If you want to add translations,
    go to base-skill-sentence.js and add some new translations to
    CustomSkillTranslator.

    The Skill Info Window has some support for custom parameters,
    but given how drastically custom skills can can vary, I still
    need to come up with a more elegant solution that prevents
    conflicts.
	
	This plugin overrides the original functions for:
	
	* SkillInfoWindow.setSkillInfoData
	* SkillInfoWindow.moveWindowContent
	* SkillInfoWindow.drawWindowContent
	* SkillInfoWindow.getWindowHeight
	* SkillInfoWindow.getWindowWidth
	
	Be weary of any new plugins that change this function, as they
	might not be compatible with this plugin.
*/