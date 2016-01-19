'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import bouncy from 'bouncy';
import { readFileSync } from 'fs';
import { createCredentials } from 'crypto';
import log from 'local-fluent-logger';
import { init as initCluster } from 'local-fluent-cluster';

let mapping = {
    hosts: [ 'http://app1:8003', 'http://app2:8003' ],
    currentIndex: 0
};

let init = () => {
    initCluster(
        () => {},
        () => {
            bouncy( ( req, res, bounce ) => {
                bounce( mapping.hosts[ mapping.currentIndex ] );

                mapping.currentIndex = (
                    mapping.currentIndex === ( mapping.hosts.length - 1 )
                ) ?
                    0 :
                    ( mapping.currentIndex + 1 );
            } ).listen( 80 );

            if ( process.env.TERMINATE_SSL ) {
                let selectSni = ( hostname ) => {
                    let creds = {
                        key: readFileSync( `/etc/ssl/private/${hostname}/private.key` ),
                        cert: readFileSync( `/etc/ssl/private/${hostname}/server.crt` )
                    };

                    return createCredentials( creds ).context;
                };

                let ssl = {
                    key: readFileSync('/etc/ssl/private/default.key'),
                    cert: readFileSync('/etc/ssl/private/default.crt'),
                    SNICallback: selectSni
                };

                bouncy( ssl, function (req, bounce ) {
                    bounce( 80 );
                } ).listen( 443 );
            }

            console.log( 'Load balancer initialized.' );
            log.info( 'Load balancer initialized' );
        }
    );
};

export { init };
