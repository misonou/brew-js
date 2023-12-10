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
            timeout: 10000
        });
    });
});

describe('IdleTimeout extension', () => {
    it('should fire idle event when there is no listened interaction event', async () => {
        const cb = mockFn();
        bindEvent(app, 'idle', cb);

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
    });

    it('should not fire idle event again until there is interaction event again', async () => {
        const cb = mockFn();
        bindEvent(app, 'idle', cb);

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
        cb.mockClear();
        await 0;

        // event not fired as timer has not restarted
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
    });

    it('should not fire idle event again until promise is resolved', async () => {
        let resolve;
        const cb = mockFn().mockReturnValueOnce(new Promise(resolve_ => resolve = resolve_));
        bindEvent(app, 'idle', cb);

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        // trigger idle event and return promise
        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
        cb.mockClear();
        await 0;

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        // event not fired as previous promise not resolved
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        resolve();
        await 0;

        // event fired after promise is resolved
        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
    });

    it('should not update timer from local storage when crossFrame is false', async () => {
        const cb = mockFn();
        bindEvent(app, 'idle', cb);

        fireEvent.keyDown(window);
        jest.advanceTimersByTime(10000);
        expect(cb).not.toBeCalled();
        await 0;

        localStorage.setItem('app.lastInteract', String(Date.now() + 10000));
        jest.advanceTimersByTime(10000);
        expect(cb).toBeCalledTimes(1);
    });
});
