package com.haaretz.service1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {
    private static final Logger logger = LoggerFactory.getLogger(UserClient.class);
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public UserClient(RestTemplate restTemplate, @Value("${services.users.url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    String getUser(@RequestParam("query") String id) {
        String url = String.format("%s/api/user?id=%s", baseUrl, id);
        return restTemplate.getForObject(url, String.class);
    }

    String getAnimal() {
        String url = String.format("%s/api/getAnimal", baseUrl);
        return restTemplate.getForObject(url, String.class);
    }
}
