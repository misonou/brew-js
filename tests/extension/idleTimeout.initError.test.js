import idleTimeout from "src/extension/idleTimeout";
import { initApp, mockFn } from "../testUtil";
import { jest } from "@jest/globals";
import dom from "zeta-dom/dom";

beforeAll(async () => {
    // jQuery ready event does not work with fake timer
    // wait for DOM ready before using fake timer
    await dom.ready;
    jest.useFakeTimers();
});

describe('IdleTimeout extension', () => {
    it('should not fire idle event when app did not start properly', async () => {
        const cb = mockFn();
        const appPromise = initApp(idleTimeout, app => {
            app.useIdleTimeout({
                timeout: 10000
            });
            app.on('idle', cb);
            app.beforeInit(async () => {
                jest.advanceTimersByTime(20000);
                throw new Error('init error');
            });
        });
        await expect(appPromise).rejects.toThrow('init error');

        jest.advanceTimersByTime(20000);
        expect(cb).not.toBeCalled();
    });
});
