
var timerId, intervalId;

function leakSetTimeout() {

    timerId = setTimeout(function loop(){
        doStuff();

        setTimeout(loop, 1000);
    }, 1000);
}

function leakSetInterval() {
    intervalId = setInterval(function() {
        doStuff();
    }, 1000);
}

leakSetTimeout();
leakSetInterval();

function clearLeaks() {
    clearTimeout(timerId);
    clearInterval(intervalId);
}

function willStillLeak() {
    leakSetTimeout();
    leakSetTimeout();
    leakSetInterval();
    leakSetInterval();
}