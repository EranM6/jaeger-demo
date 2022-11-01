package com.haaretz.service1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScientistClient {
    private static final Logger logger = LoggerFactory.getLogger(ScientistClient.class);
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public ScientistClient(RestTemplate restTemplate, @Value("${services.scientist.url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    String randomScientistName() {
        String url = String.format("%s/api/v1/scientists/random", baseUrl);
        return restTemplate.getForObject(url, String.class);
    }
}
