import brew, { app } from "src/app";
import { _, mockFn } from "./testUtil";
import { watchOnce } from "zeta-dom/util";

describe('init', () => {
    it('should halt and set readyState to error if initerror event is not handled', async () => {
        const error = new Error();
        const cb = mockFn();
        brew(app => {
            app.on('initerror', cb);
            throw error;
        });
        expect(app.readyState).toBe('init');
        await expect(watchOnce(app, 'readyState')).resolves.toBe('error');
    });
});
