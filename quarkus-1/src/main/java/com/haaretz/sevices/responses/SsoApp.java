package com.haaretz.sevices.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.haaretz.interfaces.ServiceResponse;
import com.haaretz.models.mongo.User;
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
public class SsoApp implements ServiceResponse {
    private String message;
    private String status;
    private boolean success;
    private int code;
    private long timestamp;
    @JsonProperty("register-status")
    private boolean registerStatus;
    private User user;
}
