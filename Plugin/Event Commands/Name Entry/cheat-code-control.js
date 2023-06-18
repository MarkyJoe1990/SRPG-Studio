var CheatCodeControl = {
    getMasterCheatPassword: function() {
        return "";
    },

    checkMasterCheatPassword: function(string) {
        return string === this.getMasterCheatPassword();
    },

    setCheatConfig: function(isEnabled) {
        root.getMetaSession().global.cheatConfig = isEnabled;
    },

    isCheatConfigEnabled: function() {
        return root.getMetaSession().global.cheatConfig === true;
    }
};