var EaseControl = {
    easeLinear: function (t, b, c, d) {
        return c * t / d + b;
    },

    easeInQuad: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    easeOutQuad: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },

    easeInOutQuad: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
};