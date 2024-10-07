import $ from "jquery";
import { catchAsync } from "zeta-dom/util";
import { addStyleSheet, api, cookie, copyAttr, deleteCookie, getAttrValues, getCookie, getJSON, getQueryParam, loadScript, openDeferredURL, preloadImages, setAttr, setCookie, setQueryParam } from "src/util/common";
import { setBaseUrl } from "src/util/path";
import { after, mockFn, mockXHROnce, verifyCalls, _ } from "../testUtil";
import { jest } from "@jest/globals";

const { stringMatching, objectContaining } = expect;
const fetchSpy = mockFn();
const windowOpen = jest.spyOn(window, 'open');
const setAttribute = jest.spyOn(HTMLImageElement.prototype, 'setAttribute');

jest.spyOn($, 'ajax');
window.__fetchSpy__ = fetchSpy;

beforeEach(() => {
    setBaseUrl('/');
    $('link, script').remove();
});

describe('getAttrValues', () => {
    it('should return an object containing pairs of attribute names and values', () => {
        const elm = $('<div a="1" b="2"></div>')[0];
        expect(getAttrValues(elm)).toEqual({
            a: '1',
            b: '2'
        });
    });
});

describe('setAttr', () => {
    it('should set multiple attributes', () => {
        const elm = $('<div></div>')[0];
        setAttr(elm, {
            a: '1',
            b: '2'
        });
        expect(elm.getAttribute('a')).toEqual('1');
        expect(elm.getAttribute('b')).toEqual('2');
    });

    it('should overwrite value of existing attribute', () => {
        const elm = $('<div a="1"></div>')[0];
        setAttr(elm, 'a', '2');
        expect(elm.getAttribute('a')).toEqual('2');

        setAttr(elm, { a: '3' });
        expect(elm.getAttribute('a')).toEqual('3');
    });

    it('should not cause mutation when setting the same attribute value', async () => {
        const cb = mockFn();
        const elm = $('<div a="1"></div>')[0];
        new MutationObserver(cb).observe(elm, { attributes: true });

        await after(() => setAttr(elm, 'a', '2'));
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        await after(() => setAttr(elm, 'a', '2'));
        expect(cb).not.toBeCalled();
    });
});

describe('copyAttr', () => {
    it('should not modify or remove existing attribute', () => {
        const src = $('<div a="1"></div>')[0];
        const dst = $('<div b="1"></div>')[0];
        copyAttr(src, dst);
        expect(dst.getAttribute('b')).toEqual('1');
    });

    it('should overwrite existing attribute', () => {
        const src = $('<div a="1"></div>')[0];
        const dst = $('<div a="2"></div>')[0];
        copyAttr(src, dst);
        expect(dst.getAttribute('a')).toEqual('1');
    });

    it('should not cause mutation when no attributes are updated', async () => {
        const cb = mockFn();
        const src = $('<div a="1"></div>')[0];
        const dst = $('<div a="2"></div>')[0];
        new MutationObserver(cb).observe(dst, { attributes: true });

        await after(() => copyAttr(src, dst));
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        await after(() => copyAttr(src, dst));
        expect(cb).not.toBeCalled();
    });
});

describe('getQueryParam', () => {
    it('should return false if query param does not exist', () => {
        expect(getQueryParam('xxx')).toEqual(false);
        expect(getQueryParam('xxx', '?foo=baz')).toEqual(false);
    });

    it('should return empty string as is', () => {
        expect(getQueryParam('foo', '?foo=')).toEqual('');
        expect(getQueryParam('foo', '?foo=&bar=baz')).toEqual('');
    });

    it('should be case-insensitive', () => {
        history.replaceState(null, '', '?foo=bar');
        expect(getQueryParam('FOO')).toEqual('bar');
        expect(getQueryParam('FOO', '?foo=baz')).toEqual('baz');
    });

    it('should handle non-alphanumeric name', () => {
        expect(getQueryParam('foo[bar]', '?foob=1&foo%5Bbar%5D=baz')).toEqual('baz');
        expect(getQueryParam('foo[bar]', '?foob=1&foo[bar]=baz')).toEqual('baz');
    });

    it('should decode URL-encoded characters', () => {
        history.replaceState(null, '', '?foo=%3F%25%3D%20');
        expect(getQueryParam('foo')).toEqual('?%= ');
        expect(getQueryParam('foo', '?foo=baz%3F%25%3D%20')).toEqual('baz?%= ');
    });

    it('should accept empty string as last argument', () => {
        history.replaceState(null, '', '?foo=bar');
        expect(getQueryParam('foo', '')).toEqual(false);
    });

    it('should handle input with hash', () => {
        expect(getQueryParam('foo', '?foo=baz#hash')).toEqual('baz');
        expect(getQueryParam('foo', '#hash?foo=baz')).toEqual(false);
    });
});

describe('setQueryParam', () => {
    it('should add specified param', () => {
        history.replaceState(null, '', '');
        expect(setQueryParam('foo', 'baz')).toBe('?foo=baz');
        history.replaceState(null, '', '?');
        expect(setQueryParam('foo', 'baz')).toBe('?foo=baz');
        history.replaceState(null, '', '?q=1');
        expect(setQueryParam('foo', 'baz')).toBe('?q=1&foo=baz');
    });

    it('should update specified param', () => {
        history.replaceState(null, '', '?foo=bar');
        expect(setQueryParam('foo', 'baz')).toBe('?foo=baz');
        history.replaceState(null, '', '?foo=bar&q=1');
        expect(setQueryParam('foo', 'baz')).toBe('?foo=baz&q=1');
        history.replaceState(null, '', '?q=1&foo=bar');
        expect(setQueryParam('foo', 'baz')).toBe('?q=1&foo=baz');
        history.replaceState(null, '', '?foo=');
        expect(setQueryParam('foo', 'baz')).toBe('?foo=baz');
    });

    it('should be case-insensitive', () => {
        history.replaceState(null, '', '?foo=bar');
        expect(setQueryParam('FOO', 'baz')).toBe('?FOO=baz');
    });

    it('should handle non-alphanumeric name', () => {
        expect(setQueryParam('foo[bar]', 'baz', '?foob=1&foo%5Bbar%5D=')).toEqual('?foob=1&foo%5Bbar%5D=baz');
        expect(setQueryParam('foo[bar]', 'baz', '?foob=1&foo[bar]=')).toEqual('?foob=1&foo%5Bbar%5D=baz');
    });

    it('should encode URL-encoded characters', () => {
        history.replaceState(null, '', '');
        expect(setQueryParam('foo', '?%= ')).toEqual('?foo=%3F%25%3D%20');
    });

    it('should accept empty string as last argument', () => {
        history.replaceState(null, '', '?q=1');
        expect(setQueryParam('foo', 'bar', '')).toEqual('?foo=bar');
    });

    it('should remove specified param when value is false, null, or undefined', () => {
        expect(setQueryParam('foo', '0', '?foo=bar')).toEqual('?foo=0');
        expect(setQueryParam('foo', '', '?foo=bar')).toEqual('?foo=');
        expect(setQueryParam('foo', false, '?foo=bar')).toEqual('');
        expect(setQueryParam('foo', null, '?foo=bar')).toEqual('');

        expect(setQueryParam('foo', null, '?foo=bar&foo=baz')).toEqual('?foo=baz');
        expect(setQueryParam('foo', null, '?foo=bar&baz=baz')).toEqual('?baz=baz');
        expect(setQueryParam('foo', null, '?baz=baz&foo=baz')).toEqual('?baz=baz');
        expect(setQueryParam('foo', null, '?baz=baz')).toEqual('?baz=baz');
        expect(setQueryParam('foo', null, '?')).toEqual('');
        expect(setQueryParam('foo', null, '')).toEqual('');
    });

    it('should handle input with pathname', () => {
        expect(setQueryParam('foo', 'baz', '/path?q=1&foo=bar')).toEqual('/path?q=1&foo=baz');
        expect(setQueryParam('foo', 'baz', '/path?foo=bar')).toEqual('/path?foo=baz');
        expect(setQueryParam('foo', 'baz', '/path?')).toEqual('/path?foo=baz');
        expect(setQueryParam('foo', 'baz', '/path')).toEqual('/path?foo=baz');

        expect(setQueryParam('foo', null, '/path?q=1&foo=bar')).toEqual('/path?q=1');
        expect(setQueryParam('foo', null, '/path?foo=bar')).toEqual('/path');
        expect(setQueryParam('foo', null, '/path?')).toEqual('/path');
        expect(setQueryParam('foo', null, '/path')).toEqual('/path');
    });

    it('should handle input with hash', () => {
        expect(setQueryParam('foo', 'baz', '?foo=bar#hash')).toEqual('?foo=baz#hash');
        expect(setQueryParam('foo', 'baz', '?q=1#hash')).toEqual('?q=1&foo=baz#hash');
        expect(setQueryParam('foo', 'baz', '#hash')).toEqual('?foo=baz#hash');
        expect(setQueryParam('foo', 'baz', '#hash?foo=baz')).toEqual('?foo=baz#hash?foo=baz');

        expect(setQueryParam('foo', null, '?foo=bar#hash')).toEqual('#hash');
        expect(setQueryParam('foo', null, '?q=1#hash')).toEqual('?q=1#hash');
        expect(setQueryParam('foo', null, '#hash')).toEqual('#hash');
        expect(setQueryParam('foo', null, '#hash?foo=baz')).toEqual('#hash?foo=baz');
    });
});

describe('getCookie', () => {
    it('should return false if cookie does not exist', () => {
        expect(getCookie('xxx')).toEqual(false);
    });

    it('should handle non-alphanumeric name', () => {
        document.cookie = 'foo%5Bbar%5D%3D1=1';
        document.cookie = 'foo[bar]=2';
        expect(getCookie('foo[bar]=1')).toBe('1');
        expect(getCookie('foo[bar]')).toBe('2');
    });

    it('should decode URL-encoded characters', () => {
        document.cookie = 'foo=%3F%25%3D%20';
        expect(getCookie('foo')).toEqual('?%= ');
    });
});

describe('setCookie', () => {
    it('should set or update cookie of the given name', () => {
        setCookie('foo', 'bar');
        expect(document.cookie).toEqual(stringMatching(/(^|\s)foo=bar(;|$)/));
    });

    it('should handle non-alphanumeric name', () => {
        setCookie('foo[bar]=1', '1');
        expect(document.cookie).toEqual(stringMatching(/(^|\s)foo%5Bbar%5D%3D1=1(;|$)/));
    });

    it('should encode URL-encoded characters', () => {
        setCookie('foo', '?%= ');
        expect(document.cookie).toEqual(stringMatching(/(^|\s)foo=%3F%25%3D%20(;|$)/));
    });
});

describe('deleteCookie', () => {
    it('should delete cookie of the given name', () => {
        setCookie('foo', 'bar');
        deleteCookie('foo');
        expect(document.cookie).not.toEqual(stringMatching(/(^|\s)foo=bar(;|$)/));
    });

    it('should handle non-alphanumeric name', () => {
        setCookie('foo[bar]=1', '1');
        deleteCookie('foo[bar]=1');
        expect(document.cookie).not.toEqual(stringMatching(/(^|\s)foo%5Bbar%5D%3D1=1(;|$)/));
    });
});

describe('cookie', () => {
    it('should return object with method to get, set or delete cookie', () => {
        const obj = cookie('foo');
        setCookie('foo', 'bar');

        expect(obj.get()).toEqual('bar');
        expect(obj.set('baz')).toEqual('baz');
        expect(obj.get()).toEqual('baz');
        expect(obj.delete()).toBeUndefined();
        expect(obj.get()).toEqual(false);
    });
});

describe('api', () => {
    it('should return an object with corresponding methods', () => {
        const obj1 = api();
        expect(obj1.get).toBeInstanceOf(Function);
        expect(obj1.post).toBeInstanceOf(Function);
        expect(obj1.delete).toBeInstanceOf(Function);

        const obj2 = api({ methods: ['get', 'post'] });
        expect(obj2.get).toBeInstanceOf(Function);
        expect(obj2.post).toBeInstanceOf(Function);
        expect(obj2).not.toHaveProperty('delete');

        const obj3 = api({ methods: 'get' });
        expect(obj3.get).toBeInstanceOf(Function);
        expect(obj3).not.toHaveProperty('post');
        expect(obj3).not.toHaveProperty('delete');
    });

    it('should return a callback when first argument is a supported HTTP method', () => {
        expect(api('get')).toBeInstanceOf(Function);
        expect(api('post')).toBeInstanceOf(Function);
        expect(api('delete')).toBeInstanceOf(Function);
    });

    it('should accept second argument as baseUrl', () => {
        const obj = api('get', '/foo');
        expect(obj.baseUrl).toEqual('/foo');
    });

    it('should call $.ajax with correct parameters', () => {
        const defaultParam = {
            dataType: 'json',
            headers: objectContaining({ 'Content-Type': 'application/json' })
        };
        const obj = api({ baseUrl: '/' });
        catchAsync(obj.get('/foo/bar'));
        catchAsync(obj.post('/foo/bar', { a: 1 }));
        catchAsync(obj.delete('/foo/bar'));
        verifyCalls($.ajax, [
            [objectContaining({ ...defaultParam, method: 'get', url: '/foo/bar' })],
            [objectContaining({ ...defaultParam, method: 'post', url: '/foo/bar', data: '{"a":1}' })],
            [objectContaining({ ...defaultParam, method: 'delete', url: '/foo/bar' })],
        ]);
    });

    it('should prepend url with baseUrl', () => {
        const defaultParam = {
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' }
        };
        const obj = api({ baseUrl: '/foo' });
        catchAsync(obj.get('/bar'));
        catchAsync(obj.post('/bar', { a: 1 }));
        catchAsync(obj.delete('/bar'));
        verifyCalls($.ajax, [
            [objectContaining({ ...defaultParam, method: 'get', url: '/foo/bar' })],
            [objectContaining({ ...defaultParam, method: 'post', url: '/foo/bar', data: '{"a":1}' })],
            [objectContaining({ ...defaultParam, method: 'delete', url: '/foo/bar' })],
        ]);
    });

    it('should delay request until baseUrl is set', async () => {
        const obj = api();
        catchAsync(obj.get('/foo/bar'));
        expect($.ajax).not.toBeCalled();

        await after(() => {
            obj.baseUrl = '/';
        });
        expect($.ajax).toBeCalledTimes(1);
    });

    it('should add Authorization header when token is set', () => {
        const obj = api({ baseUrl: '/', token: 'xxx' });
        catchAsync(obj.get('/foo/bar'));
        verifyCalls($.ajax, [
            [objectContaining({ headers: objectContaining({ Authorization: 'Bearer xxx' }) })]
        ]);
    });

    it('should call getTokenFromResponse set token from response', async () => {
        const cb = mockFn(response => response.token);
        const obj = api({
            baseUrl: '/',
            getTokenFromResponse: cb
        });

        mockXHROnce(200, { token: 'xxx' });
        await obj.get('/');
        expect(cb).toBeCalledWith({ token: 'xxx' }, undefined);
        expect(obj.token).toEqual('xxx');
    });

    it('should reject with reason or message property if present', async () => {
        const api1 = api({ baseUrl: '/' });
        mockXHROnce(500, { error: 'error' });
        await expect(api1.get('/')).rejects.toBeErrorWithCode('brew/api-error', { message: 'error' });

        const api2 = api({ baseUrl: '/' });
        mockXHROnce(500, { message: 'error' });
        await expect(api2.get('/')).rejects.toBeErrorWithCode('brew/api-error', { message: 'error' });
    });
});

describe('getJSON', () => {
    it('should prepend baseUrl to the given url', () => {
        setBaseUrl('/foo');
        catchAsync(getJSON('/bar.json'));
        expect($.ajax).toBeCalledWith(objectContaining({ type: 'get', url: '/foo/bar.json' }));
    });
});

describe('loadScript', () => {
    it('should load the same script only once', async () => {
        await Promise.all([
            loadScript('http://localhost/js/1.js'),
            loadScript('http://localhost/js/1.js')
        ]);
        verifyCalls(fetchSpy, [
            ['fetch', 'http://localhost/js/1.js'],
            ['jsonp', 'http://localhost/js/1.js']
        ]);
    });

    it('should load multiple scripts in sequential order', async () => {
        await loadScript(['http://localhost/js/2.js', 'http://localhost/js/3.js']);
        verifyCalls(fetchSpy, [
            ['fetch', 'http://localhost/js/2.js'],
            ['jsonp', 'http://localhost/js/2.js'],
            ['fetch', 'http://localhost/js/3.js'],
            ['jsonp', 'http://localhost/js/3.js']
        ]);
    });

    it('should set type attribute to module when module option is set to true', () => {
        catchAsync(loadScript('/js/4.js', { module: true }));
        expect($('script')[0].getAttribute('type')).toEqual('module');
    });

    it('should set nomodule attribute when nomodule option is set to true', () => {
        catchAsync(loadScript('/js/5.js', { nomodule: true }));
        expect($('script')[0].getAttribute('nomodule')).toEqual('');
    });

    it('should reject if the script is not loadable', async () => {
        await expect(loadScript('/foo/bar.js')).rejects.toBeErrorWithCode('brew/resource-error');
    });

    it('should prepend baseUrl to the given url', () => {
        setBaseUrl('/js');
        catchAsync(loadScript('/6.js'));
        expect($('script')[0].getAttribute('src')).toEqual('/js/6.js');
    });
});

describe('addStyleSheet', () => {
    it('should set media attribute if second argument is supplied', () => {
        addStyleSheet('/bar.css', 'only screen');
        expect($('link')[0].getAttribute('media')).toEqual('only screen');
    });

    it('should prepend baseUrl to the given url', () => {
        setBaseUrl('/foo');
        addStyleSheet('/bar.css');
        expect($('link')[0].getAttribute('href')).toEqual('/foo/bar.css');
    });
});

describe('preloadImages', () => {
    it('should immediately resolve if array is empty', async () => {
        await expect(preloadImages([])).resolves.toBeUndefined();
    });

    it('should preload image by image element', async () => {
        await preloadImages(['/foo/bar.jpg', '/foo/bar.png']);
        verifyCalls(setAttribute, [
            ['src', '/foo/bar.jpg'],
            ['src', '/foo/bar.png'],
        ]);
    });

    it('should preload all images found in DOM tree', async () => {
        const elm = $(`
            <div class="img">
                <img src="/foo/bar.jpg"/>
                <img src="/foo/bar.png"/>
                <img src="/foo/bar.png"/>
                <style>
                    .img { background-image: url('/foo/baz.jpg') }
                </style>
            </div>
        `).appendTo(document.body)[0];

        await preloadImages(elm);
        expect(setAttribute).toBeCalledTimes(3);
    });
});

describe('openDeferredURL', () => {
    it('should resolve to true when resolved link is navigated', async () => {
        const cb = mockFn();
        windowOpen.mockReturnValueOnce({
            closed: false,
            location: {
                replace: cb
            }
        });
        await expect(openDeferredURL(Promise.resolve('http://localhost/test'))).resolves.toBe(true);
        expect(cb).toBeCalledWith('http://localhost/test');
    });

    it('should resolve to false when window is closed before link is resolved', async () => {
        windowOpen.mockReturnValueOnce({
            closed: true,
            location: {
                replace(url) { }
            }
        });
        await expect(openDeferredURL(Promise.resolve('http://localhost/test'))).resolves.toBe(false);
    });

    it('should resolve to false when new window is blocked', async () => {
        windowOpen.mockReturnValueOnce(null);
        await expect(openDeferredURL(Promise.resolve('http://localhost/test'))).resolves.toBe(false);
    });

    it('should throw and close opened window when given promise rejects', async () => {
        const cb = mockFn();
        windowOpen.mockReturnValueOnce({
            closed: false,
            close: cb,
            location: {
                replace(url) { }
            }
        });
        const error = new Error();
        await expect(openDeferredURL(Promise.reject(error))).rejects.toBe(error);
        expect(cb).toBeCalledTimes(1);
    });
});
