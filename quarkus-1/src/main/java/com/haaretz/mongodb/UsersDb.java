package com.haaretz.mongodb;

import com.haaretz.models.mongo.User;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import io.quarkus.mongodb.MongoClientName;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.health.Liveness;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;

@ApplicationScoped
@Liveness
@Default
public class UsersDb extends MongoDb<User> {
    @Inject
    @MongoClientName("users")
    MongoClient mongoClient;

    @ConfigProperty(name = "quarkus.mongodb.users.database")
    String database;

    public MongoCollection<User> getCollection() {
        return mongoClient.getDatabase(database)
                .getCollection("users", User.class);
    }

    public String getClientName() {
        return "users";
    }
}
