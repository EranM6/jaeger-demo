const typeDefs = require('./typeDefs');

const resolvers = {
    Query: {
        user: async (_, {}, { dataSources }) => {
            return dataSources.userAPI.getUser();
        },
        error: async (_, {}, { dataSources }) => {
            return dataSources.userAPI.getError();
        },
    },
};

module.exports = { typeDefs, resolvers }