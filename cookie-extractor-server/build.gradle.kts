import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import java.nio.file.Path
import java.nio.file.Files

plugins {
	id("io.spring.dependency-management") version "1.1.4"
	id("org.springframework.boot") version "3.2.2"
	kotlin("jvm") version "1.9.22"
	kotlin("plugin.spring") version "1.9.22"
}

group = "ru.vm"
version = "1.0.0"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation(kotlin("reflect"))
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j")
	implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.junit.jupiter:junit-jupiter:5.10.1")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks {

	data class InstallConfig(
		val home: Path,
		val javaHome: Path,
		val jar: Path,
		val service: Path,
		val config: Path
	)

	val cfg = InstallConfig(
		Path.of(System.getProperty("user.home")),
		Path.of(System.getProperty("java.home")),
		Path.of(".local", "lib", project.name, "${project.name}.jar"),
		Path.of(".config", "systemd", "user", "${project.name}.service"),
		Path.of(".config", project.name, "application.yaml")
	)

	fun createParentDirs(path: Path) = path.apply { parent?.also { Files.createDirectories(it) } }
	fun writeTextAndLog(path: Path, what: String, text: String) {
		Files.write(createParentDirs(path), listOf(text))
		logger.lifecycle("$what saved into $path")
	}

	val installService by registering {
		writeTextAndLog(cfg.home.resolve(cfg.service), "systemd service", """
			[Unit]
			Description=${project.name}

			[Service]
			ExecStart="${cfg.javaHome.resolve("bin").resolve("java")}" -jar "${Path.of("%h").resolve(cfg.jar)}" --spring.config.location="file:${Path.of("%h").resolve(cfg.config)}" 
			SuccessExitStatus=143

			[Install]
			WantedBy=default.target
			""".trimIndent()
		)
	}

	val installConfig by registering {
		writeTextAndLog(cfg.home.resolve(cfg.config), "config file",
			"spring.main.banner-mode: off\n" +
			"server.port: 9420\n" +
			"cookie-extractor.files:\n" +
			"    main: cookies.sh\n",
		)
	}

	val installJar by registering {
		dependsOn(assemble.get())
		val srcJar = bootJar.get().archiveFile.get()
		val dstJar = cfg.home.resolve(cfg.jar)
		copy {
			from(srcJar)
			into(dstJar.parent)
			rename { dstJar.fileName.toString() }
		}
		logger.lifecycle("jar file copied to $dstJar")
	}

	val install by registering {
		dependsOn(installJar, installService, installConfig)
	}

}
