'use strict';

import {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLList,
	GraphQLString
} from 'graphql/type';

import { Promise } from 'bluebird';
import request from 'request';
import unfluff from 'unfluff';
import { Lexer, Tagger } from 'pos';

let store = {};

let reverse = {};

let stopwords = [
    ',', '.', 'the', 'to', 'of', 'a', 'is', 'in', 'i', 'you', 'with', 'at', 'and', 'be', 'are', 'on', 'that', 'it', 'about', 'can', 'have', 'for',
    'your', ':', 'but', 'more', 'less', '?', 'other', 'most', 'good',
    'up', 'do', 'so'
];

let getTags = ( url ) => {
	console.log( 'getTags', url );

	request.get( url, ( error, response, body ) => {
        let start = (new Date()).getTime();

        store[ url ] = {};

        // TODO:
        // 1. remove punctuation from words
        // 2. delete empty array entries.
        // 3. remove stopwords
        // 4. also count adjective+word pairs
        // * also normalize words and phrases while counting (singular and lowercase)
        // 5. list top N tags that exceed count threshold M

		let data = unfluff( body );
		let corpus = data.title + ' ' + data.description + ' ' + data.text;
		let pos = require('pos');
		let words = new Lexer().lex( corpus );
		let tagger = new Tagger();
		let taggedWords = tagger.tag( words );

        for ( let i in taggedWords ) {
			let taggedWord = taggedWords[ i ];
			let word = taggedWord[ 0 ];
			let tag = taggedWord[ 1 ];

            store[ url ][ word ] = ( store[ url ][ word ] || 0 );

            store[ url ][ word ]++;
		}

        let sorted = [];

        let keys = Object.keys( store[ url ] );

        keys.sort( ( a, b ) => {
            if ( store[ url ][ a ] === store[ url ][ b ] ) { return 0; }

            return ( store[ url ][ a ] < store[ url ][ b ] ) ? 1 : -1;
        } );

        //console.log(

        keys.filter(
            ( item ) => stopwords.indexOf( item.toLowerCase() ) === -1
        )

        keys.forEach( key => {
            reverse[ key ] = reverse[ key ] || [];

            if ( reverse[ key ].indexOf( url ) === -1 ) {
                reverse[ key ].push( url );

                reverse[ key ].sort();
            }
        } );

        //) );

        let end = (new Date()).getTime();

        console.log( end - start, 'ms' );
	} );

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

let getUrls = ( tag ) => {

	// A set of URLs; normally this will return a `Promise`, and the result
	// will vary based on the arguments passed.
	return reverse[ tag ] || [];
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
