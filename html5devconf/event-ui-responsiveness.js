/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

function move() {}

Event.accelerationIncludingGravity = {x:0,y:0,z:0};

document.addEventListener('devicemotion', function (evt) {
    var node = document.getElementById('point'),
        x = evt.accelerationIncludingGravity.x,
        y = evt.accelerationIncludingGravity.y,
        z = evt.accelerationIncludingGravity.z;

    // DOM is Lava! Don't touch it too much!
    move(node, x, y, z);
});

// Better:

var state = {x: 0, y: 0, z: 0};

document.addEventListener('devicemotion', function (evt) {
    var vector = evt.accelerationIncludingGravity;

    state.x = vector.x;
    state.y = vector.y;
    state.z = vector.z;
});

function loop() {

    // Show love to `requestAnimationFrame`
    requestAnimationFrame(loop);

    move(
        document.getElementById('point'),
        state.x, state.y, state.z
    );
}

loop();
