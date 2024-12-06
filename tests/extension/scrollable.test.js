import { jest } from "@jest/globals";
import { waitFor } from "@testing-library/dom";
import { setScreenSize } from "@misonou/test-utils/mock/boxModel";
import { _, after, bindEvent, delay, initApp, initBody, mockFn, nativeHistoryBack, verifyCalls } from "../testUtil";
import { getContentRect, scrollBy } from "zeta-dom/domUtil";
import { toPlainRect } from "zeta-dom/domUtil";
import dom, { focusable } from "zeta-dom/dom";
import { addAnimateIn, addAnimateOut } from "src/anim";
import { getDirectiveComponent } from "src/directive";
import { getVar, setVar } from "src/var";
import router from "src/extension/router";
import scrollable from "src/extension/scrollable";
import template from "src/extension/template";
import viewport from "src/extension/viewport";

/** @type {Brew.AppInstance<Brew.WithScrollable & Brew.WithRouter & Brew.WithTemplate>} */
var app;

const customAnimateIn = mockFn(() => delay(10));
const customAnimateOut = mockFn(() => delay(10));
addAnimateIn('custom-anim', customAnimateIn)
addAnimateOut('custom-anim', customAnimateOut)

beforeAll(async () => {
    app = await initApp(scrollable, router, template, viewport, app => {
        app.useScrollable();
        app.useRouter({
            routes: ['/*']
        });
    });
});

beforeEach(async () => {
    await app.navigate('/');
});

describe('Scrollable extension', () => {
    it('should expose scrollable plugin as directive component', () => {
        const { root } = initBody(`
            <div scrollable id="root">
                <div scrollable-target></div>
            </div>
        `);
        expect(getDirectiveComponent(root).scrollable).toBeInstanceOf(Object);
    });

    it('should update scrollable options when directive is updated', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        expect(root).toHaveClassName('scrollable-x-r');

        await after(() => {
            root.setAttribute('scrollable', 'y-only');
        });
        expect(root).not.toHaveClassName('scrollable-x-r');
    });

    it('should disable scrollable when element is not focusable', async () => {
        const { root, modal } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
            <div id="modal"></div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const disable = jest.spyOn(scrollable, 'disable');
        const enable = jest.spyOn(scrollable, 'enable');
        await after(() => {
            dom.setModal(modal);
            dom.focus(modal);
        });
        expect(focusable(root)).toBe(false);
        expect(disable).toBeCalledTimes(1);

        await after(() => {
            dom.releaseModal(modal);
        });
        expect(focusable(root)).toBeTruthy();
        expect(enable).toBeCalledTimes(1);
    });

    it('should emit scroll related events', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const cb = mockFn();
        bindEvent(root, {
            scrollStart: cb,
            scrollMove: cb,
            scrollStop: cb,
            scrollProgressChange: cb,
        });
        scrollable.scrollBy(10, 10, 0);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'scrollStart' }), root],
            [expect.objectContaining({ type: 'scrollMove' }), root],
            [expect.objectContaining({ type: 'scrollProgressChange' }), root],
            [expect.objectContaining({ type: 'scrollEnd' }), root], // TODO
        ]);
    });

    it('should handle getContentRect event', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const cb = jest.spyOn(scrollable, 'scrollPadding');
        expect(getContentRect(root)).toEqual(toPlainRect(0, 0, 100, 100));
        expect(cb).toBeCalledTimes(1);
    });

    it('should handle scrollBy event', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        expect(scrollBy(root, 50, 50, 'instant')).toEqual({ x: 50, y: 50 });
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });

        expect(scrollBy(root, 50, 50)).toEqual({ x: 50, y: 50 });
        await waitFor(() => expect(scrollable).toMatchObject({ scrollX: 100, scrollY: 100 }));
    });

    it('should reset scroll position on pageenter event', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(50, 50);
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });

        app.emit('pageenter', root, null, true);
        expect(scrollable).toMatchObject({ scrollX: -0, scrollY: -0 });
    });

    it('should start animation with scroll-into-view trigger', async () => {
        const { root } = await initBody(`
            <div scrollable id="root" x-rect="0 0 1000 768">
                <div scrollable-target x-rect="0 0 1000 2000">
                    <div class="item" animate-in="custom-anim" animate-out animate-on="scroll-into-view" x-rect="0 0 1000 999"></div>
                    <div class="item" animate-in="custom-anim" animate-out animate-on="scroll-into-view" x-rect="0 1000 1000 1000"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const items = root.querySelectorAll('.item');
        await delay(10);
        verifyCalls(customAnimateIn, [
            [items[0], '']
        ]);

        customAnimateIn.mockClear();
        scrollable.scrollBy(0, 1000);
        await delay(10);
        verifyCalls(customAnimateIn, [
            [items[1], '']
        ]);
        verifyCalls(customAnimateOut, [
            [items[0], '']
        ]);
    });
});

describe('persist-scroll directive', () => {
    it('should restore scroll position when navigating back', async () => {
        const { root } = await initBody(`
            <div scrollable persist-scroll id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(50, 50);
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });

        await app.navigate('/foo');
        scrollable.scrollTo(75, 75);
        expect(scrollable).toMatchObject({ scrollX: 75, scrollY: 75 });

        await nativeHistoryBack();
        await delay();
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });
    });

    it('should restore scroll position between snapshot', async () => {
        const { root } = await initBody(`
            <div scrollable persist-scroll id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(50, 50);
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });

        await app.snapshot();
        scrollable.scrollTo(75, 75);
        expect(scrollable).toMatchObject({ scrollX: 75, scrollY: 75 });

        await nativeHistoryBack();
        await delay();
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });
    });

    it('should not restore scroll position when directive is not present', async () => {
        const { root } = await initBody(`
            <div scrollable persist-scroll id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(50, 50);
        expect(scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });

        await app.navigate('/foo');
        scrollable.scrollTo(75, 75);
        expect(scrollable).toMatchObject({ scrollX: 75, scrollY: 75 });

        root.removeAttribute('persist-scroll');
        await nativeHistoryBack();
        await delay();
        expect(scrollable).toMatchObject({ scrollX: 75, scrollY: 75 });
    });

    it('should restore scroll position by persist key', async () => {
        const { root1, root2 } = await initBody(`
            <div scrollable persist-scroll="scroller1" id="root1" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
            <div scrollable persist-scroll="scroller2" id="root2" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        const scrollable1 = getDirectiveComponent(root1).scrollable;
        const scrollable2 = getDirectiveComponent(root2).scrollable;
        scrollable1.scrollTo(50, 50);
        scrollable2.scrollTo(25, 25);
        expect(scrollable1).toMatchObject({ scrollX: 50, scrollY: 50 });
        expect(scrollable2).toMatchObject({ scrollX: 25, scrollY: 25 });

        await app.navigate('/foo');
        scrollable1.scrollTo(75, 75);
        scrollable2.scrollTo(85, 85);
        expect(scrollable1).toMatchObject({ scrollX: 75, scrollY: 75 });
        expect(scrollable2).toMatchObject({ scrollX: 85, scrollY: 85 });

        await nativeHistoryBack();
        await delay();
        expect(scrollable1).toMatchObject({ scrollX: 50, scrollY: 50 });
        expect(scrollable2).toMatchObject({ scrollX: 25, scrollY: 25 });
    });
});

describe('scroller-page directive', () => {
    it('should emit scrollIndexChange event', async () => {
        const { root } = await initBody(`
            <div scrollable scroller-page=".item" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const cb = mockFn();
        bindEvent(root, 'scrollIndexChange', cb);

        scrollable.scrollTo(0, 100);
        verifyCalls(cb, [
            [expect.objectContaining({ oldIndex: 0, newIndex: 1 }), _]
        ]);
    });

    it('should set index to state variable', async () => {
        const { root } = await initBody(`
            <div var="{ index: 0 }" scrollable scroller-state="index" scroller-page=".item" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const cb = mockFn();
        bindEvent(root, 'statechange', cb);

        await after(() => {
            scrollable.scrollTo(0, 100);
        });
        expect(cb).toBeCalledTimes(1);
        expect(getVar(root, 'index')).toBe(1);
    });

    it('should scroll to item when state variable changes', async () => {
        const { root } = await initBody(`
            <div var="{ index: 0 }" scrollable scroller-state="index" scroller-page=".item" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        await after(() => {
            setVar(root, 'index', 1);
        });
        await waitFor(() => expect(scrollable).toMatchObject({ scrollY: 100 }));
    });

    it('should not trigger change when directive is not present', async () => {
        const { root } = await initBody(`
            <div scrollable scroller-page=".item" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        const cb = mockFn();
        bindEvent(root, 'scrollIndexChange', cb);

        await after(() => {
            root.removeAttribute('scroller-page');
        });
        scrollable.scrollTo(0, 100);
        expect(cb).not.toBeCalled();
    });
});

describe('scroller-snap-page directive', () => {
    it('should cause scrollable to snap to item', async () => {
        const { root } = await initBody(`
            <div scrollable scroller-page=".item" scroller-snap-page="always" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(0, 75);
        expect(scrollable).toMatchObject({ scrollY: 100 });
    });

    it('should toggle snap to item with screen orientation', async () => {
        const { root } = await initBody(`
            <div scrollable scroller-page=".item" scroller-snap-page="portrait" id="root" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 100 300">
                    <div class="item" x-rect="0 0 100 100"></div>
                    <div class="item" x-rect="0 100 100 100"></div>
                    <div class="item" x-rect="0 200 100 100"></div>
                </div>
            </div>
        `);
        const scrollable = getDirectiveComponent(root).scrollable;
        scrollable.scrollTo(0, 75);
        expect(scrollable).toMatchObject({ scrollY: 75 });

        setScreenSize(768, 1024);
        await waitFor(() => expect(scrollable).toMatchObject({ scrollY: 100 }));
    });
});
