var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

function init() {
    var a = 0;

    if (cluster.isMaster) {
        console.log( 'master: ', a);
        console.log( 'master', process.pid );

        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on( 'listening', function( worker) {
            console.log( 'listening... ' );
            console.log( 'worker ID: ' + worker.id );

            worker.send({id: worker.id});

            worker.on('disconnect', function() {
                console.log('wrk disconnect');
            });

            setTimeout(function() {
                //worker.disconnect();
                worker.kill();

            }, (a++)*4000)
        } );

        cluster.on('exit', function(worker, code, signal) {
            //console.log('worker ' + worker.process.pid + ' died');
            cluster.fork();
        });


        cluster.on( 'disconnect', function( worker ) {
            console.log( 'disconnect ');
        } );

    } else {
        console.log('not master', a );

        process.on ( 'message', function ( msg ) {
            //console.log ( 'got message', msg );
            //console.log ( typeof msg );

        } );

        console.log ( 'not master', process.pid );
//    console.log( process.env );

        // Workers can share any TCP connection
        // In this case it is an HTTP server
        http.createServer ( function ( req, res ) {
            res.writeHead ( 200 );
            res.end ( "hello world\n" );
        } ).listen ( 8000 );
    }
}

exports.init = init;



