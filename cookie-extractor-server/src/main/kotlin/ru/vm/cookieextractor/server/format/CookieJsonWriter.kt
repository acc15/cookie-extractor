package ru.vm.cookieextractor.server.format

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Component
import ru.vm.cookieextractor.server.dto.CookieInfo
import java.io.OutputStream

@Component
class CookieJsonWriter(val objectMapper: ObjectMapper): CookieWriter {
    override val format: CookieFormat = CookieFormat.JSON
    override fun write(cookies: List<CookieInfo>, out: OutputStream) {
        objectMapper.writeValue(out, cookies)
    }
}