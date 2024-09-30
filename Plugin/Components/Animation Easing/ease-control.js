/*
    EaseControl
    v1.0 by MarkyJoe1990

    This wrapper is designed to make it easy to create
    smooth, "easing" animations. Some of my other
    plugins require you to have this in order to
    function.

    Arguments:
    t: Current time in frames
    b: Starting value
    c: Desired change in value
    d: Max time
*/

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