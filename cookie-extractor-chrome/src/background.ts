import { loadConfig } from "./config";
import { CookieRequest } from "./model";
import RSocketClient from "./rsocket-client";

// chrome.cookies.onChanged.addListener(async (ci) => {
//     const opts = await loadOptions();

// });


//chrome.cookies.get({ name: "acc_t", url: "https://test.gosuslugi.ru" }).then(cookie => console.log(`Fetched cookie: ${JSON.stringify(cookie)}`));

const client = new RSocketClient();
async function init() {

    const cfg = await loadConfig();
    if (cfg.cookies.length === 0) {
        console.info("Cookies not defined. Go to Options and choose which Cookies to send");
        return;
    }

    await client.connect(cfg.url);
    console.info(`Connected to ${cfg.url}`);

    const cookies = (await Promise.all(
        cfg.cookies.map(c => new Promise<Array<chrome.cookies.Cookie>>((resolve) => chrome.cookies.getAll(c, resolve)))
    )).flatMap(c => c);

    const request: CookieRequest = { clientId: cfg.clientId, cookies };
    await client.fireAndForget(request, "cookie");
    console.info("Initial cookies sent");
}

init().then(() => console.log("Init success"), (e) => console.error("Init error", e));