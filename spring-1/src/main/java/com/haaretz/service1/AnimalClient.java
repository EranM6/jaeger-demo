package com.haaretz.service1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AnimalClient {
    private static final Logger logger = LoggerFactory.getLogger(AnimalClient.class);
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AnimalClient(RestTemplate restTemplate, @Value("${services.animal.url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    String randomAnimalName() {
        String url = String.format("%s/api/v1/animals/random", baseUrl);
        return restTemplate.getForObject(url, String.class);
    }
}
