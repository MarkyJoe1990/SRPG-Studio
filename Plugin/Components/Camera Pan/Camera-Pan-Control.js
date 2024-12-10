// Convenient functions that are used
// for the CameraPan object.

var CameraPanControl = {
    dependencyCheck: function() {
        if (typeof EaseControl == "undefined") {
            root.msg("WARNING: For the Camera Pan component to function, you need the Ease Control component as well. Please get it from MarkyJoe's GitHub:\n\nhttps://github.com/MarkyJoe1990/SRPG-Studio");
            root.endGame();
        }
    },

    defaultTimeMethod: function(cameraPan) {
        return Math.floor((Math.abs(cameraPan._diffX) + Math.abs(cameraPan._diffY)) / 36) + 12;
    },

    mouseTimeMethod: function(cameraPan) {
        return cameraPan.getParentInstance()._isAccelerate() ? 0 : 2;
    },

    snapTimeMethod: function(cameraPan) {
        var max = 10;
        var time = Math.floor((Math.abs(cameraPan._diffX) + Math.abs(cameraPan._diffY)) / 36) + 4;

        if (time > max) {
            time = max
        }

        return 8;
    },

    defaultEaseMethod: function(t, b, c, d) {
        return Math.floor(EaseControl.easeInOutQuad(t, b, c, d));
    },

    mouseEaseMethod: function(t, b, c, d) {
        return Math.floor(EaseControl.easeLinear(t, b, c, d))
    }
}