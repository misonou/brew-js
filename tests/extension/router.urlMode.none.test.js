import { root, _, initApp } from "../testUtil";
import router from "src/extension/router";
import template from "src/extension/template";
import dom from "zeta-dom/dom";

const initialPath = '/';

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;

beforeAll(async () => {
    app = await initApp(router, template, app => {
        app.useRouter({
            urlMode: 'none',
            routes: [
                '/foo/{baz:baz}/*',
                '/foo/{id?:[a-z]+}',
                '/{bar:bar}/{id?:[a-z]+}',
                '/{bar:bar}/{optional?:[a-z]+}',
                '/baz/{another?}',
                '/*'
            ]
        });
    });
});

beforeEach(async () => {
    dom.cancelLock(root, true);
    await app.navigate(initialPath);
});

describe('app.navigate', () => {
    it('should not update location pathname', async () => {
        expect(location.pathname).toBe('/');
        await app.navigate('/test-1');
        expect(location.pathname).toBe('/');
    });
});

describe('app.isAppPath', () => {
    it('should return false', () => {
        expect(app.isAppPath('/')).toBe(false);
        expect(app.isAppPath('/xxx')).toBe(false);
        expect(app.isAppPath('?path=/')).toBe(false);
        expect(app.isAppPath('?path=/xxx')).toBe(false);
        expect(app.isAppPath('?foo=bar')).toBe(false);
        expect(app.isAppPath(location.pathname + '?path=/')).toBe(false);
        expect(app.isAppPath(location.pathname + '?path=/xxx')).toBe(false);
        expect(app.isAppPath(location.pathname + '?foo=bar')).toBe(false);
    });

    it('should return false for absolute URL', () => {
        expect(app.isAppPath('http://a.com/')).toBe(false);
        expect(app.isAppPath(location.origin)).toBe(false);
    });
});
