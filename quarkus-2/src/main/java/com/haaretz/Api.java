package com.haaretz;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.haaretz.clients.AnimalService;
import com.haaretz.clients.UserService;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@Produces(MediaType.APPLICATION_JSON)
@Path("/api")
public class Api {
    @RestClient
    @Inject
    UserService userService;

    @RestClient
    @Inject
    AnimalService animalService;

    @GET
    @Path("/user")
    public String userById(@QueryParam("id")String id) {
        return userService.getById(id, "_id");
    }

    @GET
    @Path("/randomUser")
    public String randomUser() {
        return userService.getRandom();
    }

    @GET
    @Path("/randomAnimal")
    public String randomAnimal() {
        return animalService.getRandom();
    }
}
