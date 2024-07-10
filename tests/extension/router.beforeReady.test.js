import router from "src/extension/router";
import { _, initApp, mockFn, verifyCalls } from "../testUtil";

describe('router', () => {
    it('should handle navigate before app ready', async () => {
        let cb = mockFn();
        let app;
        let initialRedirectError;

        await initApp(router, app_ => {
            app = app_;
            app.useRouter({
                initialPath: '/',
                routes: [
                    '/*'
                ]
            });
            app.on('navigate', cb);
            try {
                app.navigate('/test-1', true).catch(() => { });
            } catch (e) {
                initialRedirectError = e;
            }
        });

        expect(initialRedirectError).toBeUndefined();
        verifyCalls(cb, [
            [expect.objectContaining({ pathname: '/test-1', oldPathname: undefined }), _]
        ]);
    });
});
