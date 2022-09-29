
export function isCookieMatches(cookie: chrome.cookies.Cookie, details: chrome.cookies.GetAllDetails): boolean {
    return (details.domain === undefined || (cookie.hostOnly ? details.domain === cookie.domain : cookie.domain.endsWith(details.domain)))
        && (details.name === undefined || details.name === cookie.name)
        && (details.path === undefined || details.path === cookie.path)
        && (details.storeId === undefined || details.storeId === cookie.storeId)
        && (details.secure === undefined || details.secure === cookie.secure)
        && (details.session === undefined || details.session === cookie.session)
        && (details.url === undefined || (cookie.hostOnly ? details.url === (cookie.domain + cookie.path) : details.url.endsWith(cookie.domain + cookie.path)));
}

export function isSameCookie(c1: chrome.cookies.Cookie, c2: chrome.cookies.Cookie): boolean {
    const keys: Array<keyof chrome.cookies.Cookie> = ["domain", "name", "path"];
    for (const k of keys) {
        if (c1[k] !== c2[k]) {
            return false;
        }
    }
    return true;
}