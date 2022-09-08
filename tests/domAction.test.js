import { fireEvent } from "@testing-library/dom";
import $ from "jquery";
import router from "src/extension/router";
import { closeFlyout, openFlyout } from "src/domAction";
import { getVar, setVar } from "src/var";
import dom from "zeta-dom/dom";
import { locked } from "zeta-dom/domLock";
import { initApp, delay, mount, root, mockFn } from "./testUtil";

/** @type {Brew.AppInstance<Brew.WithRouter>} */
var app;

beforeAll(async () => {
    app = await initApp(router, app => {
        app.useRouter({
            routes: ['/*']
        });
    });
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

    it('should return a rejected promise if no element if found for selector', async () => {
        await expect(openFlyout('#nonexist')).rejects.toBeUndefined();
    });

    it('should assign variables to flyout element', async () => {
        const flyout = await mount(`<div var="{ foo: null }" is-flyout></div>`);
        expect(getVar(flyout, 'foo')).toBeNull();

        openFlyout(flyout, { foo: 'bar' });
        expect(getVar(flyout, 'foo')).toBe('bar');
    });

    it('should set modal if is-modal is present', async () => {
        const flyout = await mount(`<div is-flyout is-modal></div>`);
        openFlyout(flyout);
        expect(dom.modalElement).toBe(flyout);
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
});

describe('toggle directive', () => {
    it('should find the closest ancestor with is-flyout if selector is not specified', async () => {
        const { flyout, button } = await mount(`
            <div id="flyout" is-flyout>
                <button id="button" toggle></button>
            </div>
        `);
        fireEvent.click(button);
        expect(flyout).toHaveClassName('open');
    });

    it('should find the closest element with selector', async () => {
        const { flyout1, flyout2, button } = await mount(`
            <div>
                <div>
                    <div>
                        <div id="flyout1" is-flyout></div>
                    </div>
                    <button id="button" toggle="[is-flyout]"></button>
                </div>
                <div id="flyout2" is-flyout></div>
            </div>
        `);
        fireEvent.click(button);
        expect(flyout1).toHaveClassName('open');
        expect(flyout2).not.toHaveClassName('open');
    });

    it('should add target-opened class to the triggering element', async () => {
        const { button } = await mount(`
            <div id="flyout" is-flyout>
                <button id="button" toggle></button>
            </div>
        `);
        fireEvent.click(button);
        expect(button).toHaveClassName('target-opened');
    });

    it('should open flyout if toggle-if evaluates to truthy value', async () => {
        const { flyout, button } = await mount(`
            <div id="flyout" is-flyout>
                <button id="button" var="{ boolValue: false }" toggle toggle-if="boolValue"></button>
            </div>
        `);
        fireEvent.click(button);
        expect(flyout).not.toHaveClassName('open');

        setVar(button, 'boolValue', true);
        fireEvent.click(button);
        expect(flyout).toHaveClassName('open');
    });
});

describe('toggle-class directive', () => {
    it('should add class names to element', async () => {
        const elm = await mount(`<div toggle-class="+foo +bar"></div>`);
        fireEvent.click(elm);
        expect(elm).toHaveClassName('foo');
        expect(elm).toHaveClassName('bar');
    });

    it('should add class names to specified element', async () => {
        const { parent, child } = await mount(`
            <div id="parent">
                <div id="child" toggle-class="+foo" toggle-class-for="#parent"></div>
            </div>
        `);
        fireEvent.click(child);
        expect(parent).toHaveClassName('foo');
    });

    it('should add class names to element if toggle-if evaluates to truthy value', async () => {
        const elm = await mount(`<div var="{ boolValue: false }" toggle-class="+foo" toggle-if="boolValue"></div>`);
        fireEvent.click(elm);
        expect(elm).not.toHaveClassName('foo');

        setVar(elm, 'boolValue', true);
        fireEvent.click(elm);
        expect(elm).toHaveClassName('foo');
    });
});

describe('set-var directive', () => {
    it('should set variables on click', async () => {
        const elm = await mount(`<div var="{ foo: null }" set-var="{ foo: bar }"></div>`);
        expect(getVar(elm, 'foo')).toBeNull();

        fireEvent.click(elm);
        expect(getVar(elm, 'foo')).toBe('bar');
    });

    it('should not set variables for nested parent', async () => {
        const { parent, child } = await mount(`
            <div id="parent" var="{ foo: null }" set-var="{ foo: baz }">
                <div id="child" set-var="{ foo: bar }"></div>
            </div>
        `);
        expect(getVar(parent, 'foo')).toBeNull();

        fireEvent.click(child);
        expect(getVar(parent, 'foo')).toBe('bar');
    });
});
