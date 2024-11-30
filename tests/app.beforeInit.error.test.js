import brew, { app } from "src/app";
import { _, mockFn, verifyCalls } from "./testUtil";
import { watchOnce } from "zeta-dom/util";
import dom from "zeta-dom/dom";

describe('init', () => {
    it('should halt and set readyState to error and report error', async () => {
        const error = new Error();
        const cb = mockFn();
        brew(() => {
            dom.on('error', cb);
            throw error;
        });
        expect(app.readyState).toBe('init');
        await expect(watchOnce(app, 'readyState')).resolves.toBe('error');
        await expect(app.ready).rejects.toBe(error);
        verifyCalls(cb, [
            [expect.objectContaining({ error }), _]
        ]);
    });
});
