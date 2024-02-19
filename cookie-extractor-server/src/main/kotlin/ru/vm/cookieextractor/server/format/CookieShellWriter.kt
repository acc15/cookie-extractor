package ru.vm.cookieextractor.server.format

import org.springframework.stereotype.Component
import ru.vm.cookieextractor.server.dto.CookieInfo
import java.io.OutputStream
import java.io.PrintWriter

@Component
class CookieShellWriter: CookieWriter {
    override val format: CookieFormat = CookieFormat.SHELL
    override fun write(cookies: List<CookieInfo>, out: OutputStream) {
        val w = PrintWriter(out, false, Charsets.UTF_8)
        for (c in cookies) {
            w.println("${c.name}=$'${c.value.replace("'", "\\'")}'")
        }
        w.flush()
    }
}