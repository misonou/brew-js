import $ from "jquery";
import brew from "src/app";
import { mountElement } from "src/dom";
import { ucfirst } from "zeta-dom/util";
import { jest } from "@jest/globals";

var counter = 0;

export const consoleWarnMock = jest.fn();
export const root = document.documentElement;
export const body = document.body;
export const appConfig = {};
export const mockFn = jest.fn;
export const objectContaining = expect.objectContaining;
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

export async function mount(html) {
    const elm = $(html)[0];
    await after(() => {
        body.appendChild(elm);
        mountElement(elm);
    });
    return elm;
}

export function uniqueName() {
    return '__test__' + (counter++);
}

const originalGroupCollapsed = console.groupCollapsed;
const originalWarn = console.warn;
const originalLog = console.log;
beforeEach(() => {
    console.groupCollapsed = function () { };
    console.log = function () { };
    console.warn = consoleWarnMock;
});
afterEach(() => {
    console.groupCollapsed = originalGroupCollapsed;
    console.log = originalLog;
    console.warn = originalWarn;
    consoleWarnMock.mockReset();
    $(body).empty();
});

beforeAll(() => {
    brew(app => {
        for (let i in appConfig) {
            app['use' + ucfirst(i)](appConfig[i]);
        }
    });
});
