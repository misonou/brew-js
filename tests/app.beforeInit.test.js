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
        await app.ready;
        expect(resolved).toBeTruthy();
    });
});
