function bindEvents() {

    var el = document.getElementById('SomeNode');

    // not a simple attribute assignment...
    // {DOMNode.onclick}->closure
    el.onclick = function() {};
    // closes over `el` (by ref {DOMNode}).
}

bindEvents();

var node = document.getElementById('SomeNode');
node.parentNode.removeChild(node);

// IE < 8 is buggy; it cannot break the circular ref between DOM and JS.

function bindEventsNoLeak1() {
    var el = document.getElementById('SomeNode');

    el.onclick = function() {};

    // break the circular ref:
    el = null;
}

function bindEventsNoLeak2() {
    // Look ma, no reference to `el`!

    document.getElementById('SomeNode').onclick = function() {};
}
