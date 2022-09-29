import { Config, loadConfig } from "./config";
import CookieManager from "./cookie-manager";
import { CookieRequest } from "./model";
import { isCookieMatches, isSameCookie } from "./util";

async function fetchCookies(cfg: Config): Promise<CookieRequest> {
    const cookieLists = await Promise.all(cfg.cookies.map(c => new Promise<Array<chrome.cookies.Cookie>>((resolve) => chrome.cookies.getAll(c, resolve))));
    for (let i = cookieLists.length - 1; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            cookieLists[j] = cookieLists[j].filter(c1 => !cookieLists[i].some(c2 => isSameCookie(c1, c2)))
        }
    }
    return { cookies: cookieLists.flatMap(c => c), clientId: cfg.clientId };
}

async function init() {
    const cfg = await loadConfig();
    if (cfg.cookies.length === 0) {
        console.info("Cookies not defined. Check 'config.json/cookies' and choose which Cookies to send");
        return;
    }

    const manager = new CookieManager(() => fetchCookies(cfg), cfg);
    await manager.sendNow();

    chrome.cookies.onChanged.addListener(ci => {
        if (!cfg.cookies.some(c => isCookieMatches(ci.cookie, c))) {
            return;
        }
        console.debug("Cookie changed", ci);
        manager.debounceSend();
    });
}

init().then(() => console.log("Init success"), (e) => console.error("Init error", e));