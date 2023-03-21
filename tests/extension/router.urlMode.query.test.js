import { root, _, initApp, mockFn, bindEvent } from "../testUtil";
import router from "src/extension/router";
import template from "src/extension/template";
import dom from "zeta-dom/dom";

const { objectContaining } = expect;
const initialPath = '/';

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;

function serializeQueryString(params) {
    return '?' + new URLSearchParams(params).toString();
}

beforeAll(async () => {
    app = await initApp(router, template, app => {
        app.useRouter({
            urlMode: 'query',
            queryParam: 'path',
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
    it('should update location search correctly', async () => {
        expect(location.search).toBe(serializeQueryString({ path: '/' }));
        await app.navigate('/test-1');
        expect(location.search).toBe(serializeQueryString({ path: '/test-1' }));
    });

    it('should not update location pathname', async () => {
        expect(location.pathname).toBe('/');
        await app.navigate('/test-1');
        expect(location.pathname).toBe('/');
    });

    it('should handle query string in path', async () => {
        const cb = mockFn();
        bindEvent(root, 'navigate', cb);
        await app.navigate('/test-1?a=1');
        expect(location.search).toBe(serializeQueryString({ a: 1, path: '/test-1' }));
        expect(location.hash).toBe('');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1?a=1' }), _);
    });

    it('should handle hash in path', async () => {
        const cb = mockFn();
        bindEvent(root, 'navigate', cb);
        await app.navigate('/test-1#a=1');
        expect(location.search).toBe(serializeQueryString({ path: '/test-1' }));
        expect(location.hash).toBe('#a=1');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1#a=1' }), _);
    });
});

describe('app.isAppPath', () => {
    it('should return true for path consist only of query string', () => {
        expect(app.isAppPath('?path=/')).toBe(true);
        expect(app.isAppPath('?path=/xxx')).toBe(true);
        expect(app.isAppPath('?foo=bar')).toBe(true);
    });

    it('should return true for path with the same pathname', () => {
        expect(app.isAppPath(location.pathname + '?path=/')).toBe(true);
        expect(app.isAppPath(location.pathname + '?path=/xxx')).toBe(true);
        expect(app.isAppPath(location.pathname + '?foo=bar')).toBe(true);
        expect(app.isAppPath('/foo?path=/')).toBe(false);
    });

    it('should return false for absolute URL', () => {
        expect(app.isAppPath('http://a.com/')).toBe(false);
        expect(app.isAppPath(location.origin + '?path=/')).toBe(false);
    });
});
