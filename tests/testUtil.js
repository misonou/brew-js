import $ from "jquery";
import brew, { app } from "src/app";
import { mountElement } from "src/dom";
import dom from "zeta-dom/dom";
import { jest } from "@jest/globals";
import { bind, removeNode, selectIncludeSelf } from "zeta-dom/domUtil";
import { after, body, mockFn, cleanup } from "@misonou/test-utils";

export { root, body, mockFn, delay, after, verifyCalls, _, cleanup as cleanupAfterTest } from "@misonou/test-utils";

const XMLHttpRequest = jest.spyOn(window, 'XMLHttpRequest');

var counter = 0;

export function initApp(...callbacks) {
    const init = callbacks.pop();
    brew.with(...callbacks)(init);
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

export async function mount(html, callback) {
    const elm = $(html)[0];
    const arr = selectIncludeSelf('[id]', elm);
    cleanup(() => {
        removeNode(elm);
    });
    if (callback) {
        dom.on(elm, 'mounted', function () {
            callback(this);
        });
    }
    await after(() => {
        body.appendChild(elm);
        mountElement(elm);
    });
    if (arr[0]) {
        const dict = {};
        arr.forEach(v => {
            dict[v.id] = v;
        });
        return dict;
    }
    return elm;
}

export function waitForEvent(target, ...args) {
    return new Promise(resolve => {
        cleanup(target.on(...args, resolve));
    });
}

export function bindEvent(target, ...args) {
    if (target === app) {
        cleanup(app.on(...args));
    } else {
        cleanup(dom.on(target, ...args));
    }
}

export function defunctAfterTest(callback) {
    var enabled = true;
    cleanup(() => {
        enabled = false;
    });
    return function (...args) {
        if (enabled) {
            return callback(...args);
        }
    };
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

export function uniqueName() {
    return '__test__' + (counter++);
}

export function nativeHistoryBack() {
    return new Promise(resolve => {
        const unbind = bind(window, 'popstate', function () {
            unbind();
            setTimeout(resolve);
        })
        history.back();
    });
}

export function muteRejection(promise) {
    promise.catch(() => { });
    return promise;
}

beforeEach(() => {
    if (!body.childElementCount) {
        cleanup(() => $(body).empty())
    }
});
