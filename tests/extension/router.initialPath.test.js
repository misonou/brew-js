import router from "src/extension/router";
import { initApp, mockFn } from "../testUtil";
import { waitFor } from "@testing-library/dom";

describe('router', () => {
    it('should keep query and hash if initialPath refers to the same path as if not specified', async () => {
        location.hash = '#foo=bar';

        let cb = mockFn();
        let app;
        initApp(router, app_ => {
            app = app_;
            app.useRouter({
                initialPath: '/',
                routes: [
                    '/*'
                ]
            });
            app.on('navigate', cb);
        });
        expect(location.hash).toBe('#foo=bar');

        // test for hash update during app init
        location.hash = '#foo=baz';

        await waitFor(() => expect(cb).toBeCalled());
        expect(location.hash).toBe('#foo=baz');
        expect(app.path).toBe('/#foo=baz');
        expect(app.initialPath).toBe('/');
    });
});
