var Vantage = require('vantage' );

var vantage = new Vantage();

var cmd = vantage.command( 'ping' )

    cmd.description( 'Checks vantage.' )
    .action( function( args, callback ) {

        // `this` refers to a Vorpal CommandInstance.
        // And there is no way to reach it from the `vantage` root object.
        // Hence we have to use `function` instead of fat arrows here.
        this.log( 'pong.' );

        callback();
    } );

vantage.listen(8080);
