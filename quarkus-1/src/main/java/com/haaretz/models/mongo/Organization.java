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
public class Organization {
    private Double userid;
    private String name;
    private String description;
    private String range = "";
    @BsonProperty("contact_details")
    @JsonProperty("contact_details")
    private String contactDetails;
    @BsonProperty("contact_phone")
    @JsonProperty("contact_phone")
    private String contactPhone;
    @BsonProperty("contact_email")
    @JsonProperty("contact_email")
    private String contactEmail;
    @BsonProperty("contact_more")
    @JsonProperty("contact_more")
    private String contactMore;
    private int eng;
    private int heb;
    private int tm;
}
