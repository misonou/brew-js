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

describe('app.fromHref', () => {
    it('should return normalized path', () => {
        expect(app.fromHref('?path=foo')).toBe('/foo');
        expect(app.fromHref('?path=%2Ffoo')).toBe('/foo');
        expect(app.fromHref('?path=%2Ffoo%2F')).toBe('/foo');
    });

    it('should return root path if query parameter is not present', () => {
        expect(app.fromHref('?')).toBe('/');
    });

    it('should preserve other query parameters', () => {
        expect(app.fromHref('?foo=bar')).toBe('/?foo=bar');
        expect(app.fromHref('?path=/foo&foo=bar')).toBe('/foo?foo=bar');
        expect(app.fromHref('?foo=bar&path=/foo')).toBe('/foo?foo=bar');
        expect(app.fromHref('?foo=bar&path=/foo&a=1')).toBe('/foo?foo=bar&a=1');
    });

    it('should preserve hash', () => {
        expect(app.fromHref('?path=/foo#a=1')).toBe('/foo#a=1');
    });
});

describe('popstate event', () => {
    it('should handle invalid history state', async () => {
        await app.navigate('/test-1?a=1#b=1');
        history.replaceState('xxxxxxxx', '');
        await app.navigate('/test-2');

        history.back();
        await delay(100);
        expect(app.path).toEqual('/test-1?a=1#b=1');
        expect(history.state).toEqual(stringMatching(reStateId));
    });
});
