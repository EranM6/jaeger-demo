package com.haaretz.models.mongo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.codecs.pojo.annotations.BsonProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Range {
    @BsonProperty("first_ip")
    @JsonProperty("first_ip")
    private Double firstIp;
    @BsonProperty("last_ip")
    @JsonProperty("last_ip")
    private Double lastIp;
}
