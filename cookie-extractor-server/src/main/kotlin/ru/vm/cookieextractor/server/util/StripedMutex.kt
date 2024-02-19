package ru.vm.cookieextractor.server.util

import kotlinx.coroutines.sync.Mutex

class StripedMutex(stripes: Int = Runtime.getRuntime().availableProcessors()) {
    private val locks = Array(stripes) { Mutex() }
    fun lockFor(obj: Any) = locks[Math.floorMod(obj.hashCode(), locks.size)]
}