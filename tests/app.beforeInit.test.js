import brew from "src/app";
import { delay } from "./testUtil";

describe('app.beforeInit', () => {
    it('should delay app ready event until all promises are resolved', async () => {
        var promise;
        var resolved;
        brew(app => {
            app.beforeInit(async () => {
                await delay(100);
                app.beforeInit(async () => {
                    await delay(100);
                    resolved = true;
                });
            });
            promise = new Promise(resolve => app.on('ready', resolve));
        });
        await promise;
        expect(resolved).toBeTruthy();
    });
});
