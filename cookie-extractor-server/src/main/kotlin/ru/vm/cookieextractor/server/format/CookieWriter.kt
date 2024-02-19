package ru.vm.cookieextractor.server.format

import ru.vm.cookieextractor.server.dto.CookieInfo
import java.io.OutputStream

interface CookieWriter {
    val format: CookieFormat
    fun write(cookies: List<CookieInfo>, out: OutputStream)
}