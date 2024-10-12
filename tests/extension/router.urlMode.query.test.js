import { root, _, initApp, mockFn, bindEvent, delay, cleanupAfterTest, after, verifyCalls } from "../testUtil";
import router from "src/extension/router";
import template from "src/extension/template";
import dom from "zeta-dom/dom";

const { sameObject, stringMatching, objectContaining } = expect;
const reStateId = /^[0-9a-z]{8}$/;
const initialPath = '/';

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;
var initialAppPath;

function serializeQueryString(params) {
    return '?' + new URLSearchParams(params).toString();
}

beforeAll(async () => {
    history.replaceState('', '', '/?a=1#b=1');
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
    await app.ready.then(() => {
        initialAppPath = app.path;
    });
});

beforeEach(async () => {
    dom.cancelLock(root, true);
    await app.navigate(initialPath);
});

describe('app', () => {
    it('should set correct initialPath', async () => {
        expect(initialAppPath).toBe('/?a=1#b=1');
        expect(app.initialPath).toBe('/?a=1');
    });

    it('should push a new state to history stack on hashchange', async () => {
        const id = history.state;
        const page = app.page;
        const storage = app.historyStorage.current;
        await after(() => location.hash = '#a');

        expect(history.state).not.toBe(id);
        expect(app.path).toBe(initialPath + '#a');
        expect(app.page).toBe(page);
        expect(app.historyStorage.current).toBe(storage);

        // cannot test app.back as history.state and location.back() does not work well in JSDOM
        // await app.back();
        // expect(history.state).toBe(id);
        // expect(location.hash).toBe('');
    });
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
        bindEvent(app, 'navigate', cb);
        await app.navigate('/test-1?a=1');
        expect(location.search).toBe(serializeQueryString({ a: 1, path: '/test-1' }));
        expect(location.hash).toBe('');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1?a=1' }), _);
    });

    it('should handle hash in path', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.navigate('/test-1#a=1');
        expect(location.search).toBe(serializeQueryString({ path: '/test-1' }));
        expect(location.hash).toBe('#a=1');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1#a=1' }), _);
    });

    it('should push a history entry when query string or hash is changed', async () => {
        const { id: id1 } = await app.navigate('/test-1');
        const storage = app.historyStorage.current;

        await expect(app.navigate('/test-1?a=1')).resolves.toEqual({
            id: id1,
            path: '/test-1?a=1',
            navigated: false,
            redirected: false,
            originalPath: null
        });
        const id2 = history.state;
        expect(id2).not.toBe(id1);
        expect(app.historyStorage.current).toBe(storage);

        await expect(app.navigate('/test-1#a=1')).resolves.toEqual({
            id: id1,
            path: '/test-1#a=1',
            navigated: false,
            redirected: false,
            originalPath: null
        });
        expect(history.state).not.toBe(id2);
        expect(app.historyStorage.current).toBe(storage);
    });

    it('should carry data when navigation did not happen', async () => {
        const cb = mockFn();
        const data = {};
        await app.navigate('/test-1', false, data);

        const unbind = app.on('navigate', () => {
            unbind();
            app.navigate('/test-1', true);
        });
        await expect(app.navigate('/test-2')).resolves.toMatchObject({ navigated: false });

        await app.navigate('/test-2');
        cleanupAfterTest(app.on('navigate', cb));
        await app.back();
        expect(cb).toHaveBeenCalledWith(objectContaining({
            type: 'navigate',
            data: sameObject(data)
        }), _);
    });

    it('should retain history storage when navigation did not happen', async () => {
        await app.navigate('/test-1');
        const storage = app.historyStorage.current;

        const unbind = app.on('navigate', () => {
            unbind();
            app.navigate('/test-1', true);
        });
        await expect(app.navigate('/test-2')).resolves.toMatchObject({ navigated: false });
        expect(app.historyStorage.current).toBe(storage);
    });

    it('should not emit pageload event when only query string or hash has changed', async () => {
        const cb = mockFn();
        await app.navigate('/test-1');

        cleanupAfterTest(app.on('pageload', cb));
        await app.navigate('/test-1?a=1');
        expect(cb).not.toBeCalled();
    });
});

describe('app.back', () => {
    it('should update path to previous snapshot', async () => {
        await app.navigate('/test-1');
        await app.navigate('/test-1#a=1');
        expect(app.path).toBe('/test-1#a=1');

        await app.back();
        expect(app.path).toBe('/test-1');
    });

    it('should emit hashchange event when returned to previous snapshot with different hash', async () => {
        await app.navigate('/test-1');
        await app.navigate('/test-1#a=1');
        expect(app.path).toBe('/test-1#a=1');

        const cb = mockFn();
        cleanupAfterTest(app.on('hashchange', cb));
        await app.back();
        verifyCalls(cb, [
            [objectContaining({ type: 'hashchange', oldHash: '#a=1', newHash: '' }), _]
        ]);
    });

    it('should not emit navigate event when returned to previous snapshot of the same page', async () => {
        await app.navigate('/test-1');
        app.snapshot();

        const cb = mockFn();
        cleanupAfterTest(app.on('navigate', cb));
        await app.back();
        expect(cb).not.toBeCalled();
    });

    it('should not emit pageload event when returned to previous snapshot of the same page', async () => {
        await app.navigate('/test-1');
        app.snapshot();

        const cb = mockFn();
        cleanupAfterTest(app.on('pageload', cb));
        await app.back();
        expect(cb).not.toBeCalled();
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

describe('Route.replace', () => {
    it('should preserve query and hash if it does not trigger navigation', async () => {
        await app.navigate('/test-1?foo=bar#baz');
        expect(app.path).toBe('/test-1?foo=bar#baz');

        await app.route.replace({ remainingSegments: 'test-1' });
        expect(app.path).toBe('/test-1?foo=bar#baz');
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
