import { baseUrl, combinePath, isSubPathOf, normalizePath, removeQueryAndHash, setBaseUrl, toAbsoluteUrl, toRelativeUrl, withBaseUrl } from "src/util/path";

const initialBaseUrl = baseUrl;

describe('baseUrl', () => {
    it('should be initially be "/"', () => {
        expect(initialBaseUrl).toEqual('/');
    });
});

describe('setBaseUrl', () => {
    it('should set baseUrl to given path', () => {
        setBaseUrl('/foo');
        expect(baseUrl).toEqual('/foo');
    });

    it('should normalize given path', () => {
        setBaseUrl('/foo/');
        expect(baseUrl).toEqual('/foo');
        setBaseUrl('./foo/');
        expect(baseUrl).toEqual('/foo');
        setBaseUrl('../foo/');
        expect(baseUrl).toEqual('/foo');
    });
});

describe('combinePath', () => {
    it('should combine two path normalized', () => {
        expect(combinePath('/foo', '/bar')).toEqual('/foo/bar');
        expect(combinePath('/foo/', '/bar/')).toEqual('/foo/bar');
        expect(combinePath('/foo/', '/bar//baz')).toEqual('/foo/bar/baz');
        expect(combinePath('/foo', '/')).toEqual('/foo');
        expect(combinePath('/', '/foo')).toEqual('/foo');
        expect(combinePath('http://test.com/', '/')).toEqual('http://test.com');
        expect(combinePath('http://test.com/', '/foo/')).toEqual('http://test.com/foo');
        expect(combinePath('http://test.com/bar/', '/foo/')).toEqual('http://test.com/bar/foo');
    });

    it('should return second argument normalized if it is an absolute URL', () => {
        expect(combinePath('/foo', 'http://test.com/')).toEqual('http://test.com');
    });
});

describe('normalizePath', () => {
    it('should return a single slash for undefined or null', () => {
        expect(normalizePath()).toEqual('/');
        expect(normalizePath(undefined)).toEqual('/');
        expect(normalizePath(null)).toEqual('/');
    });

    it('should return path starting with a slash if it is not a full URL', () => {
        expect(normalizePath('')).toEqual('/');
        expect(normalizePath('foo/bar')).toEqual('/foo/bar');
        expect(normalizePath('http://test.com/foo/bar')).toEqual('http://test.com/foo/bar');
    });

    it('should remove trailing slash', () => {
        expect(normalizePath('/')).toEqual('/');
        expect(normalizePath('/foo/')).toEqual('/foo');
        expect(normalizePath('http://test.com/')).toEqual('http://test.com');
        expect(normalizePath('http://test.com/foo/bar/')).toEqual('http://test.com/foo/bar');
    });

    it('should remove extra consecutive slashes', () => {
        expect(normalizePath('/foo//bar///baz')).toEqual('/foo/bar/baz');
        expect(normalizePath('http://test.com/foo//bar///baz')).toEqual('http://test.com/foo/bar/baz');
    });

    it('should keep starting slash for path with query or hash', () => {
        expect(normalizePath('/?a=1')).toEqual('/?a=1');
        expect(normalizePath('/#a=1')).toEqual('/#a=1');
    });

    it('should keep query string and hash', () => {
        expect(normalizePath('foo?bar')).toEqual('/foo?bar');
        expect(normalizePath('/foo?bar')).toEqual('/foo?bar');
        expect(normalizePath('/foo/?bar')).toEqual('/foo?bar');
        expect(normalizePath('http://test.com/foo?bar')).toEqual('http://test.com/foo?bar');
        expect(normalizePath('http://test.com/foo/?bar')).toEqual('http://test.com/foo?bar');

        expect(normalizePath('foo#bar')).toEqual('/foo#bar');
        expect(normalizePath('/foo#bar')).toEqual('/foo#bar');
        expect(normalizePath('/foo/#bar')).toEqual('/foo#bar');
        expect(normalizePath('http://test.com/foo#bar')).toEqual('http://test.com/foo#bar');
        expect(normalizePath('http://test.com/foo/#bar')).toEqual('http://test.com/foo#bar');
    });

    it('should keep relative directory if second argument is falsy', () => {
        expect(normalizePath('/./foo/../bar')).toEqual('/./foo/../bar');
    });

    it('should resolve relative directory if second argument is truthy', () => {
        expect(normalizePath('/./foo/../bar', true)).toEqual('/bar');
        expect(normalizePath('/./foo/../../bar', true)).toEqual('/bar');
        expect(normalizePath('./foo/', true)).toEqual('/foo');
        expect(normalizePath('./foo/.', true)).toEqual('/foo');
        expect(normalizePath('./foo/..', true)).toEqual('/');
        expect(normalizePath('./foo/../bar/', true)).toEqual('/bar');
        expect(normalizePath('./foo/../../bar/', true)).toEqual('/bar');
        expect(normalizePath('../../bar', true)).toEqual('/bar');

        expect(normalizePath('http://test.com/./foo/../bar', true)).toEqual('http://test.com/bar');
        expect(normalizePath('http://test.com/./foo/../../bar', true)).toEqual('http://test.com/bar');
        expect(normalizePath('http://test.com/../../bar', true)).toEqual('http://test.com/bar');
    });

    it('should remove default port from HTTP and HTTPS protocol', () => {
        expect(normalizePath('http://test.com:80/foo')).toEqual('http://test.com/foo');
        expect(normalizePath('https://test.com:443/foo')).toEqual('https://test.com/foo');
    });

    it('should throw error when path contains ://', () => {
        expect(normalizePath('/foo/http://test.com')).toEqual('/foo/http:/test.com');
    });

    it('should encode path properly', () => {
        expect(normalizePath('/foo%2f ¥/bar')).toBe('/foo%2F%20%C2%A5/bar');
    });
});

describe('removeQueryAndHash', () => {
    it('should remove query or hash from a path', () => {
        expect(removeQueryAndHash('/path?a=1&b=1')).toBe('/path');
        expect(removeQueryAndHash('/path#a=1&b=1')).toBe('/path');
        expect(removeQueryAndHash('/path?a=1#a=1&b=1')).toBe('/path');
        expect(removeQueryAndHash('/path?a=1#a=1?b=1')).toBe('/path');
    });

    it('should return the same string if there is no query or hash', () => {
        expect(removeQueryAndHash('/path')).toBe('/path');
    });
});

describe('withBaseUrl', () => {
    it('should return the path if base path is "/"', () => {
        setBaseUrl('/');
        expect(withBaseUrl('/bar')).toEqual('/bar');
        expect(withBaseUrl('bar/')).toEqual('/bar');
        expect(withBaseUrl('/foo/bar')).toEqual('/foo/bar');
    });

    it('should prepend base path if given path does not start with base path', () => {
        setBaseUrl('/foo');
        expect(withBaseUrl('/bar')).toEqual('/foo/bar');
        expect(withBaseUrl('bar/')).toEqual('/foo/bar');
        expect(withBaseUrl('/foo/bar')).toEqual('/foo/bar');
    });

    it('should return normalized path', () => {
        setBaseUrl('/foo');
        expect(withBaseUrl('/bar/')).toEqual('/foo/bar');
        expect(withBaseUrl('/foo//bar')).toEqual('/foo/bar');
    });

    it('should not alter but only normalize full URL', () => {
        setBaseUrl('/foo');
        expect(withBaseUrl('http://test.com/bar/')).toEqual('http://test.com/bar');
    });
});

describe('isSubPathOf', () => {
    it('should return normalized sub-path if first path is equal to or is a sub-path of the second path', () => {
        expect(isSubPathOf('/', '/')).toBe('/');
        expect(isSubPathOf('/foo', '/')).toBe('/foo');
        expect(isSubPathOf('/foo', '/foo')).toBe('/');
        expect(isSubPathOf('/foo/', '/foo')).toBe('/');

        expect(isSubPathOf('/', '/bar')).toBeFalsy();
        expect(isSubPathOf('/foo', '/bar')).toBeFalsy();
        expect(isSubPathOf('/foo', '/foo/bar')).toBeFalsy();
    });

    it('should work on full URL', () => {
        expect(isSubPathOf('http://test.com/', 'http://test.com/')).toBe('/');
        expect(isSubPathOf('http://test.com/foo', 'http://test.com/')).toBe('/foo');
        expect(isSubPathOf('http://test.com/foo', 'http://test.com/foo')).toBe('/');
        expect(isSubPathOf('http://test.com/foo/', 'http://test.com/foo')).toBe('/');
    });

    it('should work with query string and hash', () => {
        expect(isSubPathOf('/?a=1', '/')).toBe('/?a=1');
        expect(isSubPathOf('/foo?a=1', '/')).toBe('/foo?a=1');
        expect(isSubPathOf('/foo?a=1', '/foo')).toBe('/?a=1');
        expect(isSubPathOf('/foo/?a=1', '/foo')).toBe('/?a=1');

        expect(isSubPathOf('/#a=1', '/')).toBe('/#a=1');
        expect(isSubPathOf('/foo#a=1', '/')).toBe('/foo#a=1');
        expect(isSubPathOf('/foo#a=1', '/foo')).toBe('/#a=1');
        expect(isSubPathOf('/foo/#a=1', '/foo')).toBe('/#a=1');
    });

    it('expects normalized paths', () => {
        expect(isSubPathOf('/foo', 'foo')).toBeFalsy();
        expect(isSubPathOf('/foo/', 'foo')).toBeFalsy();
        expect(isSubPathOf('foo', '/foo')).toBeFalsy();
        expect(isSubPathOf('foo/', '/foo')).toBeFalsy();
    });
});

describe('toAbsoluteUrl', () => {
    it('should return absolute URL', () => {
        setBaseUrl('/bar');
        expect(toAbsoluteUrl('/')).toBe('http://localhost/bar');
        expect(toAbsoluteUrl('/foo')).toBe('http://localhost/bar/foo');
        expect(toAbsoluteUrl('/foo?a=1')).toBe('http://localhost/bar/foo?a=1');

        setBaseUrl('/');
        expect(toAbsoluteUrl('/')).toBe('http://localhost/');
        expect(toAbsoluteUrl('/foo')).toBe('http://localhost/foo');
        expect(toAbsoluteUrl('/foo?a=1')).toBe('http://localhost/foo?a=1');
    });

    it('should return same absolute URL', () => {
        expect(toAbsoluteUrl('http://test.com/')).toBe('http://test.com/');
        expect(toAbsoluteUrl('http://test.com/bar/')).toBe('http://test.com/bar/');
    });
});

describe('toRelativeUrl', () => {
    it('should return url without origin', () => {
        expect(toRelativeUrl('http://localhost')).toBe('/');
        expect(toRelativeUrl('http://localhost/')).toBe('/');
        expect(toRelativeUrl('http://localhost/foo')).toBe('/foo');
        expect(toRelativeUrl('http://localhost/foo?a=1')).toBe('/foo?a=1');
    });

    it('should return absolute url of different origin', () => {
        expect(toRelativeUrl('http://test.com')).toBe('http://test.com');
        expect(toRelativeUrl('http://test.com/')).toBe('http://test.com/');
        expect(toRelativeUrl('http://test.com/foo')).toBe('http://test.com/foo');
        expect(toRelativeUrl('http://test.com/foo?a=1')).toBe('http://test.com/foo?a=1');
    });
});
