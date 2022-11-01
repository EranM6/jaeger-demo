package com.haaretz.models.mongo;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.haaretz.interfaces.MongoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements MongoResponse {
    @JsonAlias({"_id", "userId" })
    private String id;
    private String password;
    private String firstName;
    private String userMail;
    private Date updateDate;
    private MobilePhone mobilePhone;
    private Date registerDate;
    private Boolean isAbuser;
    private List<Product> products;
    private Boolean isPaying;
    private String lastName;
    private Boolean miniRegStatus;
    private Boolean isPhoneEmailConn;
    private Integer subsNo;
    private Date mailValidationDate;
    private String registerBrand;
    private String registerOrigin;
    private Date mobileValidationDate;
    private List<Map<String, ?>> specialOffers;
    private String antiAbuseToken;
    private String ticket;
}
