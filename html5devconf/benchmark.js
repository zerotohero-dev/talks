
function flush() {void document.body.offsetTop;}

// To determine how heavy a chunk of markup is:
function benchmark() {
    var test = document.getElementById('Test');

    // Hide the element
    test.style.display = "none";

    // Flush all the style changes:
    flush();

    var time1 = window.performance.now();

    // Reapply style.
    test.style.display = "";

    // Flush all the style changes again.
    flush();

    var time2 = window.performance.now();

    return time2 - time1;
}

var counter = 0, data = [];

var id = setInterval(function() {
    data.push(benchmark());

    if ( counter > 20) {
        clearInterval(id);

        console.log(
                data.reduce(function(a,b) {return a + b;}) / data.length
        );
    }

    counter++;
}, 100);
