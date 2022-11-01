package com.haaretz.utils;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.haaretz.models.enums.Site;

public class SiteDeserializer extends StdDeserializer<String> {
    public SiteDeserializer() {
        this(null);
    }

    public SiteDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public String deserialize(JsonParser jp, DeserializationContext ctx) throws IOException, JsonProcessingException {
        return Site.getByName(jp.getText()).getNumber();
    }

}
