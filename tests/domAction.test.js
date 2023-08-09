import { fireEvent } from "@testing-library/dom";
import { jest } from "@jest/globals";
import router from "src/extension/router";
import { addAsyncAction, closeFlyout, isFlyoutOpen, openFlyout, toggleFlyout } from "src/domAction";
import dom from "zeta-dom/dom";
import { lock } from "zeta-dom/domLock";
import { initApp, delay, mount, root, mockFn, after, bindEvent } from "./testUtil";

/** @type {Brew.AppInstance<Brew.WithRouter>} */
var app;

const cb1 = mockFn();
const cb2 = mockFn();

beforeAll(async () => {
    app = await initApp(router, app => {
        app.useRouter({
            routes: ['/*']
        });
        addAsyncAction('async-action-1', cb1);
        addAsyncAction('async-action-2', cb2);
    });
    jest.spyOn(app, 'fromHref');
    jest.spyOn(window, 'open');
});

beforeEach(async () => {
    await app.navigate('/');
});

describe('openFlyout', () => {
    it('should return a promise that will be resolved with value passed to closeFlyout', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        const promise = openFlyout(flyout);
        closeFlyout(flyout, 'test');
        await expect(promise).resolves.toBe('test');
    });

    it('should return the same promise if flyout is already opened', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        const promise = openFlyout(flyout);
        expect(openFlyout(flyout)).toBe(promise);
    });

    it('should return the different promise if flyout is already closing', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        const promise = openFlyout(flyout);
        const promise1 = closeFlyout(flyout);
        expect(flyout).toHaveClassName('closing');

        expect(openFlyout(flyout)).not.toBe(promise);
        expect(flyout).not.toHaveClassName('closing');
        expect(flyout).toHaveClassName('visible');

        await promise1;
        expect(flyout).not.toHaveClassName('closing');
        expect(flyout).toHaveClassName('visible');
    });

    it('should return a rejected promise if no element if found for selector', async () => {
        await expect(openFlyout('#nonexist')).rejects.toBeUndefined();
    });

    it('should set modal if is-modal is present', async () => {
        const flyout = await mount(`<div is-flyout is-modal></div>`);
        openFlyout(flyout);
        expect(dom.modalElement).toBe(flyout);
    });

    it('should retain focus when element is not currently focusable', async () => {
        const { modal, flyout } = await mount(`
            <div>
                <div id="modal"></div>
                <div id="flyout" is-flyout></div>
            </div>
        `);
        dom.setModal(modal);
        openFlyout(flyout);
        expect(dom.focusedElements).toEqual([flyout, modal, root]);
    });

    it('should close flyout and resolve with value from triggering element when closeIfOpened is true', async () => {
        const { flyout, button } = await mount(`
            <div id="flyout" is-flyout>
                <button id="button" value="test" toggle></button>
            </div>
        `);
        const promise = openFlyout(flyout);
        openFlyout(flyout, null, button, true);
        await expect(promise).resolves.toBe('test');
    });

    it('should have flyout closed upon navigation', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        openFlyout(flyout);
        await app.navigate('/foo');
        await delay(10);
        expect(flyout).not.toHaveClassName('open');
    });

    it('should have flyout closed upon focus leaving by default', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        openFlyout(flyout);
        expect(flyout).toHaveClassName('open');

        dom.focus(root);
        await delay(10);
        expect(flyout).not.toHaveClassName('open');
    });

    it('should not have flyout closed upon focus leaving when swipe-dismiss is present', async () => {
        const flyout = await mount(`<div is-flyout swipe-dismiss="left"></div>`);
        openFlyout(flyout);
        expect(flyout).toHaveClassName('open');

        dom.focus(root);
        await delay(10);
        expect(flyout).toHaveClassName('open');
    });
});

describe('closeFlyout', () => {
    it('should return a resolved promise when flyout is not opened', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        await expect(closeFlyout(flyout)).resolves.toBeDefined();
    });

    it('should close all opened flyouts if first argument is undefined', async () => {
        const { flyout1, flyout2 } = await mount(`
            <div>
                <div id="flyout1" is-flyout></div>
                <div id="flyout2" is-flyout></div>
            </div>
        `);
        dom.retainFocus(flyout1, flyout2);

        const p1 = openFlyout(flyout1);
        const p2 = openFlyout(flyout2);
        closeFlyout(undefined, 'test');
        await expect(p1).resolves.toBe('test');
        await expect(p2).resolves.toBe('test');
    });

    it('should emit flyouthide event after flyout is closed', async () => {
        const cb = mockFn();
        const flyout = await mount(`<div is-flyout></div>`);
        bindEvent(flyout, 'flyouthide', cb);
        openFlyout(flyout);

        await closeFlyout(flyout);
        expect(cb).toBeCalledTimes(1);
    });

    it('should not emit flyouthide event if flyout is reopened before fully closed', async () => {
        const cb = mockFn();
        const flyout = await mount(`<div is-flyout></div>`);
        bindEvent(flyout, 'flyouthide', cb);
        openFlyout(flyout);

        const promise = closeFlyout(flyout);
        openFlyout(flyout);
        await promise;
        expect(cb).not.toBeCalled();
    });
});

describe('isFlyoutOpen', () => {
    it('should return whether flyout is open', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        expect(isFlyoutOpen(flyout)).toBe(false);

        openFlyout(flyout);
        expect(isFlyoutOpen(flyout)).toBe(true);

        await closeFlyout(flyout);
        expect(isFlyoutOpen(flyout)).toBe(false);
    });

    it('should return false when flyout is closing', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        openFlyout(flyout);

        const promise = closeFlyout(flyout);
        expect(isFlyoutOpen(flyout)).toBe(false);
        await promise;
    });
});

describe('toggleFlyout', () => {
    it('should toggle flyout', async () => {
        const flyout = await mount(`<div is-flyout></div>`);
        expect(isFlyoutOpen(flyout)).toBe(false);

        toggleFlyout(flyout);
        expect(isFlyoutOpen(flyout)).toBe(true);

        toggleFlyout(flyout);
        expect(isFlyoutOpen(flyout)).toBe(false);
    });

    it('should send value from source element', async () => {
        const { flyout, button } = await mount(`
            <div id="flyout" is-flyout>
                <button id="button" value="test" toggle></button>
            </div>
        `);
        const promise = toggleFlyout(flyout);
        toggleFlyout(flyout, button);
        await expect(promise).resolves.toBe('test');
    });
});

describe('async-action directive', () => {
    it('should invoke next handler immediately if current handler return non-promise', async () => {
        const button = await mount(`
            <button async-action-1 async-action-2></button>
        `);
        fireEvent.click(button);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).toBeCalledTimes(1);
    });

    it('should invoke next handler after return promise is resolved', async () => {
        let resolve;
        const promise = new Promise(res_ => resolve = res_);
        const button = await mount(`
            <button async-action-1 async-action-2></button>
        `);
        cb1.mockReturnValueOnce(promise);
        fireEvent.click(button);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();

        await after(resolve);
        expect(cb2).toBeCalledTimes(1);
    });

    it('should not invoke next handler after return promise is rejected', async () => {
        let reject;
        const promise = new Promise((_, rej_) => reject = rej_);
        const button = await mount(`
            <button async-action-1 async-action-2></button>
        `);
        cb1.mockReturnValueOnce(promise);
        fireEvent.click(button);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();

        await after(reject);
        expect(cb2).not.toBeCalled();
    });

    it('should not invoke next handler if stopImmediatePropagation is called', async () => {
        const button = await mount(`
            <button async-action-1 async-action-2></button>
        `);
        cb1.mockImplementationOnce(e => {
            e.stopImmediatePropagation();
        });
        fireEvent.click(button);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();
    });

    it('should reset when element is no longer focusable', async () => {
        const { button, modal } = await mount(`
            <div id="wrapper">
                <button id="button" async-action-1 async-action-2></button>
                <div id="modal"></div>
            </div>
        `);
        cb1.mockImplementationOnce(() => {
            dom.setModal(modal);
        });
        await after(() => {
            fireEvent.click(button);
        });
        expect(dom.modalElement).toBe(modal);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).not.toBeCalled();

        cb1.mockClear();
        dom.releaseModal(modal);
        await after(() => {
            fireEvent.click(button);
        });
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).toBeCalledTimes(1);
    });
});

describe('href directive', () => {
    it('should trigger app navigation', async () => {
        const { link } = await mount(`
            <a id="link" href="/test"></a>
        `);
        await after(() => {
            fireEvent.click(link);
        });
        expect(app.path).toBe('/test');
    });

    it('should call fromHref to resolve app path', async () => {
        const { link } = await mount(`
            <a id="link" href="http://localhost/test"></a>
        `);
        fireEvent.click(link);
        expect(app.fromHref).toBeCalledWith('/test');
    });

    it('should leave the app if it is not an app path', async () => {
        const { link } = await mount(`
            <a id="link" href="http://google.com/"></a>
        `);
        // create a cancellable lock so that window.open will be called
        lock(link, new Promise(() => { }), true);

        const stateId = history.state;
        await after(() => {
            fireEvent.click(link);
        });
        expect(app.fromHref).not.toBeCalled();
        expect(app.path).toBe('/');
        expect(history.state).toBe(stateId);
        expect(window.open).toBeCalledWith('http://google.com/', '_self', '');
    });

    it('should respect noreferrer and noopener in rel attribute', async () => {
        const { link } = await mount(`
            <a id="link" rel="noreferrer noopener" href="http://www.www.com/test"></a>
        `);
        // create a cancellable lock so that window.open will be called
        lock(link, new Promise(() => { }), true);

        await after(() => {
            fireEvent.click(link);
        });
        expect(window.open).toBeCalledWith('http://www.www.com/test', '_self', 'noreferrer,noopener');
    });
});

describe('data-href directive', () => {
    it('should trigger app navigation', async () => {
        const { link } = await mount(`
            <button id="link" data-href="/test"></button>
        `);
        await after(() => {
            fireEvent.click(link);
        });
        expect(app.path).toBe('/test');
    });

    it('should not call fromHref to resolve app path', async () => {
        const { link } = await mount(`
            <button id="link" data-href="/test"></button>
        `);
        fireEvent.click(link);
        expect(app.fromHref).not.toBeCalled();
    });
});
