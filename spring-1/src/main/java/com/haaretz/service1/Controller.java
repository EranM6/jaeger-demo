package com.haaretz.service1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static strman.Strman.toKebabCase;

@RestController
@RequestMapping("/api/v1/names")
public class Controller {
    private final Logger logger = LoggerFactory.getLogger(Controller.class);
    private final ScientistClient scientistClient;
    private final AnimalClient animalClient;
    private final UserClient userClient;

    @Autowired
    public Controller(ScientistClient scientistClient, AnimalClient animalClient, UserClient userClient) {
        this.scientistClient = scientistClient;
        this.animalClient = animalClient;
        this.userClient = userClient;
    }

    @GetMapping(path = "/random")
    public String name(@RequestHeader HttpHeaders headers) throws Exception {
        String animal = animalClient.randomAnimalName();
        String scientist = scientistClient.randomScientistName();
        return toKebabCase(scientist) + "-" + toKebabCase(animal);
    }

    @GetMapping(path = "/user")
    public String user(String id) throws Exception {
        String user = userClient.getUser(id);
        return user;
    }

    @GetMapping(path = "/animal")
    public String animal() throws Exception {
        String animal = userClient.getAnimal();
        return animal;
    }
}
