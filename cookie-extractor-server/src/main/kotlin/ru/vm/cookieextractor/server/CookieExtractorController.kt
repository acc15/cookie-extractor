package ru.vm.cookieextractor.server

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.vm.cookieextractor.server.model.CookieRequest
import java.io.FileWriter
import java.nio.channels.FileChannel
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.StandardOpenOption
import java.util.*
import kotlin.io.path.isDirectory

private val log = KotlinLogging.logger {  }

@RestController
class CookieExtractorController(
    val cookieExtractorProperties: CookieExtractorProperties,
    val fileTemplate: freemarker.template.Template,
    val propertyTemplate: freemarker.template.Template,
) {

    @PostMapping("/cookies")
    suspend fun handleCookies(@RequestBody data: CookieRequest) {

        log.debug { "Received data: $data" }

        val templateModel = mapOf("request" to data, "dir" to cookieExtractorProperties.dir)

        val fileName = fileTemplate.process(templateModel)
        val propertiesFile = cookieExtractorProperties.dir.resolve(fileName)

        val properties = Properties()
        for (cookie in data.cookies) {
            val propertyName = propertyTemplate.process(templateModel + mapOf("cookie" to cookie))
            properties[propertyName] = cookie.value
        }

        withContext(Dispatchers.IO) {

            val dir = propertiesFile.parent
            if (!dir.isDirectory()) {
                Files.createDirectories(dir)
            }

            FileWriter(propertiesFile.toFile(), StandardCharsets.UTF_8).use {
                properties.store(it, "Cookies of ${data.clientId} client")
            }
        }

    }

}