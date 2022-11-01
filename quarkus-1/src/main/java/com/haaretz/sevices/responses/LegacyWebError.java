package com.haaretz.sevices.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.haaretz.interfaces.ServiceResponse;
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
public class LegacyWebError implements ServiceResponse {
    private String message;
    @JsonProperty("login-status")
    private boolean loginStatus;
}
