

export interface Config {
    clientId: string;
    url: string;
    cookies: Array<chrome.cookies.GetAllDetails>;
    debounceTimeout: number;
    retryTimeout: number;
    maxRetries: number;
}

export async function loadConfig(): Promise<Config> {
    const resp = await fetch("config.json");
    return await resp.json() as Config;
}