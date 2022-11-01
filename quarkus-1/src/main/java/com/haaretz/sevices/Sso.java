package com.haaretz.sevices;

import java.io.IOException;
import java.util.Map;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haaretz.models.api.NewUser;
import com.haaretz.sevices.responses.SsoApp;
import io.smallrye.health.api.HealthGroup;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;

@ApplicationScoped
@HealthGroup("services")
@Default
@Readiness
@Liveness
public class Sso extends ServiceApi<NewUser> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getServiceName() {
        return "sso";
    }

    public SsoApp createUser(NewUser newUser) throws IOException {
        return objectMapper.readValue(post(getEndpoint("register"), newUser), SsoApp.class);
    }

    public SsoApp updateUser(NewUser newUser) throws IOException {
        return objectMapper.readValue(post(getEndpoint("updateUser"), newUser), SsoApp.class);
    }

    @Override
     protected String post(String url, NewUser object) throws IOException {
        object.setResponseType("APP");
        return super.post(url, object);
    }

    @Override
    protected Map<String, String> getHeaders() {
        Map<String, String> headers = super.getHeaders();
        headers.put("token", ConfigProvider.getConfig().getValue("utils.sso.token", String.class));
        return headers;
    }
}
