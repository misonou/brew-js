import { addExtension } from "src/app";
import brew from "src/core";
import { mockFn } from "./testUtil";

const cb = mockFn();
const test = addExtension(true, 'test', cb);

describe('with', () => {
    it('should activate extensions and define properties on app', () => {
        brew.with(test, { a: 1 })(app => {
            expect(Object.getOwnPropertyNames(app)).toContain('a');
            expect(cb).toBeCalledTimes(1);
        });
    });
});
