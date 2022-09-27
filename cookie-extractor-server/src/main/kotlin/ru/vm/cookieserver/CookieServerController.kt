package ru.vm.cookieserver

import mu.KotlinLogging
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.vm.cookieserver.model.CookieRequest

private val log = KotlinLogging.logger {  }

@RestController
class CookieServerController {

    @PostMapping("/cookies")
    suspend fun handleCookies(@RequestBody data: CookieRequest) {
        log.debug { "Received data: $data" }
    }

}