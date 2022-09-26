import { CookieRequest } from "./model";
import { loadOptions } from "./options";
import RSocketClient from "./rsocket-client";

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
// chrome.cookies.onChanged.addListener(async (ci) => {
//     const opts = await loadOptions();

// });


//chrome.cookies.get({ name: "acc_t", url: "https://test.gosuslugi.ru" }).then(cookie => console.log(`Fetched cookie: ${JSON.stringify(cookie)}`));

const client = new RSocketClient();

async function init() {

    const opts = await loadOptions();
    if (opts.cookies.length === 0) {
        console.info("Cookies not defined. Go to Options and choose which Cookies to send");
        return;
    }

    await client.connect(opts.url);
    console.info(`Connected to ${opts.url}`);

    const cookies = (await Promise.all(
        opts.cookies.map(c => new Promise<Array<chrome.cookies.Cookie>>((resolve) => chrome.cookies.getAll(c, resolve)))
    )).flatMap(c => c);

    const request: CookieRequest = { clientId: opts.id, cookies };
    await client.fireAndForget(request, "cookie");
    console.info("Initial cookies sent");

}

init().then(() => console.log("Init success"), (e) => console.error("Init error", e));
