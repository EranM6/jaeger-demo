require("./utils/tracer").init();

const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const {typeDefs, resolvers} = require('./schema');
const UserAPI = require("./data-source/userApi");

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});
// Ensure we wait for our server to start
server.start()
    .then(() => {
        // Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
        app.use(
            '/',
            cors(),
            bodyParser.json(),
            // expressMiddleware accepts the same arguments:
            // an Apollo Server instance and optional configuration options
            expressMiddleware(server, {
                context: async ({req}) => {
                    const {cache} = server;
                    return {
                        token: req.headers.token,
                        dataSources: {
                            userAPI: new UserAPI({cache}),
                        },
                    }
                },
            }),
        );

// Modified server startup
        httpServer.listen({port: 3000}, () => {
            console.log(`🚀 Server ready at http://localhost:4000/`);
        });
    });

