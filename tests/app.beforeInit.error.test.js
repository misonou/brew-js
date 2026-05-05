import brew, { app } from "src/app";
import { _, mockFn, verifyCalls } from "./testUtil";
import { watchOnce } from "zeta-dom/util";
import dom from "zeta-dom/dom";

describe('init', () => {
    it('should halt and set readyState to error and report error', async () => {
        const error1 = new Error('error1');
        const error2 = new Error('error2');
        const cb = mockFn();
        brew((app) => {
            dom.on('error', cb);
            app.beforeInit(() => {
                throw error1;
            });
            throw error2;
        });
        expect(app.readyState).toBe('init');
        await expect(watchOnce(app, 'readyState')).resolves.toBe('error');
        await expect(app.ready).rejects.toBe(error1);
        verifyCalls(cb, [
            [expect.objectContaining({ error: error1 }), _],
            [expect.objectContaining({ error: error2 }), _],
        ]);
    });
});
