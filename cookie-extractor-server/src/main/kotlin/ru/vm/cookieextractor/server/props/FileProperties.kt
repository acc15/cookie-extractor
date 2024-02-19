package ru.vm.cookieextractor.server.props

import ru.vm.cookieextractor.server.format.CookieFormat
import java.nio.file.Path

data class FileProperties(
    val format: CookieFormat,
    val path: Path
)