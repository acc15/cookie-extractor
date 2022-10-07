package ru.vm.cookieextractor.server

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import ru.vm.cookieextractor.server.model.CookieInfo
import ru.vm.cookieextractor.server.model.CookieRequest
import ru.vm.cookieextractor.server.model.SameSiteStatus
import java.lang.RuntimeException
import java.nio.file.Files
import kotlin.random.Random

private val log = KotlinLogging.logger {}

private val LINE_PREFIX_REGEX = Regex("COOKIE_(\\d+)")

@SpringBootTest
@ContextConfiguration
@AutoConfigureWebTestClient(timeout = "PT30S")
class CookieExtractorControllerTest @Autowired constructor(
    val client: WebTestClient,
    val objectMapper: ObjectMapper,
    val cookieExtractorProperties: CookieExtractorProperties
) {

    companion object {
        @JvmStatic
        @DynamicPropertySource
        fun properties(props: DynamicPropertyRegistry) {
            props.add("cookie-extractor.files.main") {
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

    @Test
    internal fun sendMultipleData() {

        val requestCount = 100
        val cookieCount = 1000

        runBlocking(Dispatchers.Default) {
            repeat(requestCount) { requestIndex ->
                launch {
                    client.post().uri("/cookies")
                        .bodyValue(testData.copy(cookies = makeTestCookies(requestIndex, cookieCount)))
                        .exchange()
                }
            }
        }

        val lines = Files.readAllLines(cookieExtractorProperties.files["main"])
        val p = parseRequestPrefix(lines[0])
        val r = Random(p)
        val expectedLines = (0 until cookieCount).map {
            formatShellVariable("COOKIE_${p}-${it}.NAME", randomString(10, r))
        }

        assertThat(lines).containsExactlyElementsOf(expectedLines)

    }

    fun parseRequestPrefix(line: String): Int {
        val m = LINE_PREFIX_REGEX.matchAt(line, 0) ?: throw RuntimeException("Unable to parse line: $line")
        return m.groups[1]!!.value.toInt()
    }

    fun randomString(maxLength: Int, random: Random): String {
        return (0 until random.nextInt(maxLength + 1)).map {
            random.nextInt('a'.code, 'z'.code).toChar()
        }.joinToString("")
    }

    fun makeTestCookies(requestIndex: Int, cookieCount: Int): List<CookieInfo> {
        val random = Random(requestIndex)
        return (0 until cookieCount)
            .map { cookieIndex ->
                val k = "${requestIndex}-${cookieIndex}"
                CookieInfo(
                    domain = "$k.domain.test",
                    name = "$k.name",
                    storeId = "$k.storeId",
                    value = randomString(10, random),
                    session = false,
                    hostOnly = false,
                    expirationDate = null,
                    path = "$k.path",
                    httpOnly = false,
                    secure = false,
                    sameSite = SameSiteStatus.UNSPECIFIED
                )
            }
    }

    private val testData = CookieExtractorControllerTest::class.java.getResourceAsStream("testdata.json")!!.use {
        objectMapper.readValue<CookieRequest>(it)
    }
}