import config from "src/extension/config";
import { initApp, mockXHROnce } from "../testUtil";

describe('config extension', () => {
    it('should load json object from path', async () => {
        const obj = {
            foo: 'foo',
            bar: {
                baz: 'baz'
            }
        };
        const app = await initApp(config, app => {
            mockXHROnce(200, obj);
            app.useConfig({
                path: '/js/config.json',
                freeze: true
            });
        });
        expect(app.config).toEqual(obj);
        expect(Object.isFrozen(app.config)).toBe(true);
        expect(Object.isFrozen(app.config.bar)).toBe(true);
    });
});
