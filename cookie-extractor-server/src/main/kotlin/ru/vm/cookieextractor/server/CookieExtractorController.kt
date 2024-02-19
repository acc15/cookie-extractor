package ru.vm.cookieextractor.server

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import org.springframework.core.io.FileSystemResource
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import ru.vm.cookieextractor.server.format.CookieFormat
import ru.vm.cookieextractor.server.format.CookieWriter
import ru.vm.cookieextractor.server.dto.CookieInfo
import ru.vm.cookieextractor.server.dto.CookieRequest
import ru.vm.cookieextractor.server.props.ClientProperties
import ru.vm.cookieextractor.server.props.CookieExtractorProperties
import ru.vm.cookieextractor.server.props.FileProperties
import ru.vm.cookieextractor.server.util.StripedMutex
import java.io.FileOutputStream
import java.nio.file.Files
import java.nio.file.Path

private val log = KotlinLogging.logger {}

@RestController
@RequestMapping("/cookies")
class CookieExtractorController(
    val props: CookieExtractorProperties,
    val writers: Map<CookieFormat, CookieWriter>
) {

    private val striped = StripedMutex()

    @PostMapping
    suspend fun saveCookies(@RequestBody data: CookieRequest) {
        val client = props.client(data.clientId)
        val msg = "Received data from client: ${data.clientId}"
        log.info { if (log.isTraceEnabled) "$msg. Data: $data" else msg }
        for (file in client.files.values) {
            writeCookies(file, data.cookies)
        }
    }

    @GetMapping
    suspend fun loadCookies(@RequestParam clientId: String, @RequestParam file: String): FileSystemResource {
        return FileSystemResource(props.client(clientId).file(file).path).also {
            if (!it.exists()) {
                throw ResponseStatusException(HttpStatus.NOT_FOUND, "file not exists")
            }
        }
    }

    private suspend fun writeCookies(file: FileProperties, cookies: List<CookieInfo>) {
        val writer = writers.getValue(file.format)
        striped.lockFor(file.path).withLock {
            withContext(Dispatchers.IO) {
                FileOutputStream(file.path.createParents().toFile()).use {
                    log.debug { "Writing cookies to file ${file.path}" }
                    writer.write(cookies, it)
                }
                log.debug { "Cookies has been written to ${file.path}" }
            }
        }
    }

    private fun Path.createParents() = this.apply { parent?.also { Files.createDirectories(it) } }

    private fun CookieExtractorProperties.client(clientId: String) = clients[clientId]
        ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "unknown clientId: $clientId")

    private fun ClientProperties.file(file: String): FileProperties = files[file]
        ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "unknown file key: $file")

}