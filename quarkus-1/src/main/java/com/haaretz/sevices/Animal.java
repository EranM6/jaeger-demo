package com.haaretz.sevices;

import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;

import io.smallrye.health.api.HealthGroup;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;

@ApplicationScoped
@HealthGroup("services")
@Default
@Readiness
@Liveness
public class Animal extends ServiceApi {

    private static final String ENDPOINT = "api/v1/animals";

    public String getServiceName() {
        return "animal";
    }

    public String getAnimal() throws IOException {
        HttpResponse response = fetch(String.format("%s/random", getEndpoint(ENDPOINT)));
        String body = EntityUtils.toString(response.getEntity());

        return body;
    }

}
