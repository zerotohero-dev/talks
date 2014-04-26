function bindEvents() {
    var el = document.getElementById('SomeNode');
    el.onclick = function() {};
}

bindEvents();
      
document.getElementById('SomeNode').parentNode.removeChild(
    document.getElementById('SomeNode')
);

// IE < 8 is buggy and will leak.

function bindEventsNoLeak1() {
    var el = document.getElementById('SomeNode');

    el.onclick = function() {        
    };

    el = null;
}

function bindEventsNoLeak2() {
    // Look ma, no reference to `el`!
    
    document.getElementById('SomeNode').onclick = function() {        
    };
}

function nill() {};

function XHRLeak() { // IE < 9
    var ajax = new XMLHttpRequest();

    ajax.open('GET', '/service/endpoint', true);

    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {            
            doMagic(ajax.responseText);

            // ajax.onreadystatechange = function(){};
            // ajax.onreadystatechange = nill;
            // ajax = null;
        }
    };

    ajax.send('');
}

/*
    Below will leak in IE version < 8
    (IE8+ with compatibility mode set to lower IE versions will leak too)
 */

function selfRefLeak() {
    var el = document.createElement('div');
    el.foo = el;
}

function functionPointerLeak() {
    var el = document.createElement('div');
    el.foo = el.setAttribute;
}

function indirectReferenceLeak() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('div');
    el1.foo = el2;
    el2.bar = el1;
}

function circularExpandoLeak() {
    var x = {};
    x.el = document.createElement('div');
    x.el.expando = x;
}

function parentCleanupLeak() {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.expando = el;
    el.parentElement.innerHTML = '';
}

function closureLeak() {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.onclick = function () {};
    el.removeNode();
}

function closureLeakParentCleanup() {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.onclick = function () {};
    el.parentNode.innerHTML = '';
}

