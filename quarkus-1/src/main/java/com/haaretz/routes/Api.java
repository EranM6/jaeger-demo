package com.haaretz.routes;

import com.haaretz.models.mongo.User;
import com.haaretz.mongodb.UsersDb;
import org.jboss.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

@Path("/api")
public class Api {
    private static final Logger LOG = Logger.getLogger(Api.class);
    @Inject
    UsersDb usersDb;

    @Produces(MediaType.APPLICATION_JSON)
    @GET
    @Path("getRandomUser")
    public User getRandomUser(HttpHeaders httpHeaders) {
        return usersDb.getRandomDoc();
    }
}
