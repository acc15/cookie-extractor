package ru.vm.cookieextractor.server.props

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "cookie-extractor")
data class CookieExtractorProperties(
    val clients: Map<String, ClientProperties> = emptyMap()
)
