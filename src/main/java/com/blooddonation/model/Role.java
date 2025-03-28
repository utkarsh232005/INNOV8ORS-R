package com.blooddonation.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    DONOR, ADMIN, USER;

    @JsonCreator
    public static Role fromString(String value) {
        return Role.valueOf(value.toUpperCase());
    }
}
	
