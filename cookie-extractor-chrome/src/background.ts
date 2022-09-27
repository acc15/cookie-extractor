import { Config, loadConfig } from "./config";
import CookieManager from "./cookie-manager";
import { CookieRequest } from "./model";

async function fetchCookies(cfg: Config): Promise<CookieRequest> {
    const arrayOfCookies = await Promise.all(cfg.cookies.map(c => new Promise<Array<chrome.cookies.Cookie>>((resolve) => chrome.cookies.getAll(c, resolve))));
    return { cookies: arrayOfCookies.flatMap(c => c), clientId: cfg.clientId };
}

async function init() {
    const cfg = await loadConfig();
    if (cfg.cookies.length === 0) {
        console.info("Cookies not defined. Check 'config.json/cookies' and choose which Cookies to send");
        return;
    }

    const manager = new CookieManager(() => fetchCookies(cfg), cfg);
    await manager.sendNow();

    chrome.cookies.onChanged.addListener(async (ci) => {
        console.log("Cookie changed");
        manager.debounceSend();
    });
}

init().then(() => console.log("Init success"), (e) => console.error("Init error", e));