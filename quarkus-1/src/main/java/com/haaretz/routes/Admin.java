package com.haaretz.routes;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;

@Path("/admin")
public class Admin extends PageRoute {
    @CheckedTemplate
    public static class Templates {

        public static native TemplateInstance index(boolean isAdmin, boolean canEdit, String currentPage);
    }

    @GET
    @Path("")
    public TemplateInstance admin(@Context SecurityContext sec) {
        return Templates.index(isManager(sec), isAdmin(sec), "admin");
    }
}
