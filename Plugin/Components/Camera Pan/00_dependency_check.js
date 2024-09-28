( function () {
    var alias1 = SetupControl.setup;
    SetupControl.setup = function() {
        alias1.call(this);
        CameraPanControl.dependencyCheck();
    }
}) ();