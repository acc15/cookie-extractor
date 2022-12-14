package ru.vm.cookieextractor.server

import ru.vm.cookieextractor.server.model.CookieInfo

fun formatShellVariable(name: String, value: String) =
    "$name=\$'${value.replace("'", "\\'")}'"

fun formatShellCookie(cookie: CookieInfo) = formatShellVariable(cookie.name, cookie.value)
