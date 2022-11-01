package com.haaretz.routes;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

import io.quarkus.runtime.configuration.ProfileManager;

@Produces(MediaType.TEXT_HTML)
public abstract class PageRoute {
    protected boolean isAdmin(SecurityContext sec) {
        return sec.isUserInRole("admin") || ProfileManager.getActiveProfile().matches("dev|local");
    }

    protected boolean isManager(SecurityContext sec) {
        return isAdmin(sec) || sec.isUserInRole("manage");
    }
}
