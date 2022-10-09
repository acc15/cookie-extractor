
export interface Config {
    clientId: string;
    url: string;
    cookies: Array<chrome.cookies.GetAllDetails>;
    debounceTimeout: number;
    retryTimeout: number;
    maxRetries: number;
}

export const DEFAULT_CONFIG: Config =  {
    clientId: "main",
    url: "http://localhost:9420/cookies",
    cookies: [],
    debounceTimeout: 5000,
    retryTimeout: 10000,
    maxRetries: 5
};

export async function loadConfig(): Promise<Config> {
    const cfg = await chrome.storage.local.get(DEFAULT_CONFIG);
    return cfg as Config;
}

export function storeConfig(cfg: Config): Promise<void> {
    return chrome.storage.local.set(cfg)
}