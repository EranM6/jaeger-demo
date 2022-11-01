package com.haaretz.models.enums;

import java.util.HashMap;
import java.util.Map;

public enum Site {
    HTZ("80", "htz"),
    HDC("85", "hdc"),
    TM("10", "tm");

    final String number;
    final String name;

    Site(String number, String name) {
        this.number = number;
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public String getName() {
        return name;
    }

    private static final Map<String, Site> LOOKUP_NUM = new HashMap<>();
    private static final Map<String, Site> LOOKUP_NAME = new HashMap<>();

    static {
        for (Site s : Site.values()) {
            LOOKUP_NUM.put(s.getNumber(), s);
            LOOKUP_NAME.put(s.getName(), s);
        }
    }

    public static Site getByNumber(String number) {
        return LOOKUP_NUM.get(number);
    }

    public static Site getByName(String name) {
        return LOOKUP_NAME.get(name);
    }
}
