package com.haaretz.routes;

import java.util.Scanner;
import java.util.Set;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

import com.haaretz.models.api.ApiResponse;
import com.haaretz.models.api.EntitlementInfo;
import com.haaretz.models.api.NewUser;
import com.haaretz.models.api.ResetAbuseObj;
import com.haaretz.models.mongo.User;
import com.haaretz.mongodb.UsersDb;
import com.haaretz.sevices.Animal;
import com.haaretz.sevices.Purchase;
import com.haaretz.sevices.Sso;
import com.haaretz.sevices.responses.SsoApp;
import com.mongodb.MongoException;
import org.jboss.logging.Logger;

@Path("/api")
public class Api {
    private static final Logger LOG = Logger.getLogger(Api.class);
    @Inject
    UsersDb usersDb;

    @Inject
    Purchase purchase;

    @Inject
    Animal animal;

    @Inject
    Sso sso;

    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @Path("updateUser")
    public ApiResponse<User> updateUser(NewUser user) {
        ApiResponse.ApiResponseBuilder<User> res = ApiResponse.builder();

        SsoApp ssoRes;
        try {
            ssoRes = sso.updateUser(user);
        } catch (Exception e) {
            return res
                    .success(false)
                    .name("ארעה שגיאה במהלך עידכון המשתמש")
                    .message(e.getMessage())
                    .build();
        }

        res
                .success(ssoRes.isSuccess())
                .body(ssoRes.getMessage())
                .name(ssoRes.isSuccess() ? "משתמש עודכן בהצלחה" : ssoRes.getMessage())
                .data(usersDb.getUserByMail(user.getUserName()));

        return res.build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @Path("createUser")
    public ApiResponse<User> createUser(NewUser user) {
        ApiResponse.ApiResponseBuilder<User> res = ApiResponse.builder();
        user.setConfirmPassword(user.getPassword());
        user.setTermsChk("on");

        SsoApp ssoRes;
        try {
            ssoRes = sso.createUser(user);
        } catch (Exception e) {
            return res
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }

        res
                .success(ssoRes.isSuccess())
                .body(ssoRes.getMessage())
                .name(ssoRes.isSuccess() ? "משתמש נוצר בהצלחה" : ssoRes.getMessage())
                .data(usersDb.getUserByMail(user.getUserName()));

        return res.build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @Path("resetAbuse")
    public ApiResponse<User> resetAbuse(ResetAbuseObj product) {
        ApiResponse.ApiResponseBuilder<User> res = ApiResponse.builder();
        try {
            res
                    .data(usersDb.resetAbuse(product.getId(), product.getProdNum()))
                    .success(true)
                    .body("המשתמש עודכן בהצלחה");
        } catch (Exception e) {
            res
                    .success(false)
                    .message(((MongoException) e).getMessage())
                    .name(((MongoException) e).getMessage())
                    .body("ארעה שגיאה במהלך עידכון המשתמש");
        }

        return res.build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @GET
    @Path("searchUser")
    public ApiResponse<Set<User>> searchUsers(HttpHeaders httpHeaders, @QueryParam("query") String query, @QueryParam("searchBy") String searchBy) {
        ApiResponse.ApiResponseBuilder<Set<User>> res = ApiResponse.builder();
        if (searchBy.equals("subsNo")) {
            if (!isInteger(query)) {
                res
                        .success(false)
                        .message("מס' מינוי אינו תקין")
                        .body("ארעה שגיאה במהלך חיפוש משתמש");
            }
        }
        try {
            Set<User> user = usersDb.getSearchResults(query, searchBy);
            if (user != null) {
                res
                        .data(user)
                        .success(true);
            } else {
                res
                        .success(false)
                        .body("משתמש לא נמצא");
            }
        } catch (Exception e) {
            res
                    .success(false)
                    .message(e.getMessage())
                    .body("ארעה שגיאה במהלך חיפוש משתמש");
        }

        return res.build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @GET
    @Path("checkEntitlement")
    public ApiResponse<EntitlementInfo> checkEntitlement(@QueryParam("subsNo") int subsNo) {
        ApiResponse.ApiResponseBuilder<EntitlementInfo> res = ApiResponse.builder();
        EntitlementInfo entitlementRes;
        try {
            entitlementRes = purchase.checkEntitlement(subsNo);
        } catch (Exception e) {
            return res
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }

        res
                .success(entitlementRes.isSuccess())
                .body(entitlementRes.isSuccess()
                        ? entitlementRes.isSentEmail()
                            ? String.format("נשלח בהצלחה לכתובת: %s", entitlementRes.getUserMail())
                            : String.format("מייל לכתובת: %s לא נשלח", entitlementRes.getUserMail())
                        : entitlementRes.getMessage()
                )
                .name(entitlementRes.getMessage());

        return res.build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @Path("sendEntitlement")
    public ApiResponse<EntitlementInfo> sendEntitlement(EntitlementInfo user) {
        ApiResponse.ApiResponseBuilder<EntitlementInfo> res = ApiResponse.builder();
        EntitlementInfo entitlementRes;
        try {
            entitlementRes = purchase.sendEntitlement(user);
        } catch (Exception e) {
            return res
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }

        res
                .success(entitlementRes.isSuccess())
                .body(entitlementRes.isSuccess()
                        ? "מייל נשלח בהצלחה"
                        : entitlementRes.getMsg()
                )
                .name(entitlementRes.getMsg());

        return res.build();
    }

    private boolean isInteger(String s) {
        Scanner sc = new Scanner(s.trim());
        if (!sc.hasNextInt(10)) {
            return false;
        }
        sc.nextInt(10);
        return !sc.hasNext();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @GET
    @Path("getAnimal")
    public ApiResponse<String> getAnimal() {
        ApiResponse.ApiResponseBuilder<String> res = ApiResponse.builder();
        String entitlementRes;
        try {
            entitlementRes = animal.getAnimal();
        } catch (Exception e) {
            return res
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }

        res
                .success(true)
                .body(entitlementRes)
                .name(entitlementRes);

        return res.build();
    }
}
