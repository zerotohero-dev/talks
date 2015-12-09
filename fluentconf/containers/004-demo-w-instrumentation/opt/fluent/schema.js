'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLList,
	GraphQLString
} from 'graphql/type';
import { getTags } from './net';
import { getUrls } from './data';

let query = new GraphQLObjectType( {
    name: 'RootQuery',

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
