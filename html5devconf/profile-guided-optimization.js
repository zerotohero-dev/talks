function isDigit(ch) {
    return (ch !== ' ') && '0123456789'.indexOf(ch) >= 0;
}

var MAX_ITEMS = 100;

function doStuff() {}

function isFull(node) {
    return node.querySelectorAll('li.actionable').length > MAX_ITEMS &&
        node.nodeName === 'UL' &&
        node.hasAttribute('data-active');
}

var nodes = document.getElementsByTagName('*');

nodes.forEach(function(node) {
    if (isFull(node)) {
       doStuff(node);
    }
});

function isFullOptimized(node) {
    return node && node.nodeName === 'UL' &&
        node.hasAttribute('data-active') &&
        node.querySelectorAll('li.actionable').length > MAX_ITEMS;
}


