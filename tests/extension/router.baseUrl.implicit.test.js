import { mockFn, root, bindEvent, _, delay, initBody, after, verifyCalls, defunctAfterTest, body, initApp, mount, cleanupAfterTest, nativeHistoryBack } from "../testUtil";
import { matchRoute } from "src/extension/router";
import router from "src/extension/htmlRouter";
import template from "src/extension/template";
import { getVar, resetVar, setVar } from "src/var";
import { addAnimateIn, addAnimateOut } from "src/anim";
import { mountElement } from "src/dom";
import { catchAsync, resolve } from "zeta-dom/util";
import { bind } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

const { stringMatching, objectContaining, sameObject } = expect;
const reStateId = /^[0-9a-z]{8}$/;
const initialPath = '/';
const div = {};

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var initialProps;
var firstNavigateEvent;
/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;

beforeAll(async () => {
    app = await initApp(router, template, app => {
        app.useHtmlRouter({
            baseUrl: '/base',
            routes: [
                '/foo/{baz:baz}/*',
                '/foo/{id?:[a-z]+}',
                '/{bar:bar}/{id?:[a-z]+}',
                '/{bar:bar}/{optional?:[a-z]+}',
                '/baz/{another?}',
                '/{test:test-.+}/*'
            ]
        });
        initialProps = {
            ...app,
            historyStorage: { ...app.historyStorage }
        };
        const unbind = app.on('navigate', e => {
            firstNavigateEvent = e;
            unbind();
        });
    });
});

beforeAll(async () => {
    Object.assign(div, initBody(`
        <div switch id="root" var="{ parentVar: 0 }">
            <div match-path="/" id="initial"></div>
            <div match-path="/test-1" id="test1"></div>
            <div match-path="/test-2" id="test2"></div>
            <div match-path="/test-mounted" id="mounted"></div>
            <div match-path="/test-title" page-title="Page title"></div>
            <div match-path="/test-title-template" page-title="Page title {{count}}" var="{ count: 1 }" id="titleTemplate"></div>
            <div match-path="/test-anim" id="anim" animate-in animate-out dummy-anim></div>
            <div match-path="/test-nested" id="nested">
                <div switch>
                    <div default match-path="/test-nested/default" id="nestedDefault"></div>
                    <div match-path="/test-nested/other" id="nestedOther"></div>
                </div>
            </div>
            <div match-path="/test-nested-nodefault">
                <div switch>
                    <div match-path="/test-nested-nodefault/default"></div>
                    <div match-path="/test-nested-nodefault/other"></div>
                </div>
            </div>
            <div match-path="/test-prevent-leave">
                <div id="preventLeave" prevent-leave="isPreventLeave" var="{ isPreventLeave: false }"></div>
            </div>
            <div match-path="/test-var" id="var" var="{ myVar: true }" set-var="{ parentVar: [ parentVar + 1 ] }">
                <div var="{ childVar: true }"></div>
                <div switch>
                    <div match-path="/test-var/child-1" var="{ childVar1: true }" id="varChild1"></div>
                    <div match-path="/test-var/child-2" var="{ childVar2: true }" id="varChild2"></div>
                    <div match-path="/test-var/child-3" var="{ childVar3: true }" id="varChild3"></div>
                </div>
            </div>
            <div match-path="/test-form" id="pageleave">
                <form>
                    <input type="text" name="name" />
                </form>
            </div>
            <div match-path="/test-autoplay">
                <video id="video" src="" autoplay></video>
                <audio id="audio" src="" autoplay></audio>
            </div>
            <div match-path="/bar"></div>
            <div match-path="/bar/foo"></div>
            <div match-path="/baz/*"></div>
            <div match-path="/foo/baz/*"></div>
            <div match-path="/foo/{id?}"></div>
        </div>
    `));
    div.video.play = mockFn();
    div.audio.play = mockFn();
    div.video.pause = mockFn();
    div.audio.pause = mockFn();
    await after(() => {
        mountElement(div.root);
    });
});

beforeEach(async () => {
    resetVar(div.preventLeave);
    dom.cancelLock(root, true);
    await app.navigate(initialPath);
});

describe('app', () => {
    it('should set correct basePath', () => {
        expect(app.basePath).toBe('/');
    });

    it('should prepend baseUrl to hyperlinks and resources', async () => {
        const div = await mount(`
            <div>
                <img src="/bar.png" />
                <img data-src="/bar.png" />
                <video src="/bar.mp4"></video>
                <a href="/bar"></a>
                <div data-bg-src="/bar.png"></div>
            </div>
        `);
        expect(div.children[0].src).toEqual('http://localhost/base/bar.png');
        expect(div.children[1].src).toEqual('http://localhost/base/bar.png');
        expect(div.children[2].src).toEqual('http://localhost/base/bar.mp4');
        expect(div.children[3].href).toEqual('http://localhost/base/bar');
        expect(div.children[4].style.backgroundImage).toEqual('url(/base/bar.png)');
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

    it('should navigate to correct path when clicking link', async () => {
        await mount(`
            <a data-testid="link1" href="/foo">Test</a>
        `);
        await after(() => fireEvent.click(screen.getByTestId('link1')));
        expect(app.path).toBe('/foo');
        expect(location.pathname).toBe('/base/foo');
    });
});

describe('app.navigate', () => {
    it('should return a promise that resolves with info about the navigation', async () => {
        await expect(app.navigate('/test-1')).resolves.toEqual({
            id: stringMatching(reStateId),
            path: '/test-1',
            navigated: true,
            redirected: false,
            originalPath: null
        });
        expect(app.path).toEqual('/test-1');
    });

    it('should report redirected flag to true and provide original path', async () => {
        await expect(app.navigate('/test-nested')).resolves.toEqual({
            id: stringMatching(reStateId),
            path: '/test-nested/default',
            navigated: true,
            redirected: true,
            originalPath: '/test-nested'
        });
        expect(app.path).toEqual('/test-nested/default');
    });

    it('should report navigated flag to false when it does not trigger a page load', async () => {
        const { id } = await app.navigate('/test-nested/default');
        expect(app.path).toEqual('/test-nested/default');

        await expect(app.navigate('/test-nested/default')).resolves.toEqual({
            id: id,
            path: '/test-nested/default',
            navigated: false,
            redirected: false,
            originalPath: null
        });
        expect(app.path).toEqual('/test-nested/default');

        await expect(app.navigate('/test-nested')).resolves.toEqual({
            id: id,
            path: '/test-nested/default',
            navigated: false,
            redirected: true,
            originalPath: '/test-nested'
        });
        expect(app.path).toEqual('/test-nested/default');
    });

    it('should resolve to same result when navigating to the same path immediately', async () => {
        const promise1 = app.navigate('/test-1');
        const promise2 = app.navigate('/test-1');
        const result1 = await promise1;
        const result2 = await promise2;
        expect(result1).toEqual(result2);
    });

    it('should cancel consecutive navigations previously made', async () => {
        const promise1 = app.navigate('/test-1');
        const promise2 = app.navigate('/test-2');

        await expect(promise1).rejects.toBeErrorWithCode('brew/navigation-cancelled');
        await expect(promise2).resolves.toEqual(objectContaining({ path: '/test-2' }));
        expect(app.path).toEqual('/test-2');
    });

    it('should cancel previous navigation before page load', async () => {
        let resolve;
        const promise1 = app.navigate('/test-1');
        const promise2 = new Promise((resolve_) => {
            resolve = resolve_;
        });
        app.beforePageEnter(defunctAfterTest(() => {
            resolve(app.navigate('/test-2'));
        }));
        await expect(promise1).rejects.toBeErrorWithCode('brew/navigation-cancelled');
        await expect(promise2).resolves.toEqual(objectContaining({ path: '/test-2' }));
        expect(app.path).toEqual('/test-2');
    });

    it('should remove cancelled navigation from history', async () => {
        catchAsync(app.navigate('/test-1'));

        await app.navigate('/test-2');
        expect(app.path).toEqual('/test-2');
        expect(app.previousPath).toBe(initialPath);

        await app.back();
        expect(app.path).toBe(initialPath);
    });

    it('should report redirected flag for previous navigation when redirecting before page load', async () => {
        let resolve;
        const promise1 = app.navigate('/test-1');
        const promise2 = new Promise((resolve_) => {
            resolve = resolve_;
        });
        app.beforePageEnter(defunctAfterTest(() => {
            resolve(app.navigate('/test-2', true));
        }));
        await expect(promise1).resolves.toEqual(objectContaining({ path: '/test-2', redirected: true }));
        await expect(promise2).resolves.toEqual(objectContaining({ path: '/test-2' }));
        expect(app.path).toEqual('/test-2');
    });

    it('should emit navigate event before triggering a page load', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.navigate('/test-1');

        expect(cb).nthCalledWith(1, objectContaining({
            type: 'navigate',
            pathname: '/test-1',
            navigationType: 'navigate',
        }), _);
    });

    it('should delay page load by async action in navigate event', async () => {
        var resolved;
        bindEvent(app, 'navigate', async () => {
            await delay(100);
            resolved = true;
        });
        await app.navigate('/test-1');
        expect(resolved).toBeTruthy();
    });

    it('should continue page load if error is thrown in navigate event', async () => {
        const cb = mockFn(() => {
            throw new Error();
        });
        bindEvent(app, 'navigate', cb);
        await expect(app.navigate('/test-1')).resolves.toEqual(objectContaining({
            navigated: true
        }));
        expect(cb).toBeCalledTimes(1);
    });

    it('should cancel current navigation when navigating to other path in navigate event', async () => {
        let promise;
        const cb = mockFn(e => {
            if (e.pathname === '/test-1') {
                promise = app.navigate('/test-2');
            }
        });
        bindEvent(app, 'navigate', cb);
        await expect(app.navigate('/test-1')).rejects.toBeErrorWithCode('brew/navigation-cancelled');

        expect(cb).toBeCalledTimes(2);
        await promise;
        expect(app.path).toEqual('/test-2');
    });

    it('should prevent infinite redirection loop in navigate event', async () => {
        var i = 0;
        bindEvent(app, 'navigate', e => {
            if (++i > 10) {
                return;
            }
            if (e.pathname === '/test-1') {
                app.navigate('/test-2', true);
            } else {
                app.navigate('/test-1', true);
            }
        });
        await expect(app.navigate('/test-1')).resolves.toEqual(objectContaining({ path: '/test-1' }));
        expect(i).toEqual(2);
    });

    it('should cancel navigation when dom is locked', async () => {
        dom.lock(root, delay(100));

        await expect(app.navigate('/test-1')).rejects.toBeErrorWithCode('brew/navigation-rejected');
        expect(app.path).toEqual(initialPath);

        while (dom.locked(root)) {
            await delay();
        }
        await expect(app.navigate('/test-1')).resolves.toBeTruthy();
        expect(app.path).toEqual('/test-1');
    });

    it('should request lock cancellation and resume navigation when allowed', async () => {
        const cb = mockFn(() => true);
        const promise = dom.lock(root, delay(100), cb);

        await expect(app.navigate('/test-1')).resolves.toBeTruthy();
        await expect(promise).rejects.toBeErrorWithCode('zeta/cancelled');
        expect(cb).toBeCalledTimes(1);
    });

    it('should cancel navigation when user prevented leaving', async () => {
        await app.navigate('/test-prevent-leave');
        await after(() => setVar(div.preventLeave, 'isPreventLeave', true));

        const cb = mockFn(() => false);
        bindEvent(div.preventLeave, 'preventLeave', () => {
            return delay(100).then(cb);
        });
        await expect(app.navigate('/')).rejects.toBeErrorWithCode('brew/navigation-rejected');
        expect(cb).toBeCalledTimes(1);
    });

    it('should resume navigation when user allowed leaving', async () => {
        await app.navigate('/test-prevent-leave');
        await after(() => setVar(div.preventLeave, 'isPreventLeave', true));

        const cb = mockFn(() => true);
        bindEvent(div.preventLeave, 'preventLeave', () => {
            return delay(100).then(cb);
        });
        await expect(app.navigate('/')).resolves.toEqual(_);
        expect(cb).toBeCalledTimes(1);
    });

    it('should redirect to path of first match-path children', async () => {
        await app.navigate('/test-nested-nodefault');
        expect(app.path).toEqual('/test-nested-nodefault/default');
    });

    it('should update location pathname correctly', async () => {
        expect(location.pathname).toBe('/base');
        await app.navigate('/test-1');
        expect(location.pathname).toBe('/base/test-1');
    });

    it('should handle query string in path', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.navigate('/test-1?a=1');
        expect(location.search).toBe('?a=1');
        expect(location.hash).toBe('');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1?a=1' }), _);
    });

    it('should handle hash in path', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.navigate('/test-1#a=1');
        expect(location.search).toBe('');
        expect(location.hash).toBe('#a=1');
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1#a=1' }), _);
    });

    it('should not trigger navigation if pathname is the same', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.navigate('/?a=1');
        await app.navigate('/#a=1');
        expect(cb).not.toBeCalled();
    });

    it('should report latest query string or hash in event data and navigation result', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);

        const p1 = app.navigate('/test-1?a=1');
        const p2 = app.navigate('/test-1?a=2');
        const r1 = await p1;
        const r2 = await p2;
        expect(cb).toBeCalledTimes(1);
        expect(cb).nthCalledWith(1, objectContaining({ type: 'navigate', pathname: '/test-1?a=2', oldPathname: initialPath }), _);
        expect(r1).toEqual(r2);
        expect(r1.path).toBe('/test-1?a=2');
        expect(r1.redirected).toBe(false);
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

    it('should push a history entry after navigating back previously', async () => {
        await app.navigate('/test-1');
        await app.navigate('/test-2');
        await nativeHistoryBack();
        expect(app.path).toBe('/test-1');

        await app.navigate('/test-2');
        await nativeHistoryBack();
        expect(app.path).toBe('/test-1');
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
    it('should reload previous page while keeping history', async () => {
        await app.navigate('/test-1');
        await app.navigate('/test-2');
        await app.back();
        expect(app.path).toEqual('/test-1');

        await delay(100);
        history.forward();
        await delay(100);
        expect(app.path).toEqual('/test-2');
    });

    it('should reject immediately previous navigation', async () => {
        const promise1 = app.navigate('/test-1');
        const promise2 = app.navigate('/test-2');
        await app.back();

        await expect(promise1).rejects.toBeErrorWithCode('brew/navigation-cancelled');
        await expect(promise2).rejects.toBeErrorWithCode('brew/navigation-cancelled');
    });

    it('should return false if there is no previous page', async () => {
        var promise;
        while (app.canNavigateBack) {
            promise = catchAsync(app.back());
        }
        expect(app.back()).toBeFalsy();
        await promise;
    });

    it('should navigate to supplied default path if there is no previous page', async () => {
        while (app.canNavigateBack) {
            catchAsync(app.back());
        }
        // jsdom does not behave correctly when calling history.back() multiple times consecutively
        var promise = app.back('/test-1');
        expect(promise).toBeInstanceOf(Promise);
        catchAsync(promise);
    });

    it('should emit navigate event with navigationType being back_forward', async () => {
        await app.navigate('/test-1');

        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.back();
        expect(cb).nthCalledWith(1, objectContaining({
            type: 'navigate',
            pathname: '/',
            navigationType: 'back_forward',
        }), _);
    });

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

describe('app.backToPreviousPath', () => {
    it('should skip snaphots of current path', async () => {
        const stateId = history.state;
        const currentPath = app.path;
        await app.navigate('/test-1');

        expect(app.snapshot()).toBe(true);
        await expect(app.backToPreviousPath()).resolves.toEqual({
            id: stateId,
            path: currentPath,
            navigated: true,
            redirected: false,
            originalPath: null
        });
        expect(app.path).toBe(currentPath);
        await waitFor(() => expect(history.state).toBe(stateId));
    });

    it('should return false if there is no previous page', async () => {
        var promise;
        while (app.canNavigateBack) {
            promise = catchAsync(app.back());
        }
        await promise;
        expect(app.backToPreviousPath()).toBeFalsy();
        expect(app.snapshot()).toBe(true);
        expect(app.backToPreviousPath()).toBeFalsy();
    });
});

describe('app.snapshot', () => {
    it('should push a new state to history stack', async () => {
        const stateId = history.state;
        const currentPath = app.path;
        expect(app.snapshot()).toBe(true);
        expect(app.path).toBe(currentPath);
        expect(history.state).not.toBe(stateId);
    });

    it('should keep previousPath untouched', async () => {
        const currentPath = app.path;
        await app.navigate('/test-1');
        expect(app.previousPath).toBe(currentPath);
        expect(app.snapshot()).toBe(true);
        expect(app.previousPath).toBe(currentPath);
    });

    it('should have no effect when navigating', async () => {
        var resolve;
        var promise = new Promise(resolve_ => resolve = resolve_);
        bindEvent(app, 'navigate', () => promise);

        const result = app.navigate('/test-1');
        const stateId = history.state;
        expect(app.snapshot()).toBe(false);
        expect(history.state).toBe(stateId);

        resolve();
        await expect(result).resolves.toEqual({
            id: stateId,
            path: '/test-1',
            navigated: true,
            redirected: false,
            originalPath: null
        });
    });

    it('should carry data from previous state', async () => {
        const data = {};
        await app.navigate('/test-1', false, data);
        app.snapshot();

        const stateId = history.state;
        await app.navigate('/test-2');

        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        await app.back();
        expect(cb).toBeCalledWith(objectContaining({
            pathname: '/test-1',
            newStateId: stateId,
            data: sameObject(data)
        }), _);
    });

    it('should produce frame navigable even when dom is locked', async () => {
        const data = {};
        await app.navigate('/test-1', false, data);
        app.snapshot();

        catchAsync(dom.lock(root, new Promise(() => { })));
        await expect(app.back()).resolves.toBeTruthy();
    });
});

describe('app.path', () => {
    it('should be initially the initial path', () => {
        expect(initialProps.path).toBe(initialPath);
    });

    it('should trigger navigation when being set with new value', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);
        app.path = '/test-1';
        await delay(100);

        expect(cb).toBeCalledWith(objectContaining({ type: 'navigate', pathname: '/test-1' }), _);
        expect(app.path).toEqual('/test-1');
    });
});

describe('app.canNavigateBack', () => {
    it('should be initially false', () => {
        expect(initialProps.canNavigateBack).toBeFalsy();
    });
});

describe('app.canNavigateForward', () => {
    it('should be initially false', () => {
        expect(initialProps.canNavigateForward).toBeFalsy();
    });

    it('should return true after navigating back', async () => {
        expect(app.canNavigateForward).toBe(false);
        await app.navigate('/test-1');
        await app.back();
        expect(app.canNavigateForward).toBe(true);
    });
});

describe('app.previousPath', () => {
    it('should be initially null', () => {
        expect(initialProps.previousPath).toBeNull();
    });

    it('should return path of previous page load in history stack', async () => {
        await app.navigate('/test-1');
        expect(app.previousPath).toEqual('/');
        await app.navigate('/test-2');
        expect(app.previousPath).toEqual('/test-1');
        await app.back();
        expect(app.previousPath).toEqual('/');
    });
});

describe('app.resolvePath', () => {
    it('should resolve relative path', async () => {
        await app.navigate('/foo/bar');
        expect(app.resolvePath('baz')).toEqual('/foo/bar/baz');

        await app.navigate('/foo/bar?foo=bar#baz');
        expect(app.resolvePath('baz')).toEqual('/foo/bar/baz');
    });

    it('should resolve ~/ path relative to min path of current route', async () => {
        await app.navigate('/foo/bar');
        expect(app.resolvePath('~/')).toEqual('/foo');
        expect(app.resolvePath('~/bar')).toEqual('/foo/bar');

        await app.navigate(initialPath);
        expect(app.resolvePath('~/', '/foo/bar')).toEqual('/foo');
        expect(app.resolvePath('~/bar', '/foo/bar')).toEqual('/foo/bar');
    });

    it('should resolve parameters against current route', async () => {
        await app.navigate('/foo/bar');
        expect(app.resolvePath('/foo/{id}')).toEqual('/foo/bar');
        expect(app.resolvePath('/{id}')).toEqual('/bar');
        expect(app.resolvePath('/{foo}')).toEqual('/null');

        await app.navigate(initialPath);
        expect(app.resolvePath('/foo/{id}', '/foo/bar')).toEqual('/foo/bar');
        expect(app.resolvePath('/{id}', '/foo/bar')).toEqual('/bar');
        expect(app.resolvePath('/{foo}', '/foo/bar')).toEqual('/null');
    });

    it('should remove trailing segments if optional parameter is empty', async () => {
        await app.navigate('/foo');
        expect(app.resolvePath('/foo/{id?}')).toEqual('/foo');
        expect(app.resolvePath('/foo/{id?}/baz')).toEqual('/foo/null/baz');

        await app.navigate(initialPath);
        expect(app.resolvePath('/foo/{id?}', '/foo')).toEqual('/foo');
        expect(app.resolvePath('/foo/{id?}/baz', '/foo')).toEqual('/foo/null/baz');
    });

    it('should resolve to current path when given query string or hash only', async () => {
        await app.navigate('/foo?bar=baz#hash');
        expect(app.resolvePath('#foo')).toEqual('/foo?bar=baz#foo');
        expect(app.resolvePath('?foo')).toEqual('/foo?foo');
        expect(app.resolvePath('?foo#foo')).toEqual('/foo?foo#foo');
    });
});

describe('app.isAppPath', () => {
    it('should return true for absolute path starting with base URL', () => {
        expect(app.isAppPath('/base')).toBe(true);
        expect(app.isAppPath('/base/xxx')).toBe(true);
        expect(app.isAppPath('/')).toBe(false);
        expect(app.isAppPath('/xxx')).toBe(false);
    });

    it('should return false for absolute URL', () => {
        expect(app.isAppPath('http://a.com/')).toBe(false);
        expect(app.isAppPath(location.origin)).toBe(false);
    });
});

describe('app.fromHref', () => {
    it('should return child path under baseUrl ', () => {
        expect(app.fromHref('/base')).toBe('/');
        expect(app.fromHref('/base/foo')).toBe('/foo');
        expect(app.fromHref('/base/foo?foo=bar')).toBe('/foo?foo=bar');
        expect(app.fromHref('/base/foo#a=1')).toBe('/foo#a=1');
    });

    it('should return root path if path is not under baseUrl', () => {
        expect(app.fromHref('/')).toBe('/');
        expect(app.fromHref('/foo')).toBe('/');
        expect(app.fromHref('/foo?foo=bar')).toBe('/');
        expect(app.fromHref('/foo#a=1')).toBe('/');
    });
});

describe('app.route', () => {
    it('should have properties named with all possible route parameters', () => {
        expect(app.route).toHaveProperty('id');
        expect(app.route).toHaveProperty('bar');
        expect(app.route).toHaveProperty('another');
        expect(app.route).toHaveProperty('optional');
        expect(app.route).toHaveProperty('remainingSegments');
    });

    it('should reflect parameter values upon navigation', async () => {
        expect(app.route.id).toBeNull();
        await app.navigate('/foo/bar');
        expect(app.route.id).toEqual('bar');
    });

    it('should trigger navigation when parameter changes', async () => {
        await after(() => app.route.baz = 'baz');
        expect(app.path).toEqual('/foo/baz');
        expect(app.route.remainingSegments).toBe('/');

        await after(() => app.route.remainingSegments = '/buzz');
        expect(app.path).toEqual('/foo/baz/buzz');
    });

    it('should normalize route parameter', async () => {
        app.route.another = '';
        expect(app.route.another).toBeNull();
        app.route.another = undefined;
        expect(app.route.another).toBeNull();
        app.route.another = false;
        expect(app.route.another).toBe('false');
        app.route.another = true;
        expect(app.route.another).toBe('true');
        app.route.another = 0;
        expect(app.route.another).toBe('0');

        await app.navigate('/foo/baz');
        app.route.remainingSegments = '';
        expect(app.route.remainingSegments).toBe('/');
        app.route.remainingSegments = undefined;
        expect(app.route.remainingSegments).toBe('/');
        app.route.remainingSegments = false;
        expect(app.route.remainingSegments).toBe('/false');
        app.route.remainingSegments = true;
        expect(app.route.remainingSegments).toBe('/true');
        app.route.remainingSegments = 0;
        expect(app.route.remainingSegments).toBe('/0');
    });

    it('should match route in declaring order', async () => {
        await app.navigate('/foo/baz');
        expect(app.route.id).toBeNull();
    });

    it('should match any sub-path if there is a trailing wildcard', async () => {
        await app.navigate('/foo/baz/sub1/sub2/sub3');
        expect(app.route.id).toBeNull();
        expect(app.route.remainingSegments).toEqual('/sub1/sub2/sub3');
    });

    it('should match min-path if there is optional parameter', async () => {
        app.route.bar = 'bar';
        await delay(100);
        expect(app.path).toEqual('/bar');
        expect(app.route.id).toBeNull();
    });

    it('should match route disregard of inexist parameters', async () => {
        app.route.set({ bar: 'bar', another: 'foo' });
        await delay(100);
        expect(app.path).toEqual('/bar');
        expect(app.route.another).toBeNull();
    });

    it('should match route disregard of inexist parameters only when no other routes matches', async () => {
        app.route.set({ bar: 'bar', optional: 'foo' });
        await delay(100);
        expect(app.path).toEqual('/bar/foo');
        expect(app.route.optional).toBe('foo');
    });

    it('should match path by params correctly', () => {
        expect(app.route.getPath({ id: 'bar' })).toEqual('/foo/bar');
        expect(app.route.getPath({ id: 'bar', remainingSegments: '/' })).toEqual('/foo/bar');
        expect(app.route.getPath({ id: 'bar', remainingSegments: '/baz' })).toEqual('/foo/bar');
        expect(app.route.getPath({ baz: 'baz' })).toEqual('/foo/baz');
        expect(app.route.getPath({ baz: 'baz', remainingSegments: '/' })).toEqual('/foo/baz');
        expect(app.route.getPath({ baz: 'baz', remainingSegments: '/baz' })).toEqual('/foo/baz/baz');
    });

    it('should discard parameter changes if there is no matching route', async () => {
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);

        app.route.id = 'bar123';
        expect(app.route.id).toBeNull();
        await delay(100);
        expect(cb).not.toBeCalled();

        await app.navigate('/foo/bar');
        cb.mockClear();

        app.route.remainingSegments = '/baz';
        expect(app.route.remainingSegments).toEqual('/');
        await delay(100);
        expect(cb).not.toBeCalled();
    });

    it('should ignore query and hash when parsing route params', () => {
        const result = {
            another: null,
            bar: null,
            baz: null,
            id: 'bar',
            optional: null,
            test: null,
            remainingSegments: "/",
        }
        expect(app.route.parse('/foo/bar?a=1&b=1')).toEqual(result);
        expect(app.route.parse('/foo/bar#a=1&b=1')).toEqual(result);
        expect(app.route.parse('/foo/bar#a=1&b=1?c=1')).toEqual(result);
    });

    it('should return object containing all params when path being parsed matches no routes', () => {
        expect(app.route.parse('/unknown')).toEqual({
            another: null,
            bar: null,
            baz: null,
            id: null,
            optional: null,
            test: null,
            remainingSegments: '/',
        });
    });
});

describe('app.isElementActive', () => {
    it('should return true if the element does not have a match-path ancestor', () => {
        expect(app.isElementActive(root)).toBeTruthy();
        expect(app.isElementActive(body)).toBeTruthy();
        expect(app.isElementActive(div.root)).toBeTruthy();
    });

    it('should return true if the element has a direct match-path ancestor that matches current path', async () => {
        await app.navigate('/test-nested');
        expect(app.isElementActive(div.nested.children[0])).toBeTruthy();
    });

    it('should return true if the element has matched descendents', async () => {
        await app.navigate('/test-nested/default');
        expect(app.isElementActive(div.nested)).toBeTruthy();
    });

    it('should return false if the element does not match current path', async () => {
        await app.navigate('/test-1');
        expect(app.isElementActive(div.test2)).toBeFalsy();

        await app.navigate('/test-nested/default');
        expect(app.isElementActive(div.nestedOther)).toBeFalsy();
    });
});

describe('app.beforePageEnter', () => {
    it('should delay page load until all hooks have completed', async () => {
        var resolved;
        app.beforePageEnter(defunctAfterTest(async () => {
            await delay(100);
            resolved = true;
        }));
        await app.navigate('/test-1');
        expect(resolved).toBeTruthy();
    });

    it('should only fire callback of which the registered route matches current path', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        app.beforePageEnter('/test-1', defunctAfterTest(cb1));
        app.beforePageEnter('/test-2', defunctAfterTest(cb2));

        await app.navigate('/test-1');
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();
    });
});

describe('matchRoute', () => {
    it('should match path without optional segments', () => {
        expect(matchRoute('/foo/{id?}', '/foo')).toBeTruthy();
    });

    it('should match segment with regular expression', () => {
        expect(matchRoute('/foo/{id:[a-z]+}', '/foo/bar')).toBeTruthy();
        expect(matchRoute('/foo/{id:[a-z]+}', '/foo/1')).toBeFalsy();
        expect(matchRoute('/foo/{id:[a-z]+}', '/foo/bar1')).toBeFalsy();
    });

    it('should match any sub-paths if there is a trailing wildcard', () => {
        expect(matchRoute('/foo/bar/*', '/foo/bar')).toBeTruthy();
        expect(matchRoute('/foo/bar/*', '/foo/bar/baz')).toBeTruthy();
        expect(matchRoute('/foo/bar/*', '/foo/bar/baz/baz')).toBeTruthy();
    });

    it('should match exact path if there is no wildcard and ignoreExact is falsy', () => {
        expect(matchRoute('/foo/bar', '/foo/bar')).toBeTruthy();
        expect(matchRoute('/foo/bar', '/foo/bar/baz')).toBeFalsy();
        expect(matchRoute('/foo/bar', '/foo/bar/baz', true)).toBeTruthy();
    });
});

describe('processPageChange', () => {
    it('should set own variables to initial values on newly matched match-path element and its active descendents', async () => {
        await app.navigate('/test-var');
        expect(getVar(div.var, 'myVar')).toEqual(true);
        expect(getVar(div.var.children[0], 'childVar')).toEqual(true);
        expect(getVar(div.varChild1, 'childVar1')).toEqual(true);
        expect(getVar(div.varChild2, 'childVar2')).toEqual(root.contains(div.varChild2) ? null : undefined);
    });

    it('should set variables from set-var attribute on newly matched match-path element', async () => {
        const initialValue = getVar(div.root, 'parentVar');
        await app.navigate('/test-var');
        expect(getVar(div.root, 'parentVar')).toEqual(initialValue + 1);
    });

    it('should not set variables from set-var on already matched match-path element', async () => {
        await app.navigate('/test-var/child-1');
        const initialValue = getVar(div.root, 'parentVar');

        await app.navigate('/test-var/child-3');
        expect(getVar(div.root, 'parentVar')).toEqual(initialValue);
    });

    it('should reset own variables to null on previously matched match-path element and its now non-active descendents', async () => {
        await app.navigate('/test-var/child-1');
        expect(getVar(div.var, 'myVar')).not.toBeNull();
        expect(getVar(div.varChild1, 'childVar1')).toEqual(true);
        expect(getVar(div.varChild2, 'childVar2')).toEqual(root.contains(div.varChild2) ? null : undefined);

        await app.navigate('/test-var/child-2');
        expect(getVar(div.var, 'myVar')).not.toBeNull();
        expect(getVar(div.varChild1, 'childVar1')).toBeNull();
        expect(getVar(div.varChild2, 'childVar2')).toEqual(true);

        await app.navigate('/');
        expect(getVar(div.var, 'myVar')).toBeNull();
        expect(getVar(div.var.children[0], 'childVar')).toBeNull();
        expect(getVar(div.varChild1, 'childVar1')).toBeNull();
        expect(getVar(div.varChild2, 'childVar2')).toBeNull();
    });

    it('should remove hidden class from newly matched match-path element before pageenter event', async () => {
        expect(div.test1).toHaveClassName('hidden');
        bindEvent(div.test1, 'pageenter', () => {
            expect(div.test1).not.toHaveClassName('hidden');
        });

        await app.navigate('/test-1');
        expect(div.test1).not.toHaveClassName('hidden');
        expect.assertions(3);
    });

    it('should add hidden class to previously matched match-path element after pageleave event', async () => {
        await app.navigate('/test-1');
        expect(div.test1).not.toHaveClassName('hidden');
        bindEvent(div.test1, 'pageleave', () => {
            expect(div.test1).not.toHaveClassName('hidden');
        });

        await app.navigate(initialPath);
        await delay(100);
        expect(div.test1).toHaveClassName('hidden');
        expect.assertions(3);
    });

    it('should add hidden class to previously matched match-path element after animation has completed', async () => {
        await app.navigate('/test-anim');

        const promise = delay(100);
        const cb = mockFn(() => promise);
        addAnimateOut('dummy-anim', defunctAfterTest(cb));

        await app.navigate(initialPath);
        expect(div.anim).not.toHaveClassName('hidden');

        await promise;
        expect(cb).toBeCalledTimes(1);
        expect(div.anim).toHaveClassName('tweening-out');
        expect(div.anim).not.toHaveClassName('hidden');

        await delay();
        expect(div.anim).toHaveClassName('hidden');
    });

    it('should trigger animation to newly matched match-path element', async () => {
        const cb = mockFn();
        bindEvent('animationstart', cb);
        addAnimateIn('dummy-anim', resolve);

        await app.navigate('/test-anim');
        expect(cb).toBeCalledWith(objectContaining({ type: 'animationstart', animationType: 'in', animationTrigger: 'show', target: div.anim }), _);
    });

    it('should trigger animation to previously matched match-path element', async () => {
        await app.navigate('/test-anim');

        const cb = mockFn();
        bindEvent('animationstart', cb);
        addAnimateOut('dummy-anim', resolve);

        await app.navigate(initialPath);
        expect(cb).toBeCalledWith(objectContaining({ type: 'animationstart', animationType: 'out', animationTrigger: 'show', target: div.anim }), _);
    });

    it('should not trigger event or animation for match-path element that has its state briefly changed', async () => {
        const cb = mockFn();
        bindEvent(div.test1, { pageenter: cb, pageleave: cb });
        bindEvent(div.test2, { pageenter: cb, pageleave: cb });

        await app.navigate('/test-1');
        app.beforePageEnter('/test-2', defunctAfterTest(async () => {
            await delay(100);
            await app.navigate('/test-1');
        }));
        const promise = app.navigate('/test-2');
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(objectContaining({ type: 'pageenter', target: div.test1 }), _);
        await catchAsync(promise);
    });
});

describe('popstate event', () => {
    it('should trigger navigation', async () => {
        await app.navigate('/test-1');
        const stateId = history.state;
        const cb = mockFn();
        bindEvent(app, 'navigate', cb);

        history.back();
        await delay(100);
        expect(cb).toBeCalledTimes(1);
        expect(app.path).toEqual(initialPath);

        history.forward();
        await delay(100);
        expect(cb).toBeCalledTimes(2);
        expect(app.path).toEqual('/test-1');
        expect(history.state).toEqual(stateId);
    });

    it('should handle invalid history state', async () => {
        await app.navigate('/test-1?a=1#b=1');
        history.replaceState('xxxxxxxx', '');
        await app.navigate('/test-2');

        history.back();
        await delay(100);
        expect(app.path).toEqual('/test-1?a=1#b=1');
        expect(history.state).toEqual(stringMatching(reStateId));
    });

    it('should cancel popstate if navigation is rejected', async () => {
        await app.navigate('/test-1');
        const stateId = history.state;
        const cb = mockFn();
        cleanupAfterTest(bind(window, 'popstate', cb));
        dom.preventLeave(root, new Promise(() => { }));

        history.back();
        await delay(100);
        expect(cb).toBeCalledTimes(2);
        expect(app.path).toEqual('/test-1');
        expect(history.state).toEqual(stateId);
    });
});

describe('mounted event', () => {
    it('should be emitted on first-time matched element before pageenter event', async () => {
        const cb = mockFn();
        bindEvent(div.mounted, 'mounted', cb);
        bindEvent(div.mounted, 'pageenter', cb);

        await app.navigate('/test-mounted');
        expect(cb).toBeCalledTimes(2);

        await app.navigate(initialPath);
        await app.navigate('/test-mounted');
        verifyCalls(cb, [
            [objectContaining({ type: 'mounted' }), div.mounted],
            [objectContaining({ type: 'pageenter' }), div.mounted],
            [objectContaining({ type: 'pageenter' }), div.mounted]
        ]);
    });
});

describe('pageenter event', () => {
    it('should be emitted on newly matched element and bubble up', async () => {
        const cb = mockFn();
        bindEvent(div.test1, 'pageenter', cb);
        bindEvent(div.root, 'pageenter', cb);

        await app.navigate('/test-1');
        verifyCalls(cb, [
            [objectContaining({ type: 'pageenter', pathname: '/test-1', target: div.test1 }), div.test1],
            [objectContaining({ type: 'pageenter', pathname: '/test-1', target: div.test1 }), div.root],
        ]);
    });

    it('should play video and audio that is originally attributed as autoplay', async () => {
        expect(div.video.attributes.autoplay).toBeUndefined();
        expect(div.audio.attributes.autoplay).toBeUndefined();

        await app.navigate('/test-autoplay');
        expect(div.video.play).toBeCalledTimes(1);
        expect(div.audio.play).toBeCalledTimes(1);
    });
});

describe('pageleave event', () => {
    it('should be emitted on previously matched element and bubble up', async () => {
        const cb = mockFn();
        bindEvent(div.initial, 'pageleave', cb);
        bindEvent(div.root, 'pageleave', cb);

        await app.navigate('/test-1');
        verifyCalls(cb, [
            [objectContaining({ type: 'pageleave', pathname: '/', target: div.initial }), div.initial],
            [objectContaining({ type: 'pageleave', pathname: '/', target: div.initial }), div.root],
        ]);
    });

    it('should emit reset event on form element', async () => {
        const form = div.pageleave.querySelector('form');
        const cb = mockFn();
        bindEvent(div.pageleave, 'pageleave', cb);
        bindEvent(form, 'reset', cb);

        await app.navigate('/test-form');
        await app.navigate(initialPath);
        verifyCalls(cb, [
            [objectContaining({ type: 'pageleave', target: div.pageleave }), _],
            [objectContaining({ type: 'reset', target: form }), _]
        ]);
    });

    it('should reset form inputs if reset event is not handled', async () => {
        const form = div.pageleave.querySelector('form');
        form.elements.name.value = 'foo';

        await app.navigate('/test-form');
        await app.navigate(initialPath);
        expect(form.elements.name.value).toEqual('');
    });

    it('should not reset form inputs if reset event is handled', async () => {
        const form = div.pageleave.querySelector('form');
        bindEvent(form, 'reset', (e) => {
            form.elements.name.value = 'bar';
            e.handled();
        });
        form.elements.name.value = 'foo';

        await app.navigate('/test-form');
        await app.navigate(initialPath);
        expect(form.elements.name.value).toEqual('bar');
    });

    it('should pause video and audio that is originally attributed as autoplay', async () => {
        expect(div.video.attributes['x-autoplay']).not.toBeUndefined();
        expect(div.audio.attributes['x-autoplay']).not.toBeUndefined();

        await app.navigate('/test-autoplay');
        await app.navigate(initialPath);
        expect(div.video.pause).toBeCalledTimes(1);
        expect(div.audio.pause).toBeCalledTimes(1);
    });
});

describe('page-title directive', () => {
    it('should set document title when matched by match-path', async () => {
        await app.navigate('/test-title');
        expect(document.title).toEqual('Page title');
    });

    it('should be evaulated as template', async () => {
        await app.navigate('/test-title-template');
        expect(document.title).toEqual('Page title 1');
    });

    it('should update document title on statechange', async () => {
        await app.navigate('/test-title-template');
        await after(() => {
            setVar(div.titleTemplate, 'count', 2);
        });
        expect(document.title).toEqual('Page title 2');
    });
});
