package com.haaretz.mongodb;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;

import com.haaretz.interfaces.MongoResponse;
import com.haaretz.models.mongo.User;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import io.quarkus.mongodb.MongoClientName;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.health.Liveness;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

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

    public User getUserBySubNo(int subNo) {
        return getItem(new Document("subsNo", subNo));
    }

    public User getUserByMail(String userMail) {
        return getItem(new Document("userMail", userMail));
    }

    public User resetAbuse(String ssoId, Integer prodNum) {
        Bson queryFilter = and(
                new ArrayList<>() {{
                    add(eq("_id", ssoId));
                    add(eq("products.prodNum", prodNum));
                }}
        );

        Document update = new Document("$unset", new Document().append("products.$.abuse", ""));
        return updateDocument(queryFilter, update);
    }

    @Override
    public Set<User> getSearchResults(String q, String field) {
        User user = getItem(new Document(field, field.equals("subsNo") ? Integer.valueOf(q) : q));
        if (user != null) {
            return new HashSet<>() {{
                add(user);
            }};
        }
        return null;
    }

    @Override
    protected Set<User> searchPhrase(String q) {
        Pattern pattern = Pattern.compile(String.format("^%s$", q), Pattern.CASE_INSENSITIVE);
        Document query = new Document("$or", Arrays.asList(
                new Document("firstName", pattern),
                new Document("lastName", pattern),
                new Document("userMail", pattern),
                new Document("_id", pattern),
                new Document("subsNo", pattern)
        ));

        if (Pattern.compile("\\d+").matcher(q).matches()) {
            query.append("subsNo", Integer.valueOf(q));
        }

        return search(query, new Document(), new Document(), SEARCH_LIMIT);
    }

    @Override
    protected Set<User> searchPart(String q, Set<User> exclude) {
        int limit = SEARCH_LIMIT;
        Set<String> parts = Stream.of(q.trim().split("\\S")).collect(Collectors.toSet());
        Document patterns = new Document("$in", parts.stream().map(part -> Pattern.compile(String.format("^%s$", part), Pattern.CASE_INSENSITIVE)).collect(Collectors.toList()));
        Document conditions = new Document("$or", Arrays.asList(
                new Document("firstName", patterns),
                new Document("lastName", patterns),
                new Document("userMail", patterns),
                new Document("_id", patterns)
        ));

        Document query;
        if (exclude != null && exclude.size() > 0) {
            query = new Document("$and", Arrays.asList(
                    conditions,
                    new Document("_id", new Document("$nin", exclude.stream().map(MongoResponse::getId).collect(Collectors.toList())))
            ));
            limit = SEARCH_LIMIT - exclude.size();
        } else {
            query = conditions;
        }

        return search(query, new Document(), new Document(), limit);
    }
}
