'use strict';

import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLString
} from 'graphql/type';

import { Promise } from 'bluebird';

let getTags = () => {

    // A set of tags; normally this will return a `Promise`, and the result
    // will vary based on the arguments passed.
    return [
        'ecmascript',
        'javascript',
        'node',
        'node.js',
        'performance',
        'perfmatters'
    ];
};

let getUrls = () => {

    // A set of URLs; normally this will return a `Promise`, and the result
    // will vary based on the arguments passed.
    return [
        'http://becausejavascript.com/node-js-process-nexttick-vs-setimmediate',
        'http://begriffs.com/posts/2015-07-22-essence-of-frp.html',
        'http://benchmarkjs.com/',
        'http://benhowdle.im/touche/',
        'http://benmccormick.org/2015/09/09/what-can-backbone-developers-learn-from-react/',
        'http://bennettfeely.com/csscreatures/',
        'http://betterexplained.com/'
    ];
};

let query = new GraphQLObjectType( {
  name: 'Query',

  fields: () => ( {
    tags: {
        description: 'List of tags computed off of a URL.',
        type: new GraphQLList( GraphQLString ),

        args: {
            url: {
                description: 'The URL to auto-extract the tags from.',
                type: GraphQLString
            }
        },

        resolve: ( root, { url } ) => getTags( url )
    },

    urls: {
        description: 'List of urls that share a tag.',
        type: new GraphQLList( GraphQLString ),

        args: {
            tag: {
                description: 'The tag to get the list of URLs.',
                type: GraphQLString
            }
        },

        resolve: ( root, { tag } ) => getUrls( tag )
    }
  } )
} );

export default new GraphQLSchema( { query: query } );
