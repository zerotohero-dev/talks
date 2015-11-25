/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */
 
var express = require('express');
var app = express();
var sys = require('sys');
var exec = require('child_process').exec;

app.get('/', function(req, res){
    console.log( 'q:' + req.query.id );

    var child;

    child = exec("git checkout 6165251c4b9e8f232cf83b8cd350cbd65eed45d5",
                function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);

        if (!error) {return;}

        console.log('exec error: ' + error);
    });


    var body = 'Welcome to Presentation Server.';

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);

    res.end(body);
});

app.listen(3000);

console.log('Presentation Server listening on port 3000...');
