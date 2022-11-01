package com.haaretz.models.api;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.haaretz.utils.SiteDeserializer;
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
public class NewUser {
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private String userName;
    private String oldUserName;
    @JsonDeserialize(using = SiteDeserializer.class)
    private String site;
    private String termsChk;
    private String responseType;
}
