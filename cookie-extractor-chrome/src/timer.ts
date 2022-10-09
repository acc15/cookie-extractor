
export type TimerId = ReturnType<typeof setTimeout>;
export type TimerCallback = (id: TimerId) => void;

export default class Timer {

    private timerId?: TimerId;

    private schedule(timeout: number, callback: TimerCallback) {
        const timerId: TimerId = setTimeout(() => callback(timerId), timeout)
        this.timerId = timerId;
        return timerId;
    }

    runIf(id: TimerId, timeout: number, callback: TimerCallback) {
        if (this.timerId !== id) {
            return;
        }
        return this.schedule(timeout, callback);
    }

    run(timeout: number, callback: (id: TimerId) => void) {
        if (this.timerId !== undefined) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }
        return this.schedule(timeout, callback);
    }
}
