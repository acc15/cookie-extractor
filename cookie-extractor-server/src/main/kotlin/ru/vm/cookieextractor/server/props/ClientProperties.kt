package ru.vm.cookieextractor.server.props

data class ClientProperties(
    val files: Map<String, FileProperties> = emptyMap()
)
