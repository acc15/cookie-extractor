package ru.vm.cookieserver

import mu.KotlinLogging
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.stereotype.Controller
import ru.vm.cookieserver.model.CookieRequest

private val log = KotlinLogging.logger {  }

@Controller
class CookieServerController {

    @MessageMapping("cookie")
    suspend fun handleCookie(data: CookieRequest) {
        log.debug { "Received data: $data" }
    }

}