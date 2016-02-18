'use strict';

import {readFileSync} from 'fs';

export function loadJsonSync(path: string) {
    let file = readFileSync(path, 'utf8');
    return JSON.parse(file);
}
