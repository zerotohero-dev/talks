'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

import unfluff from 'unfluff';
import { Lexer, Tagger } from 'pos';
import { NounInflector } from 'natural';

let inflector = new NounInflector();

/**
 *
 */
let prepareTaggedWords = ( body ) => {
    let data = unfluff( body );

    return {
        tags: data.tags,
        taggedWords: ( new Tagger() ).tag( new Lexer().lex( (
            data.title + ' \n\n ' +
            data.description + ' \n\n ' +
            data.text )
                .replace( /[`“”]/g, ' ' )
                .replace(/[\[\]><=&@]/g, ' ')
                .replace (/…/g, ':' )
        ) )
    };
};

/**
 *
 */
let singularize = ( word ) => inflector.singularize( word );

export {
    prepareTaggedWords,
    singularize
};
