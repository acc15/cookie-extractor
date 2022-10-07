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
import kotlin.io.path.isDirectory

private val log = KotlinLogging.logger {  }

@RestController
class CookieExtractorController(val cookieExtractorProperties: CookieExtractorProperties) {

    private val locks = Array(10) { Mutex() }

    @PostMapping("/cookies")
    suspend fun handleCookies(@RequestBody data: CookieRequest) =
        withContext(MDCContext(mapOf("traceId" to java.util.UUID.randomUUID().toString()))) {

            val file = cookieExtractorProperties.files[data.clientId]

            val prefix = if (file == null) "Ignoring received" else "Received"
            val msg = "$prefix data from client: ${data.clientId}"
            if (log.isTraceEnabled) {
                log.trace { "$msg. Data: $data" }
            } else {
                log.info { msg }
            }

            if (file == null) {
                return@withContext
            }

            withContext(Dispatchers.IO) {
                locks[Math.floorMod(file.hashCode(), locks.size)].withLock {
                    FileWriter(createParentDirs(file).toFile()).use {
                        log.debug { "Writing cookies to file $file" }
                        for (cookie in data.cookies) {
                            log.trace { "Writing cookie ${cookie.name}..." }
                            it.write(formatShellCookie(cookie) + System.lineSeparator())
                        }
                    }
                    log.debug { "Cookies has been written to $file" }
                }
            }
        }

}