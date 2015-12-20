'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import { prepareTaggedWords } from './transform';
import { singularize } from './transform';
import stopWords from './stopwords';

let cache = { tags: {}, urls: {} };

// Make the state globally accessible, so that we can remotely inspect it.
process.fluent = process.fluent || {};
process.fluent.cache = cache;

let unique = ( collection ) => collection.reduce( ( acc, cur ) => {
    if ( acc.indexOf( cur ) === -1 ) { acc.push( cur ); }

    return acc;
}, [] );

let postProcessWord = ( words, word ) => {
    let singular = singularize( word );

    if ( singular.toLowerCase() !== word && words[ singular ] ) {
        words[ word ] += words[ singular ];
        words[ singular ] = 0;
    }
};

let postProcessWords = ( url ) => {
    let words = cache.urls[ url ].words;

    Object.keys( words )
        .forEach( ( word ) => postProcessWord( words, word ) );
};

let add = ( url, buffer ) => {
    if ( buffer.length === 0 ) { return; }

    let urlCache = cache.urls[ url ];
    let words = urlCache.words;

    let word = buffer.join( ' ' ).toLowerCase();

    words[ word ] = words[ word ] || 0;
    words[ word ]++;
};

let addWord = ( url, buffer, taggedWord ) => {
    let word = taggedWord[ 0 ]
        .trim()
        .replace( /(’|’s|’es)$/g, '' );
    let tag = taggedWord[ 1 ];

    let isAdjective = tag.indexOf('JJ') === 0;
    let isNoun = tag.indexOf('NN') === 0;

    let skip = /[A-Z]/.test( word[ 0 ] ) || stopWords.indexOf( word.toLowerCase() ) > -1;

    if ( skip ) { return; }

    if ( !isAdjective && !isNoun ) {
        buffer.length = 0;

        return;
    }

    if ( isAdjective ) {
        buffer.push( word );

        return;
    }

    if ( buffer.length > 0 ) {
        buffer.push( word );
        add( url, buffer );
        buffer.length = 0;
    }

    add( url, [ word ] );
};

let setWordCounts = ( url, body ) => {
    let buffer = [];

    let { tags, taggedWords } = prepareTaggedWords( body );

    taggedWords.forEach( ( taggedWord ) => {
        addWord( url, buffer, taggedWord );
    } );

    return tags;
};

let computeCounts = ( url ) => {
    let urlCache = cache.urls[ url ];

    Object.keys( urlCache.words ).forEach( ( key ) => {
        urlCache.counts.push( { word: key, count: urlCache.words[ key ] } );
    } );

    urlCache.counts.sort( ( a, b ) => {
        if ( a.count === b.count ) { return 0; }

        return a.count < b.count ? 1: -1;
    } );
};

let computeTags = ( seed, url ) => {
    let urlCache = cache.urls[ url ];

    let singleWordTags = [];
    let multiWordTags = [];

    urlCache.counts.forEach( ( { word, count } ) => {
        if ( word.indexOf ( ' ' ) === -1 ) {
            if ( singleWordTags.length < 3 ) {
                singleWordTags.push ( word );
            }
        } else {
            if ( count > 1 || word.split ( ' ' ).length > 2 ) {
                multiWordTags.push ( word );
            }
        }
    } );

    urlCache.tags = unique(
        seed
            .concat( singleWordTags )
            .concat( multiWordTags )
            .map( ( tag ) => tag.toLowerCase() )
    ).sort();

    urlCache.tags.forEach( ( tag ) => {
        cache.tags[ tag ] = cache.tags[ tag ] || [];

        let cacheTag = cache.tags[ tag ];

        if ( cacheTag.indexOf( url ) === -1 ) {
            cacheTag.push( url );
            cacheTag.sort();
        }
    } );
};

let pluckTags = ( url ) => cache.urls[ url ].tags;

let resetCache = ( url ) => cache.urls[ url ] = { words: {}, counts: [], tags: [] };

/**
 *
 */
let getUrls = ( tag ) => cache.tags[ tag ];

/**
 *
 */
let getTags = ( url, body ) => {
    resetCache( url );

    let tags = setWordCounts( url, body );

    postProcessWords( url );
    computeCounts( url );
    computeTags( tags, url );

    return pluckTags( url );
};

export {
    getTags,
    getUrls
};
