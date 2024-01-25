package ru.vm.cookieextractor.server

import org.springframework.boot.context.properties.ConfigurationProperties
import java.nio.file.Path

@ConfigurationProperties(prefix = "cookie-extractor")
data class CookieExtractorProperties(
    val files: Map<String, Path> = emptyMap()
)