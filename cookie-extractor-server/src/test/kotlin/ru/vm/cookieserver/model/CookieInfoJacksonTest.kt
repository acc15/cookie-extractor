package ru.vm.cookieserver.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.json.JsonTest
import org.springframework.boot.test.json.JacksonTester

private const val TEST_JSON = """{
    "domain":"domain",
    "name":"name",
    "path":"path",
    "value":"value",
    "hostOnly":true,
    "httpOnly":true,
    "secure":true,
    "session":true,
    "storeId":"storeId",
    "sameSite":"unspecified"
}""";

private val TEST_OBJECT = CookieInfo(
    domain = "domain",
    name = "name",
    path = "path",
    value = "value",
    hostOnly = true,
    httpOnly = true,
    expirationDate = null,
    secure = true,
    session = true,
    storeId = "storeId",
    sameSite = SameSiteStatus.UNSPECIFIED
)

@JsonTest
class CookieInfoJacksonTest {

    @Autowired
    private lateinit var jacksonTester: JacksonTester<CookieInfo>

    @Test
    internal fun serialization() {
        assertThat(jacksonTester.write(TEST_OBJECT)).isEqualToJson(TEST_JSON)
    }

    @Test
    internal fun deserialization() {
        assertThat(jacksonTester.parseObject(TEST_JSON)).isEqualTo(TEST_OBJECT)
    }
}