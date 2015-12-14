'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

// TODO: make this a library and put it to NPM.
// TODO: add  a link to the repo/gist to the original version of this code.

var matrix = require( 'array-matrix') ;

module.exports = chart;

function chart( data, opts ) {
    opts = opts || {};

    var w = opts.width || 130;
    var h = opts.height || 30;
    var pad = opts.padding || 3;

    w -= pad * 2;
    h -= pad * 2;

    // setup
    var out = matrix( w, h );
    var m = max (data ) || 0;
    var label = Math.abs( m ).toString();
    var labelw = label.length;
    var labelp = 1;

    // chart sizes void of padding etc
    var ch = h;
    var cw = w - labelw - labelp;

    // fill
    for ( var y = 0; y < h; y++ ) {
        for  ( var x = 0; x < w; x++) {
            out[ y ][ x ] = ' ';
        }
    }

    // y-axis labels
    for ( var i = 0; i < labelw; i++)  {
        out[0 ] [ i ] = label[i ] ;
    }

    out[ h - 1 ][ labelw - labelp ] = '0';

    // y-axis
    for ( var y = 0; y < h; y++ ) {
        out[ y ][ labelw + labelp ] = '․';
    }

    // x-axis
    var x = labelw + labelp;
    while (x < w) {
        out[ h - 1 ][ x++ ] = '․';
        out[ h - 1 ][ x++ ] = ' ';
    }

    // Strip excess from head so that data may "roll":
    var space = Math.floor( w / 2 ) - 1;
    var excess = Math.max( 0, data.length - space );
    if ( excess) {
        data = data.slice( excess);
    }

    // Plot the data:
    var x = labelw + labelp + 2;
    for ( var i = 0; i < data.length; i++ ) {
        var d = data[ i ];
        var p = d / m;
        var y = Math.round( ( h - 2 ) * p );
        var c = y < 0 ? '░' : '█';

        if ( y < 0 ) {
            y = -y;
        }

        while ( y-- ) {
            out[ Math.abs( y - h ) - 2 ] [ x ] = c;
        }

        x += 2;
    }

    return pad( string( out, h ), pad );
}

function pad(str, n) {
    var linew = str.split( '\n' )[ 0 ].length;
    var line = Array( linew ).join(' ') + '\n';

    // y
    str = Array( n ).join( line ) + str;
    str = str + Array( n ).join( line );

    // x
    str = str.replace( /^/gm, Array( n ).join(' ') );

    return str;
}

function string( out ) {
    var buf = [];

    for ( var i = 0; i < out.length; i++ ) {
        buf.push( out[i].join( '' ) );
    }

    return buf.join( '\n' );
}

function max( data ) {
    var n = data[ 0 ];

    for ( var i = 1; i < data.length; i++ ) {
        n = data[ i ] > n ? data[ i ] : n;
    }

    return n;
}
