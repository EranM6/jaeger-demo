const pino = require('pino');

// Create a logging instance
const logger = pino({
    level: process.env.PROFILE === 'prod' ? 'info' : 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
            colorize: process.env.PROFILE === 'local'
        }
    }
});

module.exports.logger = logger;
