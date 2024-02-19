package ru.vm.cookieextractor.server

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import ru.vm.cookieextractor.server.format.CookieFormat
import ru.vm.cookieextractor.server.format.CookieJsonWriter
import ru.vm.cookieextractor.server.format.CookieShellWriter
import ru.vm.cookieextractor.server.format.CookieWriter
import ru.vm.cookieextractor.server.props.CookieExtractorProperties

@Configuration
@EnableConfigurationProperties(CookieExtractorProperties::class)
class CookieExtractorConfiguration {

    @Bean
    fun cookieWriters(writers: List<CookieWriter>) = writers.associate { it.format to it }

}