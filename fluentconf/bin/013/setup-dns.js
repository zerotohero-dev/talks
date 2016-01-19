#!/usr/bin/env node

'use strict';

var join = require('path' ).join;
var readFileSync = require('fs' ).readFileSync;
var writeFileSync = require('fs' ).writeFileSync;

var hostsFilePartial = '$ttl 38400\n' +
'fluent.conf.	IN	SOA	ns.fluent.conf. admin.fluent.conf. (\n' +
'			1452187525\n' +
'			10800\n' +
'			3600\n' +
'			604800\n' +
'			38400 )\n' +
'fluent.conf.	IN	NS	ns.fluent.conf.\n' +
'ns.fluent.conf.	IN	A	192.168.99.100\n';
//'api.fluent.conf.	IN	A	172.17.0.3\n' +
//'api.fluent.conf.	IN	A	172.17.0.4\n'

var resolvConfPartial = 'search bad\n';
//'nameserver 8.8.8.8\n' +
//'nameserver 8.8.4.4\n';

// Wait for a while for environment data to persist.
setTimeout( function() {
    console.log( 'dirname', __dirname );

    var region1LoadBalancerPath = join( __dirname, '../../containers/common/region001/data/service-region-001-load-balancer.dat' );
    var region2LoadBalancerPath = join( __dirname, '../../containers/common/region002/data/service-region-002-load-balancer.dat' );
    var hostsFilePath = join( __dirname, '../../containers/common/dns/bind/lib/fluent.conf.hosts' );
    var resolvPath = join( __dirname, '../../containers/common/data/resolv.conf' );

    var record1 = 'api.fluent.conf.	IN	A	' + readFileSync( region1LoadBalancerPath ).toString().replace(/\n/g, '' ) + '\n';
    var record2 = 'api.fluent.conf.	IN	A	' + readFileSync( region2LoadBalancerPath ).toString().replace(/\n/g, '' ) + '\n';

    var dns = readFileSync( join( __dirname, 'dns.txt' ) );

    var reg = /"(.*?)"/g;

    reg.exec( dns );

    var dnsServerIp = reg.exec( dns )[ 1 ];
    var hostsFile = hostsFilePartial + record1 + record2;
    var resolvConf = resolvConfPartial + 'nameserver ' + dnsServerIp + '\n';

    writeFileSync( hostsFilePath, hostsFile );
    writeFileSync( resolvPath, resolvConf );

    console.log( 'All done!' );
}, 5000 );

console.log( 'Please wait…' );
