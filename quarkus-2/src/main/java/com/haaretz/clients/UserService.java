package com.haaretz.clients;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@RegisterRestClient(configKey="users")
public interface UserService {
    @GET
    @Path("/getRandomUser")
    String getRandom();

    @GET
    String getById(@QueryParam("query") String id, @QueryParam("searchBy") String searchBy);
}
