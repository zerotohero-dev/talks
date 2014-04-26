function Container(title, root) {
    this.title = title;
    this.el    = root;
}

document.body.innerHTML = '<div id="MasterContainer"></div>';

window.container = new Container(
    'Hello World',
    document.getElementById('MasterContainer')
);                                                               // ( {OBJ-1} )
// or... `var container = new Container(...)`

document.body.innerHTML = '';

console.log( window.container.el );                              // <DOMNode>
console.log( window.container.el.parentNode );                   // null

// window.container -> {OBJ-1} -> el -> <DOMNode(detached)>      // ( {NODE-1} )

// -----------------------------------------------------------------------------

document.body.innerHTML = '<div id="MasterContainer"></div>';

window.container = new Container(
    'Hello Stars',
    document.getElementById('MasterContainer')
);                                                                // ( {OBJ-2} )

// window.container -> {OBJ-2}
// R.I.P. {OBJ-1}
// R.I.P. {NODE-1}

document.body.innerHTML = '';

// window.container -> {OBJ-2} -> el -> <DOMNode(detached)>      // ( {NODE-2} )

delete window.container.el;

// R.I.P {NODE-2}

delete window.container;

// R.I.P. {OBJ-2}

// =============================================================================

// ----------------- OBJECT CREATION -------------------------------------------

Object.create(proto, attrs);

var newObject = new MyObject();

var primitiveStr = 'hello world';

var primitiveNumber = 42;

var a = [ ];  // allocates memory for the array and contained values

var o = { };  // allocates memory for an object and contained values

// Functions are nothing but [Callable] objects.
function createComparator() {
    return function(a, b) { return a >= b; }
}

function getResult() {

    // returns a new object, every single call.
    return {compound: 'result', from: 'function'};
}

// watch out: b is a brand new array.
var b = a.slice(1);

// s2 is a new string:
var s2 = s.substr(0, 3);
// Since strings are immutable, JavaScript may decide to not allocate memory,
// but just store the [0, 3] range.

var a  = ["ouais ouais", "nan nan"];
var a2 = ["generation", "nan nan"];

// new array with 4 elements being the concatenation of a and a2 elements
var a3 = a.concat(a2);
