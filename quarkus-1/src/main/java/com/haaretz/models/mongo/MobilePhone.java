package com.haaretz.models.mongo;

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
public class MobilePhone {
    private String phonePrefix;
    private String phoneSuffix;
    private String userMobile;
}
