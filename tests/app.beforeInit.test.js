import brew, { app } from "src/app";
import { delay } from "./testUtil";

describe('app.beforeInit', () => {
    it('should delay app ready event until all promises are resolved', async () => {
        var resolved;
        brew(app => {
            app.beforeInit(async () => {
                await delay(100);
                app.beforeInit(async () => {
                    await delay(100);
                    resolved = true;
                });
            });
        });
        expect(app.readyState).toBe('init');
        await app.ready;
        expect(app.readyState).toBe('ready');
        expect(resolved).toBeTruthy();
    });
});
