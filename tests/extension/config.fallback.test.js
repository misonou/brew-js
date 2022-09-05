import config from "src/extension/config";
import { initApp, mockFn, mockXHROnce } from "../testUtil";

describe('config extension', () => {
    it('should use fallback when failed to load resource', async () => {
        const obj = {
            foo: 'foo',
            bar: {
                baz: 'baz'
            }
        };
        const fallback = mockFn().mockReturnValue(obj);
        const app = await initApp(config, app => {
            mockXHROnce(500, {});
            app.useConfig({
                path: '/js/config.json',
                fallback: fallback
            });
        });
        expect(app.config).toEqual(obj);
        expect(fallback).toBeCalled();
    });
});
