'use strict';

import * as express from 'express';
import * as logger from 'morgan';
import {join} from 'path';
import {loadJsonSync} from './util/json';

import core from './core/router';

let app = express();
let paths = loadJsonSync('../../paths.conf');

app.use(logger('dev'));
app.use(express.static(join(__dirname, '../..', paths.dist.client)));

app.use(core);

export default app;
