package ru.vm.cookieextractor.server.dto

data class CookieRequest(
    val clientId: String,
    val cookies: List<CookieInfo>
)