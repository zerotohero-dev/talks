
(function() {
    window.addEventListener('load', function() {
        setTimeout(function(){
            console.log(
                    performance.timing.loadEventEnd -
                    performance.timing.responseEnd
            );
        }, 0);
    });
}());

