import brew, { app } from "src/app";
import { delay } from "./testUtil";

describe('init', () => {
    it('should halt and keep readyState as init when app.halt is called', async () => {
        const promise = delay(100);
        brew(app => {
            app.halt();
            app.beforeInit(promise);
        });
        expect(app.readyState).toBe('init');

        await promise;
        await delay(10);
        expect(app.readyState).toBe('init');
    });
});
