/* jshint node: true */
'use strict';

import * as express from 'express';
import * as path from 'path';
import * as helmet from 'helmet';
import * as logger from 'morgan';

import * as core from './core/router';

var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../build')));

app.use(core);

export = app;
