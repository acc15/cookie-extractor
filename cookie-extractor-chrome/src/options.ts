
export interface ChromeCookieExtractorOptions {
    id: string;
    url: string;
    cookies: Array<chrome.cookies.GetAllDetails>;
}

export const DEFAULT_OPTIONS: ChromeCookieExtractorOptions = {
    id: "cookie_extractor",
    url: "ws://localhost:9420/",
    cookies: []
}

export async function loadOptions(): Promise<ChromeCookieExtractorOptions> {
    const opts = await chrome.storage.local.get(DEFAULT_OPTIONS);
    return opts as ChromeCookieExtractorOptions;
}

export function storeOptions(opts: ChromeCookieExtractorOptions): Promise<void> {
    return chrome.storage.local.set(opts)
}

export function addOptionsListener(listener: (opts: ChromeCookieExtractorOptions) => void) {
    chrome.storage.local.onChanged.addListener(async () => {
        const opts = await loadOptions();
        listener(opts);
    });
}