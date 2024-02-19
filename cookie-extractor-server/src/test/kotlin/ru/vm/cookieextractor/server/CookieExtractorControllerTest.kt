package ru.vm.cookieextractor.server

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import mu.KotlinLogging
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import ru.vm.cookieextractor.server.dto.CookieRequest
import java.nio.file.Files

private val log = KotlinLogging.logger {}

@SpringBootTest(properties = [
    "cookie-extractor.clients.main.files.sh.format=shell"
])
@ContextConfiguration
@AutoConfigureWebTestClient(timeout = "PT30S")
class CookieExtractorControllerTest @Autowired constructor(
    val client: WebTestClient,
    val objectMapper: ObjectMapper
) {

    companion object {
        @JvmStatic
        @DynamicPropertySource
        fun properties(props: DynamicPropertyRegistry) {
            props.add("cookie-extractor.clients.main.files.sh.path") {
                Files.createTempDirectory("cookie-extractor-test").resolve("main.sh").toString().also {
                    log.info { "Writing cookies to $it" }
                }
            }
        }
    }

    @Test
    internal fun acceptCookies() {
        client.post().uri("/cookies")
            .bodyValue(testData)
            .exchange()
            .expectStatus()
            .is2xxSuccessful
    }

    private val testData = CookieExtractorControllerTest::class.java.getResourceAsStream("testdata.json")!!.use {
        objectMapper.readValue<CookieRequest>(it)
    }
}