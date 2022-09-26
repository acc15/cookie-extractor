package ru.vm.cookieserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CookieServerApplication

fun main(args: Array<String>) {
	runApplication<CookieServerApplication>(*args)
}
