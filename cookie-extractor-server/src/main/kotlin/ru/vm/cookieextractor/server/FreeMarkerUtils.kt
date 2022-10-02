package ru.vm.cookieextractor.server

import freemarker.template.Template
import java.io.StringWriter

fun Template.process(model: Any?): String = StringWriter().also { process(model, it) }.toString()