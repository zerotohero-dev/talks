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
import { NounInflector } from 'natural';

let cache = {};

// TODO: make this a public npm module
let stopwords = [
    "a", "about", "above", "after", "again", "against", "all", "am", "an",
    "and", "any", "are", "aren't", "as", "at", "be", "because", "been",
    "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further",
    "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd",
    "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if",
    "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me",
    "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off",
    "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
    "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
    "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    'lot', 'lots', 'quite', 'since', 'very'
    'yourselves',
    ".", ",", ":", ";", "!", "#", "*", "...", "…", "?", '-', '–', '—', '_', '`',
    '(', ')', '[', ']', '{', '}', '/', '\\',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'
];

let inflector = new NounInflector();
let singularize = ( word ) => inflector.singularize( word );

let add = ( url, buffer ) => {
    if ( buffer.length === 0 ) { return; }

    cache[ url ] = cache[ url ] || { words: {}, counts: [] };

    let urlCache = cache[ url ];

    let words = urlCache.words;
    let counts = urlCache.counts;

    let word = buffer.join( ' ' );

    words[ word ] = words[ word ] || 0;

    words[ word ]++;

    let count = words[ word ];

    counts[ count ] = counts[ count ] || [];

    if ( counts[ count ].indexOf( word ) === -1 ) {
        counts[ count ].push( word );
    }
};

let getTags = ( url ) => {
	console.log( 'getTags', url );

	request.get( url, ( error, response, body ) => {
        let start = (new Date()).getTime();

        // store[ url ] = {};

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

        words = words.map(
            ( word ) => singularize( word
                .replace( /[“”]/, '' )
                .replace( /[‘’]/, "'" )
            )
        ).filter(
            ( word ) => stopwords.indexOf( word.toLowerCase() ) === -1
        );

		let tagger = new Tagger();
		let taggedWords = tagger.tag( words );

        let buffer = [];

        // TODO: extract this part as a public npm module.
        for ( let i in taggedWords ) {
		    let taggedWord = taggedWords[ i ];
		    let word = taggedWord[ 0 ];
            let tag = taggedWord[ 1 ];
            let isAdjective = tag.indexOf('JJ') === 0;

            // If not an adjective count at least once.
            if ( !isAdjective ) {
                add( url, [ word ] );
            }

            buffer.push( word );

            if ( !isAdjective ) {
                add( url, buffer );
                buffer.length = 0;
            }
        }

        let urlCache = cache[ url ];

        urlCache.counts = [];

        for ( let key in urlCache.words ) {
            urlCache.counts.push( { word: key, count: urlCache.words[ key ] } );
        }

        urlCache.counts.sort( ( a, b ) => {
            if ( a.count === b.count ) { return 0; }

            return a.count < b.count ? 1: -1;
        } );

        console.log( JSON.stringify( cache, null, 4) );

        // TODO: algorithm cleanup:
        // there are leaking ... and ' s in the matched words
        // there are missed stopwords, like "can"
        // stored words should be lowercase (proper nouns included)
        // accept first N words and any M tuple that have an occurrence higher than K

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
