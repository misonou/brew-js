import idleTimeout from "src/extension/idleTimeout";
import { bindEvent, initApp, mockFn } from "../testUtil";
import { fireEvent } from "@testing-library/dom";
import { jest } from "@jest/globals";
import dom from "zeta-dom/dom";

/** @type {Brew.AppInstance<Brew.WithIdleTimeout>} */
var app;

beforeAll(async () => {
    // jQuery ready event does not work with fake timer
    // wait for DOM ready before using fake timer
    await dom.ready;
    jest.useFakeTimers();
});

beforeAll(async () => {
    app = await initApp(idleTimeout, app => {
        app.useIdleTimeout({
            crossFrame: true,
            timeout: 10000
        });
    });
});

describe('IdleTimeout extension', () => {
    it('should update local storage', async () => {
        fireEvent.keyDown(window);
        expect(localStorage.getItem('app.lastInteract')).toBe(String(Date.now()));
    });

    it('should update timer from local storage when crossFrame is false', async () => {
        const cb = mockFn();
        bindEvent(app, 'idle', cb);

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        localStorage.setItem('app.lastInteract', String(Date.now() + 10000));
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
    });
});
