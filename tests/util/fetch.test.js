import { createApiClient, peekBody } from "src/util/fetch";
import { jest } from "@jest/globals";
import { mockFn, verifyCalls } from "@misonou/test-utils";
import * as ErrorCode from "src/errorCode";

/** @type {typeof globalThis} */
const { Blob, FormData, DOMException, SyntaxError } = __hostRealm__;
const fetch = jest.spyOn(window, 'fetch');

let requestBody;
fetch.mockImplementation(async (req) => {
    if (req.body !== null) {
        requestBody = await req.text();
    }
    if (req.signal) {
        req.signal.throwIfAborted();
    }
    return Response.json({ foo: 1 });
});

function createRequest(body, contentType) {
    return new Request('http://localhost/api/endpoint', {
        method: 'POST',
        body,
        headers: contentType && { 'content-type': contentType }
    });
}

function createResponse(body, contentType) {
    return new Response(body, {
        status: 200,
        headers: contentType && { 'content-type': contentType }
    });
}

function blobFromBytes(bytes) {
    return new Blob([new Uint8Array(bytes)]);
}

async function bytesFromBlob(blob) {
    return [...new Uint8Array(await blob.arrayBuffer())];
}

describe('ApiClient', () => {
    it('should resolve relative request path with baseURL', async () => {
        const client = createApiClient('http://localhost/api');
        client('/endpoint');

        expect(fetch).toBeCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toBeInstanceOf(Request);
        expect(fetch.mock.calls[0][0].url).toBe('http://localhost/api/endpoint');
    });

    it('should keep absolute request path', async () => {
        const client = createApiClient('http://localhost/api');
        client('http://localhost/endpoint');
        client(new URL('http://localhost/endpoint'));

        expect(fetch).toBeCalledTimes(2);
        expect(fetch.mock.calls[0][0].url).toBe('http://localhost/endpoint');
        expect(fetch.mock.calls[1][0].url).toBe('http://localhost/endpoint');
    });

    it('should create request with init dictionary', async () => {
        const client = createApiClient('http://localhost/api');
        client('/endpoint', {
            headers: {
                'x-header': 'foo'
            }
        });

        expect(fetch).toBeCalledTimes(1);
        expect(fetch.mock.calls[0][0].headers.get('x-header')).toBe('foo');
    });

    it('should create request with method, body and init dictionary', async () => {
        const client = createApiClient('http://localhost/api');
        const promise = client('post', '/endpoint', { foo: 1 }, {
            headers: {
                'x-header': 'foo'
            }
        });

        expect(fetch).toBeCalledTimes(1);
        expect(fetch.mock.calls[0][0].method).toBe('POST');
        expect(fetch.mock.calls[0][0].headers.get('x-header')).toBe('foo');
        await promise;
        expect(requestBody).toBe('{"foo":1}');
    });

    it('should create request with default body for request other than GET and HEAD', async () => {
        const client = createApiClient('http://localhost/api');
        const promise = client('post', '/endpoint');

        expect(fetch).toBeCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toBeInstanceOf(Request);
        await promise;
        expect(requestBody).toBe('{}');
    });

    it('should call middleware in correct order', async () => {
        const cb = mockFn();
        const client = createApiClient('http://localhost/api');

        client.use(async (req, next) => {
            cb('callback 1');
            const result = await next(req);
            cb('callback 1 return');
            return result;
        });
        client.use(async (req, next) => {
            cb('callback 2');
            const result = await next(req);
            cb('callback 2 return');
            return result;
        });

        await client('/endpoint');
        verifyCalls(cb, [
            ['callback 2'],
            ['callback 1'],
            ['callback 1 return'],
            ['callback 2 return'],
        ]);
    });

    it('should call appropriate trap', async () => {
        const traps = {
            request: mockFn((req, next) => next(req)),
            data: mockFn(() => ({ foo: 2 })),
            error: mockFn(() => ({ foo: 2 })),
        };
        const client = createApiClient('http://localhost/api', traps);
        success: {
            await expect(client('/endpoint')).resolves.toEqual({ foo: 2 });
            expect(traps.request).toBeCalledTimes(1);
            verifyCalls(traps.data, [
                [{ foo: 1 }, expect.any(Response), expect.any(Request), client]
            ]);
            expect(traps.error).not.toBeCalled();
            traps.data.mockClear();
        }
        notOK: {
            fetch.mockImplementationOnce(async () => Response.json({ foo: 1 }, { status: 400 }));
            await expect(client('/endpoint')).resolves.toEqual({ foo: 2 });
            verifyCalls(traps.error, [
                [expect.any(Error), expect.any(Response), expect.any(Request), client]
            ]);
            expect(traps.error.mock.calls[0][0]).toBeErrorWithCode(ErrorCode.apiError, {
                data: { foo: 1 },
                error: null,
                status: 400
            });
            expect(traps.data).not.toBeCalled();
            traps.error.mockClear();
        }
        parseError: {
            fetch.mockImplementationOnce(async () => createResponse('{ foo: 1 }', 'application/json'));
            await expect(client('/endpoint')).resolves.toEqual({ foo: 2 });
            verifyCalls(traps.error, [
                [expect.any(Error), expect.any(Response), expect.any(Request), client]
            ]);
            expect(traps.error.mock.calls[0][0]).toBeErrorWithCode(ErrorCode.apiError, {
                data: undefined,
                error: expect.any(SyntaxError),
                status: 200
            });
            expect(traps.data).not.toBeCalled();
            traps.error.mockClear();
        }
        networkError: {
            fetch.mockImplementationOnce(async () => Response.error());
            await expect(client('/endpoint')).resolves.toEqual({ foo: 2 });
            verifyCalls(traps.error, [
                [expect.any(Error), expect.any(Response), expect.any(Request), client]
            ]);
            expect(traps.error.mock.calls[0][0]).toBeErrorWithCode(ErrorCode.networkError, {
                data: undefined,
                error: null,
                status: 0
            });
            expect(traps.data).not.toBeCalled();
        }
    });

    it('should call trap with cloned request', async () => {
        const cb = mockFn();
        const client = createApiClient('http://localhost/api', { data: cb });
        await client('/endpoint', { method: 'POST', body: 'foo' });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][2].bodyUsed).toBe(false);
    });

    it('should not call error trap when error is not resulted by actual request', async () => {
        const mw = mockFn((req, next) => next(req));
        const cb = mockFn();
        const client = createApiClient('http://localhost/api', { error: cb });
        client.use(mw);

        const error = new Error();
        mw.mockImplementationOnce(() => {
            throw error;
        });
        await expect(client('/endpoint')).rejects.toBe(error);
        expect(cb).not.toBeCalled();

        const controller = new AbortController();
        controller.abort();
        await expect(client('/endpoint', { signal: controller.signal })).rejects.toBeInstanceOf(DOMException);
        expect(cb).not.toBeCalled();
    });

    it('should throw original error when error trap did not return value', async () => {
        const cb = mockFn();
        const client = createApiClient('http://localhost/api', { error: cb });

        fetch.mockImplementationOnce(async () => Response.json({ foo: 1 }, { status: 400 }));
        await expect(client('/endpoint')).rejects.toBeErrorWithCode(ErrorCode.apiError);
        expect(cb).toBeCalledTimes(1);
    });

    it('should parse data according to content-type header in response', async () => {
        const blob = blobFromBytes([97, 98, 99]);
        const client = createApiClient('http://localhost/api');
        json: {
            await expect(client('/endpoint')).resolves.toEqual({ foo: 1 });
        }
        multipart: {
            const formData = new FormData();
            formData.append('a', '1');
            formData.append('a', '2');
            formData.append('b', blob);
            fetch.mockResolvedValueOnce(createResponse(formData));

            const data = await client('/endpoint');
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
            expect(await bytesFromBlob(data.get('b'))).toEqual([97, 98, 99]);
        }
        urlencoded: {
            fetch.mockResolvedValueOnce(createResponse('a=1&a=2', 'application/x-www-form-urlencoded;charset=UTF-8'));
            const data = await client('/endpoint');
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
        }
        text: {
            fetch.mockResolvedValueOnce(createResponse(blob, 'text/plain;charset=UTF-8'));
            await expect(client('/endpoint')).resolves.toEqual('abc');
        }
        blob: {
            fetch.mockResolvedValueOnce(createResponse(blob));
            const data = await client('/endpoint');
            expect(data).toBeInstanceOf(Blob);
            expect(await bytesFromBlob(data)).toEqual([97, 98, 99]);
        }
    });

    it('should resolve to value returned from request trap', async () => {
        const cb = mockFn(() => 42);
        const client = createApiClient('http://localhost/api', { request: cb });

        await expect(client('/endpoint')).resolves.toBe(42);
        expect(cb).toBeCalledTimes(1);
    });

    it('should resolve to value returned from error trap', async () => {
        const cb = mockFn(() => 42);
        const client = createApiClient('http://localhost/api', { error: cb });

        fetch.mockImplementationOnce(async () => Response.json({ foo: 1 }, { status: 400 }));
        await expect(client('/endpoint')).resolves.toBe(42);
        expect(cb).toBeCalledTimes(1);
    });

    it('should resolve to undefined for 204 response without calling data trap', async () => {
        const cb = mockFn();
        const client = createApiClient('http://localhost/api', { data: cb });

        fetch.mockResolvedValueOnce(new Response(null, { status: 204 }));
        await expect(client('/endpoint')).resolves.toBeUndefined();
        expect(cb).not.toBeCalled();
    });
});

describe('peekBody', () => {
    it('should return data from Request object', async () => {
        const blob = blobFromBytes([97, 98, 99]);
        json: {
            const data = await peekBody(createRequest(JSON.stringify({ a: 1 }), 'application/json;charset=UTF-8'));
            expect(data).toEqual({ a: 1 });
        }
        multipart: {
            const formData = new FormData();
            formData.append('a', '1');
            formData.append('a', '2');
            formData.append('b', blob);

            const data = await peekBody(createRequest(formData));
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
            expect(await bytesFromBlob(data.get('b'))).toEqual([97, 98, 99]);
        }
        urlencoded: {
            const data = await peekBody(createRequest('a=1&a=2', 'application/x-www-form-urlencoded;charset=UTF-8'));
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
        }
        text: {
            const data = await peekBody(createRequest(blob, 'text/plain;charset=UTF-8'));
            expect(data).toEqual('abc');
        }
        blob: {
            const data = await peekBody(createRequest(blob));
            expect(data).toBeInstanceOf(Blob);
            expect(await bytesFromBlob(data)).toEqual([97, 98, 99]);
        }
    });

    it('should return data from Response object', async () => {
        const blob = blobFromBytes([97, 98, 99]);
        json: {
            const data = await peekBody(Response.json({ a: 1 }));
            expect(data).toEqual({ a: 1 });
        }
        multipart: {
            const formData = new FormData();
            formData.append('a', '1');
            formData.append('a', '2');
            formData.append('b', blob);

            const data = await peekBody(createResponse(formData));
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
            expect(await bytesFromBlob(data.get('b'))).toEqual([97, 98, 99]);
        }
        urlencoded: {
            const data = await peekBody(createResponse('a=1&a=2', 'application/x-www-form-urlencoded;charset=UTF-8'));
            expect(data).toBeInstanceOf(FormData);
            expect(data.getAll('a')).toEqual(['1', '2']);
        }
        text: {
            const data = await peekBody(createResponse(blob, 'text/plain;charset=UTF-8'));
            expect(data).toEqual('abc');
        }
        blob: {
            const data = await peekBody(createResponse(blob));
            expect(data).toBeInstanceOf(Blob);
            expect(await bytesFromBlob(data)).toEqual([97, 98, 99]);
        }
    });

    it('should keep body unused', async () => {
        const req = createRequest('abc');
        await peekBody(req);
        expect(req.bodyUsed).toBe(false);

        const res = createResponse('abc');
        await peekBody(res);
        expect(res.bodyUsed).toBe(false);
    });

    it('should resolve to undefined for HEAD and GET request', async () => {
        await expect(peekBody(new Request('http://localhost/api'))).resolves.toBeUndefined();
    });

    it('should resolve to undefined for 204 response', async () => {
        await expect(peekBody(new Response(null, { status: 204 }))).resolves.toBeUndefined();
    });
});
