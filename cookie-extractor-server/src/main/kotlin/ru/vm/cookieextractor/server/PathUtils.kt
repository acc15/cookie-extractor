package ru.vm.cookieextractor.server

import java.nio.file.Files
import java.nio.file.Path

fun createParentDirs(path: Path) = path.apply { parent?.also { Files.createDirectories(it) } }
