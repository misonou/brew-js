import { addAnimateIn, addAnimateOut } from "src/anim";
import { addRenderer, addTransformer, hookBeforeUpdate, matchElement } from "src/dom";
import { getVar, setVar } from "src/var";
import template from "src/extension/template";
import router from "src/extension/htmlRouter";
import { after, defunctAfterTest, delay, initApp, mockFn, mount, uniqueName, verifyCalls, _, body, initBody } from "./testUtil";

const testTransform = mockFn((element, getState, updateDOM) => {
    element.innerHTML = '<div>test</div>';
});
const testRenderer = mockFn((element, getState, updateDOM) => {
    updateDOM(element, {
        'test-renderer': 'foo'
    });
});

const customAnimateIn = mockFn();
const customAnimateOut = mockFn();
const matchElementCb = mockFn();
addAnimateIn('custom-anim', customAnimateIn)
addAnimateOut('custom-anim', customAnimateOut)

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;
var matchElementResult = [];

beforeAll(async () => {
    addTransformer('test-transform', testTransform);
    addRenderer('test-renderer', testRenderer);
    app = await initApp(template, router, (app) => {
        app.useHtmlRouter({
            routes: ['/*']
        });
        // test for matchElement before app ready
        initBody('<div class="match-element-1"></div>');
        matchElement('.match-element-1', matchElementCb);
        matchElementResult.push([...matchElementCb.mock.calls]);
        app.on('ready', () => {
            matchElementResult.push([...matchElementCb.mock.calls]);
        });
    });
});

describe('mountElement', () => {
    it('should set variables to its initial value', async () => {
        const elm = await mount(`<div var="{ foo: bar }"></div>`);
        expect(getVar(elm, 'foo')).toBe('bar');
    });

    it('should apply transforms before mounted event', async () => {
        const cb = mockFn(elm => elm.innerHTML);
        const elm = await mount(`<div test-transform></div>`, cb);
        expect(cb.mock.results[0].value).toBe(elm.innerHTML);
    });

    it('should apply renderer before mounted event', async () => {
        const cb = mockFn(elm => elm.getAttribute('test-renderer'));
        const elm = await mount(`<div test-renderer></div>`, cb);
        expect(cb.mock.results[0].value).toBe('foo');
    });

    it('should attach selector-based event handler when element is being mounted', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        const klass = uniqueName();
        app.on(`.${klass}`, 'mounted', cb1);
        app.on(`.${klass}`, 'statechange', cb1);

        await mount(`<div><div class="${klass}"></div></div>`, () => {
            app.on(`.${klass}`, 'mounted', cb2);
            app.on(`.${klass}`, 'statechange', cb2);
        });
        verifyCalls(cb1, [
            [expect.objectContaining({ type: 'mounted' }), _]
        ]);
        verifyCalls(cb2, [
            [expect.objectContaining({ type: 'mounted' }), _]
        ]);

        await after(() => setVar(`.${klass}`, 'test-select', true));
        verifyCalls(cb1, [
            [expect.objectContaining({ type: 'mounted' }), _],
            [expect.objectContaining({ type: 'statechange' }), _],
        ]);
        verifyCalls(cb2, [
            [expect.objectContaining({ type: 'mounted' }), _],
            [expect.objectContaining({ type: 'statechange' }), _],
        ]);
    });

    it('should ignore disposed selector-based event handler', async () => {
        const cb1 = mockFn();
        const klass = uniqueName();
        const unbind = app.on(`.${klass}`, { mounted: cb1, statechange: cb1 });

        await mount(`<div><div class="${klass}"></div></div>`, () => {
            unbind();
        });
        expect(cb1).not.toBeCalled();

        await after(() => setVar(`.${klass}`, 'test-select', true));
        expect(cb1).not.toBeCalled();
    });
});

describe('processStateChange', () => {
    it('should trigger animation on statechange', async () => {
        const elm = await mount(`
            <div var="{ foo: 1 }" custom-anim animate-on="statechange"></div>
        `);
        elm.setAttribute('animate-in', 'custom-anim');

        await after(() => setVar(elm, 'foo', 2));
        await delay(10);
        expect(customAnimateIn).toBeCalledTimes(1);
    });

    it('should trigger animation on statechange of specified variables', async () => {
        const elm = await mount(`
            <div var="{ foo: 1 bar: 1 }" custom-anim animate-on="statechange" animate-on-statechange="foo"></div>
        `);
        elm.setAttribute('animate-in', 'custom-anim');

        await after(() => setVar(elm, 'bar', 2));
        await delay(10);
        expect(customAnimateIn).not.toBeCalled();

        await after(() => setVar(elm, 'foo', 2));
        await delay(10);
        expect(customAnimateIn).toBeCalledTimes(1);
    });

    it('should trigger animation on all active elements', async () => {
        const { root, inner1, inner2 } = await mount(`
            <div id="root" var="{ foo: 1 }" switch>
                <div match-path="/foo">
                    <div id="inner1" custom-anim animate-on="statechange" animate-on-statechange="foo"></div>
                </div>
                <div match-path="/bar">
                    <div id="inner2" custom-anim animate-on="statechange" animate-on-statechange="foo"></div>
                </div>
            </div>
        `);
        await app.navigate('/foo');
        inner1.setAttribute('animate-in', 'custom-anim');
        inner2.setAttribute('animate-in', 'custom-anim');

        await after(() => setVar(root, 'foo', 2));
        await delay(10);
        verifyCalls(customAnimateIn, [
            [inner1, '']
        ]);

        customAnimateIn.mockClear();
        await app.navigate('/bar');
        await after(() => setVar(root, 'foo', 3));
        await delay(10);
        verifyCalls(customAnimateIn, [
            [inner2, '']
        ]);
    });

    it('should apply dom changes after animating-out and before animating-in', async () => {
        customAnimateIn.mockImplementationOnce((elm) => {
            expect(elm).toHaveClassName('foo');
        });
        customAnimateOut.mockImplementationOnce((elm) => {
            expect(elm).not.toHaveClassName('foo');
        });
        const elm = await mount(`
            <div var="{ foo: false }" set-class="{ foo: foo }" custom-anim animate-on="statechange"></div>
        `);
        expect(customAnimateOut).not.toBeCalled();
        expect(customAnimateIn).not.toBeCalled();
        expect(elm).not.toHaveClassName('foo');
        elm.setAttribute('animate-in', 'custom-anim');
        elm.setAttribute('animate-out', '');

        await after(() => setVar(elm, 'foo', true));
        await delay(1000);
        expect(customAnimateOut).toBeCalledTimes(1);
        expect(customAnimateIn).toBeCalledTimes(1);
    });
});

describe('hookBeforeUpdate', () => {
    it('should receive updates to DOM elements', async () => {
        const elm = await mount(`
            <div var="{ foo: false }" set-class="{ foo: foo }"></div>
        `);
        const cb = mockFn();
        hookBeforeUpdate(defunctAfterTest(cb));

        await after(() => setVar(elm, 'foo', true));
        expect(cb).toBeCalledTimes(1);

        const domUpdates = cb.mock.calls[0][0];
        expect(domUpdates).toBeInstanceOf(Map);
        expect(domUpdates.get(elm)).toEqual({
            $$class: { foo: true }
        });
    });

    it('should be able to alter updates to DOM elements', async () => {
        const elm = await mount(`
            <div var="{ foo: false }" set-class="{ foo: foo }"></div>
        `);
        hookBeforeUpdate(defunctAfterTest(function (domUpdates) {
            domUpdates.get(elm).$$class.bar = true;
        }));

        await after(() => setVar(elm, 'foo', true));
        expect(elm).toHaveClassName('foo');
        expect(elm).toHaveClassName('bar');
    });
});

describe('matchElement', () => {
    it('should match element when mounted', async () => {
        expect(matchElementResult[0]).toEqual([]);
        expect(matchElementResult[1]).toEqual([[body.querySelector('.match-element-1')]]);

        const elm = await mount(`<div class="match-element-1"></div>`);
        verifyCalls(matchElementCb, [[elm]]);
    });

    it('should match existing element after app ready', async () => {
        const elm = await mount(`<div class="match-element-2"></div>`);
        const cb = mockFn();
        matchElement('.match-element-2', cb);
        verifyCalls(cb, [[elm]]);
    });
});
