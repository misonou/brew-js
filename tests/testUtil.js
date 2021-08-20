import $ from "jquery";
import brew, { app } from "src/app";
import { mountElement } from "src/dom";
import { noop } from "zeta-dom/util";
import dom from "zeta-dom/dom";
import { jest } from "@jest/globals";

const consoleGroupCollapsed = console.groupCollapsed;
const consoleWarn = console.warn;
const consoleLog = console.log;
const consoleError = console.error;
const XMLHttpRequest = jest.spyOn(window, 'XMLHttpRequest');

var counter = 0;
var cleanup = [];

export const root = document.documentElement;
export const body = document.body;
export const mockFn = jest.fn;
export const _ = expect.anything();

export function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds || 10);
    });
}

export async function after(callback) {
    callback();
    await delay();
}

export function initApp(callback) {
    brew(callback || noop);
    return app.ready;
}

/** @type {(html: string) => Zeta.Dictionary<HTMLElement>} */
export function initBody(html) {
    var dict = {};
    $(body).html(html);
    $('[id]').each(function (i, v) {
        dict[v.id] = v;
    });
    // @ts-ignore
    return dict;
}

export async function mount(html) {
    const elm = $(html)[0];
    await after(() => {
        body.appendChild(elm);
        mountElement(elm);
    });
    return elm;
}

export function bindEvent(...args) {
    // @ts-ignore
    cleanup.push(dom.on(...args));
}

export function defunctAfterTest(callback) {
    var enabled = true;
    cleanup.push(() => {
        enabled = false;
    });
    return function (...args) {
        if (enabled) {
            return callback(...args);
        }
    };
}

export function verifyCalls(cb, args) {
    expect(cb).toBeCalledTimes(args.length);
    args.forEach((v, i) => {
        expect(cb).toHaveBeenNthCalledWith(i + 1, ...v);
    });
}

export function mockXHROnce(status, body) {
    XMLHttpRequest.mockImplementationOnce(() => {
        const xhr = {
            open: mockFn(),
            send: mockFn(),
            setRequestHeader: mockFn(),
            getAllResponseHeaders: mockFn(() => ({})),
            readyState: 4,
            status: status,
            response: JSON.stringify(body)
        };
        setTimeout(() => {
            xhr.onreadystatechange();
            xhr.onload();
        });
        return xhr;
    });
}

export function classNamesOf(elm) {
    return [...elm.classList];
}

export function uniqueName() {
    return '__test__' + (counter++);
}

beforeAll(() => {
    console.groupCollapsed = mockFn();
    console.log = mockFn();
    console.warn = mockFn();
    console.error = mockFn();
});
afterAll(() => {
    console.groupCollapsed = consoleGroupCollapsed;
    console.log = consoleLog;
    console.warn = consoleWarn;
    console.error = consoleError;
});

beforeEach(() => {
    if (!body.childElementCount) {
        cleanup.push(() => $(body).empty())
    }
});
afterEach(() => {
    jest.clearAllMocks();
    cleanup.splice(0).forEach(v => v());
});
