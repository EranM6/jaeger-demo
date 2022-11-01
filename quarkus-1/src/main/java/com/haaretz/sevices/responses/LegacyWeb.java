package com.haaretz.sevices.responses;

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
public class LegacyWeb implements ServiceResponse {
    private String success;
}
