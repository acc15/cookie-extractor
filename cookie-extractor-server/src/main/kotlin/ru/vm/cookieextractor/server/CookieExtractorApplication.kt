package ru.vm.cookieextractor.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CookieExtractorApplication

fun main(args: Array<String>) {
	runApplication<CookieExtractorApplication>(*args)
}
