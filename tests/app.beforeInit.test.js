import brew, { app } from "src/app";
import { delay, mockFn } from "./testUtil";

describe('app.beforeInit', () => {
    it('should delay app ready event until all promises are resolved', async () => {
        var cb = mockFn();
        var resolved;
        brew(app => {
            app.beforeInit(async () => {
                await delay(100);
                app.beforeInit(async () => {
                    await delay(100);
                    resolved = true;
                });
            });
            app.on('ready', () => {
                cb(app.readyState);
            });
        });
        expect(app.readyState).toBe('init');
        await app.ready;
        expect(app.readyState).toBe('ready');
        expect(resolved).toBeTruthy();
        expect(cb).toBeCalledWith('ready');
    });
});
