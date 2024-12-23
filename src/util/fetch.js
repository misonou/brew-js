import { each, errorWithCode, extend, isArray, isError, isPlainObject, isUndefinedOrNull, makeAsync, noop, pipe, resolve } from "zeta-dom/util";
import { combinePath } from "./path.js";
import * as ErrorCode from "../errorCode.js";

const HEADER_CONTENT_TYPE = 'content-type';

function fetchImpl(request) {
    return fetch(request).catch(function (e) {
        if (isError(e) && e.name === 'TypeError') {
            return Response.error();
        }
        throw e;
    });
}

function readBody(input) {
    var contentType = input.headers.get(HEADER_CONTENT_TYPE) || '';
    var pos = contentType.indexOf(';');
    if (pos > 0) {
        contentType = contentType.slice(0, pos);
    }
    if (contentType === 'application/json') {
        return input.json();
    }
    if (contentType === 'multipart/form-data' || contentType === 'application/x-www-form-urlencoded') {
        return input.formData();
    }
    if (contentType.slice(0, 5) === 'text/') {
        return input.text();
    }
    return input.blob();
}

function createRequest(baseUrl, method, path, body, init) {
    if (typeof path === 'string') {
        method = method.toUpperCase();
        init = extend({ method, body }, init);
        init.headers = extend({}, init.headers);
        if (method !== 'GET' && method !== 'HEAD' && (isUndefinedOrNull(body) || isPlainObject(body) || isArray(body))) {
            init.body = JSON.stringify(body || {});
            init.headers[HEADER_CONTENT_TYPE] = 'application/json';
        }
    } else {
        init = path;
        path = method;
    }
    if (typeof path === 'string') {
        path = combinePath(baseUrl, path);
    }
    return new Request(path, init);
}

function executeRequest(self, fetch, request, traps) {
    return fetch(request.clone()).then(function (response) {
        var status = response.status;
        var handleError = function (code, error, message, data) {
            error = errorWithCode(code, message, { data, error, status });
            data = (traps.error || noop)(error, response, request, self);
            if (data !== undefined) {
                return data;
            }
            throw error;
        };
        if (status === 0) {
            return handleError(ErrorCode.networkError, null, '');
        }
        if (status !== 204) {
            return readBody(response).then(function (data) {
                return response.ok ? (traps.data || pipe)(data, response, request, self) : handleError(ErrorCode.apiError, null, response.statusText, data);
            }, function (error) {
                return handleError(ErrorCode.apiError, error, error.message);
            });
        }
    });
}

export function createApiClient(baseUrl, traps) {
    var fetch = fetchImpl;
    var execute = function (request) {
        return executeRequest(client, fetch, request, traps || {});
    };
    var client = function (method, path, body, init) {
        var request = createRequest(baseUrl, method, path, body, init);
        return traps && traps.request ? makeAsync(traps.request)(request, execute) : execute(request);
    };
    client.use = function (callback) {
        var next = fetch;
        fetch = function (req) {
            return makeAsync(callback)(req, next);
        };
    };
    each('head get post put patch delete', function (i, v) {
        client[v] = function (path, body, options) {
            if (i < 2) {
                options = body;
                body = undefined;
            }
            return client(v, path, body, options);
        };
    });
    return client;
}

export function peekBody(input) {
    // Request.body was added relatively recently and not yet supported in Firefox
    // therefore also need to check for Request.method
    if (input.body === null || input.method === 'GET' || input.method === 'HEAD') {
        return resolve();
    }
    return readBody(input.clone());
}
