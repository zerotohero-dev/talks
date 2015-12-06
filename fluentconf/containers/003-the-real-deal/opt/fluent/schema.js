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
    'a',
    'able', 'about', 'above', 'abst', 'accordance', 'according', 'accordingly',
    'across', 'act', 'actually', 'added', 'adj', 'affected', 'affecting',
    'affects', 'after', 'afterwards', 'again', 'against', 'ah', 'all', 'almost',
    'alone', 'along', 'already', 'also', 'although', 'always', 'am', 'among',
    'amongst', 'an', 'and', 'announce', 'another', 'any', 'anybody', 'anyhow',
    'anymore', 'anyone', 'anything', 'anyway', 'anyways', 'anywhere',
    'apparently', 'approximately', 'are', 'aren', 'are\'n', 'arent', 'aren\'t',
    'arise', 'around', 'as', 'aside', 'ask', 'asking', 'at', 'auth',
    'available', 'away', 'awfully',

    'b',
    'back', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been',
    'before', 'beforehand', 'begin', 'beginning', 'beginnings', 'begins',
    'behind', 'being', 'believe', 'below', 'beside', 'besides', 'between', 'beyond', 'biol', 'both', 'brief', 'briefly', 'but', 'by',

    'c',
    'ca', 'came', 'can', 'cannot', 'can\'t', 'cause', '\'cause', 'causes',
    'certain', 'certainly', 'co', 'com', 'come', 'comes', 'contain',
    'containing', 'contains', 'could', 'couldnt', 'couldn\'t',

    'd',
    '\'d', 'date', 'did', 'didn\'t', 'different', 'do', 'does', 'doesn\'t',
    'doing', 'done', 'don\'t', 'down', 'downwards', 'due', 'during',

    'e',
    'each', 'ed', '\'ed', 'e\'d', 'edu', 'effect', 'eg', 'eight', 'eighty',
    'either', 'else', 'elsewhere', 'end', 'ending', 'enough', 'especially',
    'et', 'et-al', 'etc', 'etcetera', 'et-cetera', 'even', 'ever', 'every',
    'everybody', 'everyone', 'everything', 'everywhere', 'ex', 'except',

    'f',
    'far', 'few', 'ff', 'fifth', 'first', 'five', 'fix', 'followed',
    'following', 'follows', 'for', 'former', 'formerly', 'forth', 'found',
    'four', 'from', 'further', 'furthermore',

    'g',
    'gave', 'get', 'gets', 'getting', 'give', 'given', 'gives', 'giving',
    'go', 'goes', 'gone', 'got', 'gotten',

    'h',
    'had', 'happens', 'hardly', 'has', 'hasn\'t', 'have', 'haven\'t', 'having',
    'he', 'hed', 'he\'d', 'hence', 'her', 'here', 'hereafter', 'hereby',
    'herein', 'heres', 'hereupon', 'hers', 'her\'s', 'herself', 'hes',
    'he\'s', 'hi', 'hid', 'him', 'himself', 'his', 'hither', 'home', 'how',
    'howbeit', 'however', 'hundred',

    'i',
    'id', 'i\'', 'i\'d', 'ie', 'if', 'i\'ll', 'im', 'i\'m', 'immediate',
    'immediately', 'importance', 'important', 'in', 'inc', 'indeed', 'index',
    'information', 'instead', 'into', 'invention', 'inward', 'is', 'isn\'t',
    'it', 'it\'', 'itd', 'it\'d', 'it\'ll', 'its', 'it\'s', 'itself', 'i\'ve',

    'j',
    'just',

    'k',
    'keep', 'keeps', 'kept', 'kg', 'km', 'know', 'known', 'knows',

    'l',
    'largely', 'last', 'lately', 'later', 'latter', 'latterly', 'least',
    'less', 'lest', 'let', 'lets', 'let\'s', 'like', 'liked', 'likely', 'line',
    'little', '\'ll', 'look', 'looking', 'looks', 'ltd',

    'm',
    'made', 'mainly', 'make', 'makes', 'many', 'may', 'maybe', 'me', 'mean',
    'means', 'meantime', 'meanwhile', 'merely', 'mg', 'might', 'million',
    'miss', 'ml', 'more', 'moreover', 'most', 'mostly', 'mr', 'mrs', 'much',
    'mug', 'must', 'my', 'myself',

    'n',
    'na', 'name', 'namely', 'nay', 'nd', 'near', 'nearly', 'necessarily',
    'necessary', 'need', 'needs', 'neither', 'never', 'nevertheless', 'new',
    'next', 'nine', 'ninety', 'no', 'nobody', 'non', 'none', 'nonetheless',
    'noone', 'nor', 'normally', 'nos', 'not', 'noted', 'nothing', 'now',
    'nowhere',

    'o',
    'obtain', 'obtained', 'obviously', 'of', 'off', 'often', 'oh', 'ok', 'okay',
    'old', 'omitted', 'on', 'once', 'one', 'ones', 'only', 'onto', 'or', 'ord',
    'other', 'others', 'otherwise', 'ought', 'our', 'ours', 'our\'s',
    'ourselves', 'out', 'outside', 'over', 'overall', 'owing', 'own',

    'p',
    'page', 'pages', 'page\'s', 'part', 'particular', 'particularly', 'past',
    'per', 'perhaps', 'placed', 'please', 'plus', 'poorly', 'possible',
    'possibly', 'potentially', 'pp', 'predominantly', 'present', 'previously',
    'primarily', 'probably', 'promptly', 'proud', 'provides', 'put',

    'q',
    'que', 'quickly', 'quite', 'qv',

    'r',
    'ran', 'rather', 'rd', 're', '\'re', 'readily', 'really', 'recent',
    'recently', 'ref', 'refs', 'regarding', 'regardless', 'regards', 'related',
    'relatively', 'research', 'respectively', 'resulted', 'resulting',
    'results', 'right', 'run',

    's',
    'said', 'same', 'saw', 'say', 'saying', 'says', 'sec', 'section', 'see',
    'seeing', 'seem', 'seemed', 'seem\'d', 'seeming', 'seems', 'seen', 'self',
    'selves', 'sent', 'seven', 'several', 'shall', 'shant', 'shan\'t', 'she',
    'shed', 'she\'d', 'she\'ll', 'shes', 'she\'s', 'should', 'shouldn\'t',
    'show', 'showed', 'shown', 'showns', 'shows', 'significant',
    'significantly', 'similar', 'similarly', 'since', 'six', 'slightly', 'so',
    'some', 'somebody', 'somehow', 'someone', 'somethan', 'something',
    'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry',
    'specifically', 'specified', 'specify', 'specifying', 'still', 'stop',
    'strongly', 'sub', 'substantially', 'successfully', 'such', 'sufficiently',
    'suggest', 'sup', 'sure',

    't',
    'take', 'taken', 'taking', 'tell', 'tends', 'th', 'than', 'thank', 'thanks',
    'thanx', 'that', 'that\'ll', 'thats', 'that\'s', 'that\'ve', 'the', 'their',
    'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter',
    'thereby', 'thered', 'there\'d', 'therefore', 'therein', 'there\'ll',
    'thereof', 'therere', 'theres', 'there\'s', 'thereto', 'thereupon',
    'there\'ve', 'these', 'they', 'theyd', 'they\'d', 'they\'ll', 'theyre',
    'they\'re', 'they\'ve', 'think', 'this', 'those', 'thou', 'though',
    'thoughh', 'thousand', 'throug', 'through', 'throughout', 'thru', 'thus',
    'til', 'tip', 'to', 'together', 'too', 'took', 'toward', 'towards', 'tried',
    'tries', 'truly', 'try', 'trying', 'ts', '\'ts', 'twice', 'two',

    'u',
    'un', 'under', 'unfortunately', 'unless', 'unlike', 'unlikely', 'until',
    'unto', 'up', 'upon', 'ups', 'us', 'use', 'used', 'useful', 'usefully',
    'usefulness', 'uses', 'using', 'usually',

    'v',
    'value', 'various', '\'ve', 'very', 'via', 'viz', 'vol', 'vols', 'vs',

    'w',
    'want', 'wants', 'was', 'wasnt', 'wasn\'t', 'way', 'we', 'we\'d', 'wed',
    'welcome', 'we\'ll', 'went', 'were', 'werent', 'weren\'n', 'weren\'t',
    'we\'ve', 'what', 'whatever', 'what\'ll', 'whats', 'what\'s', 'when',
    'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby',
    'wherein', 'wheres', 'where\'s', 'whereupon', 'wherever', 'whether',
    'which', 'while', 'whim', 'whither', 'who', 'who\'ve', 'who\'d', 'whod',
    'whoever', 'whole', 'who\'ll', 'whom', 'whomever', 'whos', 'who\'s',
    'whose', 'why', 'widely', 'will', 'willing', 'wish', 'with', 'within',
    'without', 'wont', 'won\'t', 'words', 'world', 'would', 'wouldnt',
    'wouldn\'t', 'www',

    'x',

    'y',
    'yes', 'yet', 'you', 'you\'d', 'youd', 'you\'ll', 'your', 'youre',
    'you\'re', 'yours', 'yourself', 'yourselves', 'you\'ve',

    'z',
    'zero',

    'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten',

    '.', ',', ':', ';', '!', '#', '*',
    '...', '…', '?',
    '-', '–', '—', '_', '~',
    '"', "'", '`', '“', '”', '‘', '’',
    '(', ')', '[', ']', '{', '}', '/', '\\',

    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '10', '20', '30', '40', '50', '60', '70', '80', '90', '100',

    'list', 'function', 'object', 'data', 'method', 'value', 'program',
    'day', 'date', 'month', 'year', 'time', 'application', 'll',
    'thing', 'util', 'utility', 'type', 'element', 'var', 'man', 've',
    'return', 'language', 'code', 'change', 'master', 'feature', 'output',
    'lot', 'rate', 'state'
];

/*
Before doing this run all the APIs and add additional stop words.
Also add mappers to tags that are incorrectly singularized.

Take tags from the unfluff meta;
then take 3 multi-word tags with >3 occurrences
then take top 3 single word tags.
sort them alphabetically.

 */

let inflector = new NounInflector();
let singularize = ( word ) => inflector.singularize( word );

let add = ( url, buffer ) => {
    if ( buffer.length === 0 ) { return; }

    cache[ url ] = cache[ url ] || { words: {}, counts: [] };

    let urlCache = cache[ url ];

    let words = urlCache.words;
    let counts = urlCache.counts;

    let word = singularize( buffer.join( ' ' ).toLowerCase() );

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
        // cleanup <script> and CDATA from sample docs
        // discard numbers as tags.
        // bug: "thi" is matched as a noun.
        //
        // selext max 3 single words plux max 3 phrases give phrases higher prio. a phrase shall repat at least (word count + 1 ) times to count.

		let data = unfluff( body );

        // console.log( data );
        // console.log( '-------' );

		let corpus = (
            data.title + ' \n---\n ' +
            data.description + ' \n---\n ' +
            data.text
        ).replace( /[~'‘’“”…`&><+-=\[\]{}\(\)\\/…]/g, ' ' );

        // Prioritize the tags that unfluff finds.
        // keywords, tags


        // console.log( '----------------------' );
        // console.log( corpus );
        // console.log( '----------------------' );


//        return;

		let words = new Lexer().lex( corpus );

        // console.log( words );
        // console.log( '---------' );

		let tagger = new Tagger();

		let taggedWords = tagger.tag( words );

         //console.log( taggedWords );
        // return;

        let buffer = [];

        // TODO: extract this part as a public npm module.
        for ( let i in taggedWords ) {
		    let taggedWord = taggedWords[ i ];
		    let word = taggedWord[ 0 ];
            let tag = taggedWord[ 1 ];
            let isAdjective = tag.indexOf('JJ') === 0;
            let isNoun = tag.indexOf('NN') === 0;
            let isVerb = tag === 'VB';

            // TODO: clearly describe what this algorithm does.

            if ( /[^A-Z]/.test( word[ 0 ] ) && stopwords.indexOf( singularize( word.toLowerCase() ) ) === -1 ) {
                if ( !isAdjective && !isNoun ) {
                    buffer.length = 0;
                } else {
                    if ( isAdjective ) {
                        buffer.push( word );
                    } else {
                        if ( isNoun ) {
                            if ( buffer.length > 0 ) {
                                buffer.push( word );
                                add( url, buffer );
                                buffer.length = 0;
                            }
                            add( url, [ word ] );
                        }
                    }
                }
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

        // For debugging purposes:
        console.log( JSON.stringify( cache, null, 4) );

        // TODO: algorithm cleanup:
        // Try will all the link you have.
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
