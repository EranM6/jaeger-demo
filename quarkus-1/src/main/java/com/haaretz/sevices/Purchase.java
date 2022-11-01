package com.haaretz.sevices;

import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haaretz.models.api.EntitlementInfo;
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
public class Purchase extends ServiceApi {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ENDPOINT = "entitlement";

    public String getServiceName() {
        return "purchase";
    }

    public EntitlementInfo checkEntitlement(int subsNo) throws IOException {
        HttpResponse response = fetch(String.format("%s/getUserInfo?subsNo=%d", getEndpoint(ENDPOINT), subsNo));
        String body = EntityUtils.toString(response.getEntity());

        return objectMapper.readValue(body, EntitlementInfo.class);
    }

    public EntitlementInfo sendEntitlement(EntitlementInfo user) throws IOException {
        HttpResponse response = fetch(String.format("%s/sendEmailBySubsNoAndEmail?subsNo=%d&userMail=%s", getEndpoint(ENDPOINT), user.getSubsNo(), user.getUserMail()));
        String body = EntityUtils.toString(response.getEntity());

        return objectMapper.readValue(body, EntitlementInfo.class);
    }
}
