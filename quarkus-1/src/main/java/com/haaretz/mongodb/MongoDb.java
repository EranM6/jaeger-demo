package com.haaretz.mongodb;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haaretz.interfaces.MongoResponse;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.result.InsertOneResult;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.HealthCheckResponseBuilder;

import static com.mongodb.client.model.Filters.eq;

public abstract class MongoDb<T extends MongoResponse> implements HealthCheck {
    abstract MongoCollection<T> getCollection();

    abstract String getClientName();

    protected static final int SEARCH_LIMIT = 10;

    public HealthCheckResponse call() {
        HealthCheckResponseBuilder responseBuilder = HealthCheckResponse.named(String.format("%s MongoDB connection health check", getClientName()));

        try {
            checkConnection();
            responseBuilder.up();
        } catch (IllegalStateException e) {
            responseBuilder.down().withData("error", e.getMessage());
        }

        return responseBuilder.build();
    }

    public void checkConnection() {
        getCollection().find().first();
    }

    protected T getItem(Document query) {
        Document projection = new Document("password", 0);
        return getCollection().find(query).projection(projection).first();
    }

    public T getItemById(Object id) {
        return getItem(new Document("_id", id));
    }

    protected Set<T> search(Document query, Document projection, Document sort, int limit) {
        projection.append("password", 0);
        Set<T> res = new HashSet<>();
        getCollection()
                .find(query)
                .projection(projection)
                .sort(sort)
                .limit(limit)
                .into(res);

        return res;
    }

    protected Set<T> searchPhrase(String q) {
        Document query = new Document("$text", new Document("$search", String.format("\"%s\"", q)));

        return textSearch(query, SEARCH_LIMIT);
    }

    protected Set<T> searchPart(String q, Set<T> exclude) {
        int limit = SEARCH_LIMIT;
        Document query;
        if (exclude != null && exclude.size() > 0) {
            query = new Document("$and", Arrays.asList(
                    new Document("$text", new Document("$search", q)),
                    new Document("_id", new Document("$nin", exclude.stream().map(MongoResponse::getId).collect(Collectors.toList())))
            ));
            limit = SEARCH_LIMIT - exclude.size();
        } else {
            query = new Document("$text", new Document("$search", q));
        }

        return textSearch(query, limit);
    }

    private Set<T> textSearch(Document query, int limit) {
        Document projection = new Document("score", new Document("$meta", "textScore"));

        Document sort = new Document("score", new Document("$meta", "textScore"));

        return search(query, projection, sort, limit);
    }

    public Set<T> getSearchResults(String q, String field) {
        return getSearchResults(q);
    }

    public Set<T> getSearchResults(String q) {
        Set<T> resPhrases = searchPhrase(q);
        Set<T> resParts = new HashSet<>();

        if (resPhrases.size() < SEARCH_LIMIT) {
            resParts = searchPart(q, resPhrases);
        }

        return Stream.concat(resPhrases.stream(), resParts.stream())
                .collect(Collectors.toSet());
    }

    public T updateDocument(T item) {
        ObjectMapper oMapper = new ObjectMapper();
        Document fields = new Document();

        Map<String, Object> dataMap = oMapper.convertValue(item, Map.class);
        dataMap.values().removeIf(Objects::isNull);

        Bson queryFilter = eq("_id", item.getId());

        for (String field : dataMap.keySet()) {
            fields.append(field, dataMap.get(field));
        }
        Document update = new Document("$set", fields);

        return updateDocument(queryFilter, update);
    }

    public T insertItem(T item) {
        InsertOneResult result = getCollection().insertOne(item);
        return getItemById(result.getInsertedId());
    }

    protected T updateDocument(Bson queryFilter, Document update) {
        FindOneAndUpdateOptions options = new FindOneAndUpdateOptions();
        options.returnDocument(ReturnDocument.AFTER);

        return getCollection().findOneAndUpdate(queryFilter, update, options);
    }
}
