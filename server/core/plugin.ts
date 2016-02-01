/* jshint node: true */
'use strict';

// maybe event attribute to specify appropriate irc events
export interface IPlugin<T> {
    name: string; // remove
    version: string; // remove
    conf: T; // uninitialized

    init: (conf: T) => void; // setter for conf /w defaults
    run: () => void; // do work
}
