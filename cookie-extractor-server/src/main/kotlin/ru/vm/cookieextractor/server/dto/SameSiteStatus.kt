package ru.vm.cookieextractor.server.dto

import com.fasterxml.jackson.annotation.JsonProperty

enum class SameSiteStatus {
    @JsonProperty("unspecified") UNSPECIFIED,
    @JsonProperty("no_restriction") NO_RESTRICTION,
    @JsonProperty("lax") LAX,
    @JsonProperty("strict") STRICT;
}
