package com.haaretz.models.api;

import java.util.Date;

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
public class EntitlementInfo implements ServiceResponse {
    private int subsNo;
    private boolean success;
    private String message;
    private String msg;
    private String userMail;
    private Date emailSentDate;
    private String ssoId;
    private boolean sentEmail;

}
