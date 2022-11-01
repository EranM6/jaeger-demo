const mongoose = require('mongoose');
const {logger} = require("../utils/logger");

const connection = mongoose.connection;

const connString = process.env.MONGO_CONN_STRING || "mongodb://localhost:27017"

connection.on('connecting', () => {
    logger.info('Connecting to MongoDB');
});
connection.on('error', error => {
    logger.error('Error in MongoDB connection: %O', error);
    mongoose.disconnect();
    process.exit(1);
});
connection.on('connected', () => {
    logger.info('MongoDB connected!');
});
connection.once('open', () => {
    logger.info('MongoDB connection opened!');
});
connection.on('reconnected', () => {
    logger.info('MongoDB reconnected!');
});
connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected! %s', mongoose.connection.readyState);
    process.exit(1);
});

mongoose.connect(`${connString}/user-info`);

mongoose.Promise = global.Promise;