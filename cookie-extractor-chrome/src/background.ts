import { loadConfig } from "./config";
import CookieManager from "./cookie-manager";
import { isCookieMatches } from "./util";

async function init() {
    const manager = new CookieManager();
    
    manager.sendNow("Initializing", await loadConfig());

    chrome.action.onClicked.addListener(async () => {
        manager.debounceSend("Action button clicked", await loadConfig());
    });

    chrome.cookies.onChanged.addListener(async ci => {
        const cfg = await loadConfig();
        if (!cfg.cookies.some(c => isCookieMatches(ci.cookie, c))) {
            return;
        }
        manager.debounceSend("Cookie changed", cfg);
    });

    chrome.storage.onChanged.addListener(async () => {
        const cfg = await loadConfig();
        manager.debounceSend("Config changed", cfg);
    });

}

init().catch(e => console.error("Init error", e));