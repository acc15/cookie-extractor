package ru.vm.cookieextractor.server

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.nio.file.Path

@ConstructorBinding
@ConfigurationProperties(prefix = "cookie-extractor")
data class CookieExtractorProperties(
    val dir: Path = Path.of("").toAbsolutePath(),
    val fileTemplate: String = "\${request.clientId}.properties",
    val propertyTemplate: String = "COOKIE_\${cookie.name?upper_case}"
)