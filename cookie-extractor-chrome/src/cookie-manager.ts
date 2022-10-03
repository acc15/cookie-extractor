import { Config } from "./config";

export default class CookieManager {

    private readonly cfg: Config;
    private readonly dataProvider: () => Promise<any>;

    private timeoutId?: ReturnType<typeof setTimeout>;
    private retryNumber: number = 0;

    constructor(dataProvider: () => Promise<any>, cfg: Config) {
        this.dataProvider = dataProvider;
        this.cfg = cfg;
    }

    async sendNow() {
        const data = await this.dataProvider();
        try {
            const resp = await fetch(this.cfg.url, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                method: "POST"
            });
            if (resp.status !== 200) {
                throw new Error(`Non OK status received from ${this.cfg.url}`);
            }
            console.info(`Cookies has been successfully send to ${this.cfg.url}`)
        } catch (e: any) {
            if (e.message === "Failed to fetch") {
                console.info("Unable to send data to server due to connection problems", 
                    `\nRetry: ${this.retryNumber}`, 
                    "\nError:", e, 
                    "\nData:", data
                );
                this.retry();
            } else {
                // Unknown error (no retry)
                console.error(e);
            }
        }
    }

    debounceSend() {
        if (this.timeoutId !== undefined) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
        this.schedule(0, this.cfg.debounceTimeout);
    }

    private retry() {
        if (this.timeoutId !== undefined) {
            // another retry or debounce already scheduled
            return;
        }
        
        const nextRetry = this.retryNumber + 1;
        if (this.cfg.maxRetries >= 0 && nextRetry > this.cfg.maxRetries) {
            console.warn(`All retries exceeded (${this.cfg.maxRetries}). Giving up`);
            return;
        }

        this.schedule(nextRetry, this.cfg.retryTimeout);
    }

    private schedule(retry: number, delay: number) {
        this.timeoutId = setTimeout(async () => {
            this.timeoutId = undefined;
            this.retryNumber = retry;
            await this.sendNow();
        }, delay);
    }

}