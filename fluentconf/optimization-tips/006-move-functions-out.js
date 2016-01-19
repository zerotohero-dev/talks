function doStuffWithData(data) {
    void data;
}


function hotCodePath(req) {
    var something = {value: 42};

    req.on('data', function(err, data) {
        doStuffWithData(data, something);
    });
}

var cache = {};

function handleResponse(err, data) {
    doStuffWithData(data, cache.something);
}

function hotCodePathOptimized(req) {
    cache.something = {value: 42};

    req.on('data', handleResponse);
}


hotCodePath({});
hotCodePathOptimized({});
