package ru.vm.cookieextractor.server

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.slf4j.MDCContext
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.vm.cookieextractor.server.model.CookieRequest
import java.io.FileWriter
import java.nio.file.Files
import java.nio.file.Path
import java.util.concurrent.ConcurrentHashMap
import kotlin.collections.LinkedHashMap
import kotlin.io.path.isDirectory

private val log = KotlinLogging.logger {  }

fun formatProperty(key: String, value: String) = "${key}=\$'${value.replace("'", "\\'")}'"

@RestController
class CookieExtractorController(
    val cookieExtractorProperties: CookieExtractorProperties,
    val fileTemplate: freemarker.template.Template,
    val propertyTemplate: freemarker.template.Template,
) {

    val locks = ConcurrentHashMap<Path, Mutex>()

    @PostMapping("/cookies")
    suspend fun handleCookies(@RequestBody data: CookieRequest) =
        withContext(MDCContext(mapOf("traceId" to java.util.UUID.randomUUID().toString()))) {

            if (log.isTraceEnabled) {
                log.trace { "Received data: $data" }
            } else {
                log.info { "Received data from client: ${data.clientId}" }
            }

            val templateModel = mapOf("request" to data, "dir" to cookieExtractorProperties.dir)

            val fileName = fileTemplate.process(templateModel)
            val propertiesFile = cookieExtractorProperties.dir.resolve(fileName)

            val map = data.cookies.associateTo(LinkedHashMap()) {
                propertyTemplate.process(templateModel + mapOf("cookie" to it)) to it.value
            }

            withContext(Dispatchers.IO) {

                val dir = propertiesFile.parent
                if (!dir.isDirectory()) {
                    Files.createDirectories(dir)
                }

                locks.computeIfAbsent(propertiesFile) { Mutex() }.withLock {
                    FileWriter(propertiesFile.toFile()).use {
                        log.debug { "Writing cookies to file $propertiesFile" }
                        for (cookie in map) {
                            log.trace { "Writing key ${cookie.key}..." }
                            it.write(formatProperty(cookie.key, cookie.value) + System.lineSeparator())
                        }
                    }
                    log.debug { "Cookies has been written to $propertiesFile" }
                }
            }
        }

}