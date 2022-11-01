package com.haaretz.clients;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/v1/animals")
@Produces(MediaType.TEXT_PLAIN)
@RegisterRestClient(configKey="animals")
public interface AnimalService {
    @GET
    @Path("/random")
    String getRandom();
}
