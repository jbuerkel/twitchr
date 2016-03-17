import {DefaultOptions} from 'connect-mongo';

declare module 'connect-mongo' {
    interface DefaultOptions {
        /**
         * (Default: 0)
         */
        touchAfter?: number;
    }
}
