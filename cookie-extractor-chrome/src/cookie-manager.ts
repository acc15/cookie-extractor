import { Config } from "./config";
import { CookieRequest } from "./model";
import Timer, { TimerId } from "./timer";
import { isSameCookie } from "./util";

async function fetchCookies(cfg: Config): Promise<CookieRequest> {
    const cookieLists = await Promise.all(cfg.cookies.map(c => new Promise<Array<chrome.cookies.Cookie>>((resolve) => chrome.cookies.getAll(c, resolve))));
    for (let i = cookieLists.length - 1; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            cookieLists[j] = cookieLists[j].filter(c1 => !cookieLists[i].some(c2 => isSameCookie(c1, c2)))
        }
    }
    return { clientId: cfg.clientId, cookies: cookieLists.flatMap(c => c) };
}

async function postCookies(cfg: Config, req: CookieRequest): Promise<void> {
    const resp = await fetch(cfg.url, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        method: "POST"
    });
    if (resp.status !== 200) {
        throw new Error(`Non OK status received from ${cfg.url}`);
    }
}

export default class CookieManager {

    private readonly timer = new Timer();

    sendNow(action: string, cfg: Config) {
        this.sendWithFilters(action, cfg, 0);
    }

    debounceSend(action: string, cfg: Config) {
        this.sendWithFilters(action, cfg, cfg.debounceTimeout);
    }

    private sendWithFilters(action: string, cfg: Config, timeout: number) {
        console.info(`${action}. Sending cookies ${timeout <= 0 ? "now" : `after ${timeout} ms`}`);
        this.timer.run(timeout, id => this.send(id, cfg, 0));
    }

    private async send(id: TimerId, cfg: Config, retry: number) {
        
        let request: CookieRequest;
        try {
            request = await fetchCookies(cfg);
        } catch (e: any) {
            console.error("Unable to fetch cookies", e);
            return;
        }
        
        try {
            await postCookies(cfg, request)
            console.info(`Cookies has been successfully send to ${cfg.url}`)
        } catch (e: any) {
            if (e.message === "Failed to fetch") {
                console.info("Unable to send data to server due to connection problems", 
                    `\nRetry: ${retry}`, 
                    "\nError:", e, 
                    "\nData:", request
                );
                this.retry(id, cfg, retry + 1);
            } else {
                // Unknown error (no retry)
                console.error(e);
            }
        }
    }

    private retry(id: TimerId, cfg: Config, retry: number) {
        if (cfg.maxRetries >= 0 && retry > cfg.maxRetries) {
            console.warn(`All retries exceeded (${cfg.maxRetries}). Giving up`);
            return;
        }
        this.timer.runIf(id, cfg.retryTimeout, retryId => this.send(retryId, cfg, retry));
    }

}