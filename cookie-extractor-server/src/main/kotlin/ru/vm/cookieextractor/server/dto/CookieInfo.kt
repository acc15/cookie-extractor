package ru.vm.cookieextractor.server.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CookieInfo(
    /** The domain of the cookie (e.g. "www.google.com", "example.com"). */
    val domain: String,
    /** The name of the cookie. */
    val name: String,
    /** The ID of the cookie store containing this cookie, as provided in getAllCookieStores(). */
    val storeId: String,
    /** The value of the cookie. */
    val value: String,
    /** True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date. */
    val session: Boolean,
    /** True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie). */
    val hostOnly: Boolean,
    /** Optional. The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.  */
    val expirationDate: Long?,
    /** The path of the cookie. */
    val path: String,
    /** True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts). */
    val httpOnly: Boolean,
    /** True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS). */
    val secure: Boolean,
    /**
     * The cookie's same-site status (i.e. whether the cookie is sent with cross-site requests).
     * @since Chrome 51.
     */
    val sameSite: SameSiteStatus
)
