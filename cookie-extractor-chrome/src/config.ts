
export interface Config {
    clientId: string;
    url: string;
    cookies: Array<chrome.cookies.GetAllDetails>;
}

export async function loadConfig(): Promise<Config> {
    const resp = await fetch("config.json");
    return await resp.json() as Config;
}