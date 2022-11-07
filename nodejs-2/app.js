const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressPino = require('express-pino-logger');
const indexRouter = require('./routes/index');
const {traceRequest} = require("./utils/tracer");
require("./mongoDb/index");
const {logger} = require("./utils/logger");

const expressLogger = expressPino({ logger });

const app = express();

// app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(traceRequest)

app.use('/', indexRouter);

module.exports = app;
