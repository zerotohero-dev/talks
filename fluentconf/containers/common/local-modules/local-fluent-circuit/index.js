'use strict';

/*
 * This program is distributed under the terms of the MIT license:
 * <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
 * Send your comments and suggestions to <me@volkan.io>.
 */

let circuitOpen = false;

/**
 *
 */
let isOpen = () => circuitOpen;

/**
 *
 */
let isClosed = () => !circuitOpen;

/**
 *
 */
let close = () => circuitOpen = false;

/**
 *
 */
let open = () => circuitOpen = true;

export { open, close, isOpen, isClosed };
