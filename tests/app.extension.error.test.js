import { mockFn } from "@misonou/test-utils";
import { addExtension, app } from "src/app";
import brew from "src/core";
import { watchOnce } from "zeta-dom/util";

describe('brew', () => {
    it('should halt and report error if auto init extension throws error', async () => {
        const cb = mockFn();
        const error = new Error();
        const ext = addExtension(true, 'ext', () => {
            throw error;
        });
        expect(() => brew.with(ext)(cb)).not.toThrow();

        await expect(app.ready).rejects.toBe(error);
        expect(app.readyState).toBe('error');
        expect(cb).not.toHaveBeenCalled();
    });
});
