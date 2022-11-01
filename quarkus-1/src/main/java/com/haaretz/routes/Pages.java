package com.haaretz.routes;

import javax.annotation.security.PermitAll;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;

@Path("/")
public class Pages extends PageRoute {
    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance entitlement(boolean isAdmin, String currentPage);

        public static native TemplateInstance index(boolean isAdmin, String currentPage);

        public static native TemplateInstance login(boolean displayNavbar);
    }

    @GET
    @Path("")
    @PermitAll
    public TemplateInstance index(@Context SecurityContext sec) {
        return Templates.index(isManager(sec), "home");
    }

    @GET
    @Path("entitlement")
    @PermitAll
    public TemplateInstance entitlement(@Context SecurityContext sec) {
        return Templates.entitlement(isManager(sec), "entitlement");
    }

    @GET
    @Path("login")
    @PermitAll
    public TemplateInstance login() {
        return Templates.login(false);
    }
}
