import $ from "jquery";
import { catchAsync } from "zeta-dom/util";
import { addStyleSheet, api, cookie, copyAttr, deleteCookie, getAttrValues, getCookie, getJSON, getQueryParam, loadScript, preloadImages, setAttr, setCookie } from "src/util/common";
import { setBaseUrl } from "src/util/path";
import { after, mockFn, mockXHROnce, verifyCalls, _ } from "../testUtil";
import { jest } from "@jest/globals";

const { stringMatching, objectContaining } = expect;
const fetchSpy = mockFn();

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
});

describe('getQueryParam', () => {
    it('should return false if query param does not exist', () => {
        expect(getQueryParam('xxx')).toEqual(false);
    });

    it('should be case-insensitive', () => {
        history.replaceState(null, '', '?foo=bar');
        expect(getQueryParam('FOO')).toEqual('bar');
    });

    it('should decode URL-encoded characters', () => {
        history.replaceState(null, '', '?foo=%3F%25%3D%20');
        expect(getQueryParam('foo')).toEqual('?%= ');
    });
});

describe('getCookie', () => {
    it('should return false if cookie does not exist', () => {
        expect(getCookie('xxx')).toEqual(false);
    });
});

describe('setCookie', () => {
    it('should set or update cookie of the given name', () => {
        setCookie('foo', 'bar');
        expect(document.cookie).toEqual(stringMatching(/(^|\s)foo=bar(;|$)/));
    })
});

describe('deleteCookie', () => {
    it('should delete cookie of the given name', () => {
        setCookie('foo', 'bar');
        deleteCookie('foo');
        expect(document.cookie).not.toEqual(stringMatching(/(^|\s)foo=bar(;|$)/));
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
        await expect(api1.get('/')).rejects.toEqual('error');

        const api2 = api({ baseUrl: '/' });
        mockXHROnce(500, { message: 'error' });
        await expect(api2.get('/')).rejects.toEqual('error');
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
        await expect(loadScript('/foo/bar.js')).rejects.toBeUndefined();
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

    xit('should load image by image element', async () => {
        await preloadImages(['/foo/bar.jpg', '/foo/bar.png']);
        verifyCalls(fetchSpy, [
            ['fetch', 'http://localhost/foo/bar.jpg'],
            ['fetch', 'http://localhost/foo/bar.png'],
        ]);
    });
});
