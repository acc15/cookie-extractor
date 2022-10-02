package ru.vm.cookieextractor.server

import freemarker.core.PlainTextOutputFormat
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(CookieExtractorProperties::class)
class CookieExtractorConfiguration(val cookieExtractorProperties: CookieExtractorProperties) {

    @Bean
    fun freeMarkerConfig() = freemarker.template.Configuration(
        freemarker.template.Configuration.VERSION_2_3_31
    ).apply {
        outputFormat = PlainTextOutputFormat.INSTANCE
    }

    @Bean
    fun fileTemplate() = freemarker.template.Template(
        "fileTemplate",
        cookieExtractorProperties.fileTemplate,
        freeMarkerConfig()
    )

    @Bean
    fun propertyTemplate() = freemarker.template.Template(
        "propertyTemplate",
        cookieExtractorProperties.propertyTemplate,
        freeMarkerConfig()
    )

}