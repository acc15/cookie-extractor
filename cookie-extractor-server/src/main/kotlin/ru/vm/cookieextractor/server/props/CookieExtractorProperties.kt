package ru.vm.cookieextractor.server.props

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "cookie")
data class CookieExtractorProperties(
    val clients: Map<String, ClientProperties>
)
