'use strict';

export interface Plugin {
    hooks: PluginEventListener;
    init: (options: Object) => boolean;
}

export interface PluginEventListener {
    onMessage?: () => void;
    /* ... */
}
