require('graphql-import-node/register');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const userType = require('./user.graphql');
const scalarsType = require('./scalars.graphql');
const queryType = require('./query.graphql');

module.exports = mergeTypeDefs([
    queryType,
    userType,
    scalarsType
])
