package ru.vm.cookieextractor.server

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.nio.file.Path

@ConstructorBinding
@ConfigurationProperties(prefix = "cookie-extractor")
data class CookieExtractorProperties(
    val files: Map<String, Path> = emptyMap()
)