const express = require('express');
const opentelemetry = require('@opentelemetry/api');
const {getRandom} = require("../mongoDb/model");
const {logger} = require("../utils/logger");
const router = express.Router();
const axios = require("axios");
const parallel =  require('async/parallel');

const isLocal = process.env.PROFILE === 'local'

const uris = {
    users: isLocal ? 'localhost:8080' : 'trigger:8080',
    trigger: isLocal ? 'localhost:8080' : 'trigger:8080'
}

/* GET home page. */
router.get('/getUser', function (req, res, next) {
    // const activeSpan = opentelemetry.trace.getSpan(api.context.active())
    const activeSpan = opentelemetry.trace.getSpan(opentelemetry.context.active())
    const traceId = activeSpan.spanContext().traceId;
    parallel({
        user: callback => {
            axios
                .get(`http://${uris.users}/api/v1/names/user`)
                .then(({data}) => {
                    callback(null, data)
                })
                .catch(function (error) {
                    callback(error)
                });
        },
        trigger: callback => {
            axios
                .get(`http://${uris.users}/api/v1/names/random`)
                .then(({data}) => {
                    callback(null, data)
                })
                .catch(function (error) {
                    callback(error)
                });
        },
        fromMongo: callback => getRandom(callback)
    }, (err, data) => {
        if (err) {
            logger.error(err)
        }
        res.send(data)
    })
});

module.exports = router;
