import { addAnimateIn, addAnimateOut, animateIn, animateOut } from "src/anim";
import { after, bindEvent, delay, mockFn, mount, verifyCalls } from "./testUtil";
import $ from "jquery";

const customAnimateIn = mockFn(() => delay(10));
const customAnimateOut = mockFn(() => delay(10));
addAnimateIn('custom-anim', customAnimateIn)
addAnimateOut('custom-anim', customAnimateOut)

describe('animateIn', () => {
    it('should fire animationstart and animationcomplete event', async () => {
        const cb = mockFn();
        const elm = await mount(`<div animate-in></div>`);
        bindEvent(elm, 'animationstart', cb);
        bindEvent(elm, 'animationcomplete', cb);

        const promise = animateIn(elm, 'show');
        expect(cb).toBeCalledTimes(1);

        await promise;
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'animationstart', animationType: 'in', animationTrigger: 'show' }), elm],
            [expect.objectContaining({ type: 'animationcomplete', animationType: 'in', animationTrigger: 'show' }), elm],
        ]);
    });

    it('should not fire animationstart and animationcomplete event if no animation is triggered', async () => {
        const cb = mockFn();
        const elm = await mount(`<div></div>`);
        bindEvent(elm, 'animationstart', cb);
        bindEvent(elm, 'animationcomplete', cb);

        await animateIn(elm, 'show');
        expect(cb).not.toBeCalled();
    });

    it('should trigger custom animation when animate-in attribute contains animation name', async () => {
        const elm = await mount(`
            <div>
                <div animate-in="custom-anim"></div>
                <div animate-in="custom-anim" custom-anim="foo"></div>
            </div>
        `);
        await animateIn(elm, 'show');
        verifyCalls(customAnimateIn, [
            [elm.children[0], ''],
            [elm.children[1], 'foo'],
        ]);
    });

    it('should always resolve within a timeout interval', async () => {
        const onResolve = mockFn();
        const promise = delay(30000).then(onResolve);
        const onAnimateIn = mockFn(() => promise);
        const elm = await mount(`<div animate-in></div>`);
        bindEvent(elm, 'animatein', onAnimateIn);

        await expect(animateIn(elm, 'show')).resolves.toBeUndefined();
        expect(onAnimateIn).toBeCalled();
        expect(onResolve).not.toBeCalled();
    });

    it('should animate element with animate-sequence directive', async () => {
        const arr = [];
        const elm = await mount(`
            <div animate-sequence=".item" animate-sequence-type="custom-anim">
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];
        bindEvent(elm, 'animatein', () => {
            arr.push(...items.map(v => v.classList.contains('tweening-in')));
        });

        await animateIn(elm, 'show');
        expect(elm).toHaveClassName('tweening-in');
        expect(arr).toEqual([false, false, false]);

        // have sequence in second time
        await animateOut(elm, 'show');
        arr.splice(0);

        await animateIn(elm, 'show');
        expect(elm).toHaveClassName('tweening-in');
        expect(arr).toEqual([false, false, false]);
    });

    it('should animate new elements for scope with autoStart set to true', async () => {
        const elm = await mount(`<div animate-in></div>`);
        animateIn(elm, 'show', '[scope]', true);

        // listen animate-in
        await after(() => {
            elm.innerHTML = `
                <div custom-anim animate-in></div>
                <div scope>
                    <div custom-anim animate-in></div>
                </div>
            `;
        });
        verifyCalls(customAnimateIn, [
            [elm.children[0], '']
        ]);
        customAnimateIn.mockClear();

        // listen animate-sequence
        await after(() => {
            elm.innerHTML = `
                <div animate-sequence=".item" animate-sequence-type="custom-anim">
                    <div custom-anim class="item"></div>
                </div>
            `;
        });
        await delay(50);
        verifyCalls(customAnimateIn, [
            [elm.querySelector('.item'), '']
        ]);
        customAnimateIn.mockClear();

        // listen is-animate-sequence
        await after(() => {
            $(elm.children[0]).append('<div is-animate-sequence custom-anim class="item"></div>');
        })
        await delay(50);
        verifyCalls(customAnimateIn, [
            [elm.querySelectorAll('.item')[1], '']
        ]);
    });
});

describe('animateOut', () => {
    it('should fire animationstart and animationcomplete event', async () => {
        const cb = mockFn();
        const elm = await mount(`<div animate-out></div>`);
        bindEvent(elm, 'animationstart', cb);
        bindEvent(elm, 'animationcomplete', cb);

        const promise = animateOut(elm, 'show');
        expect(cb).toBeCalledTimes(1);

        await promise;
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'animationstart', animationType: 'out', animationTrigger: 'show' }), elm],
            [expect.objectContaining({ type: 'animationcomplete', animationType: 'out', animationTrigger: 'show' }), elm],
        ]);
    });

    it('should not fire animationstart and animationcomplete event if no animation is triggered', async () => {
        const cb = mockFn();
        const elm = await mount(`<div></div>`);
        bindEvent(elm, 'animationstart', cb);
        bindEvent(elm, 'animationcomplete', cb);

        await animateOut(elm, 'show');
        expect(cb).not.toBeCalled();
    });

    it('should trigger custom animation when animate-in attribute contains animation name', async () => {
        const elm = await mount(`
            <div>
                <div class="tweening-in" animate-in="custom-anim" animate-out></div>
                <div class="tweening-in" animate-in="custom-anim" animate-out custom-anim="foo"></div>
            </div>
        `);
        await animateOut(elm, 'show');
        verifyCalls(customAnimateOut, [
            [elm.children[0], ''],
            [elm.children[1], 'foo'],
        ]);
    });

    it('should start outro animation for filtered elements and reset them', async () => {
        const elm = await mount(`
            <div>
                <div custom-anim animate-in animate-out animate-on="custom"></div>
                <div custom-anim animate-in animate-out animate-on="custom"></div>
                <div scope>
                    <div custom-anim animate-in animate-out animate-on="custom"></div>
                </div>
            </div>
        `);
        await animateIn(elm, 'custom');

        await animateOut(elm, 'custom', '[scope]', v => !v.previousElementSibling);
        expect(customAnimateOut).toBeCalledTimes(1);
        expect(elm.children[0]).not.toHaveClassName('tweening-in');
        expect(elm.children[1]).toHaveClassName('tweening-in');
        expect(elm.querySelector('[scope]>*')).toHaveClassName('tweening-in');
    });

    it('should start outro animation for filtered elements and reset all elements when trigger is show', async () => {
        const elm = await mount(`
            <div>
                <div custom-anim animate-in animate-out></div>
                <div custom-anim animate-in animate-out></div>
                <div scope>
                    <div custom-anim animate-in animate-out></div>
                </div>
            </div>
        `);
        await animateIn(elm, 'show');

        await animateOut(elm, 'show', '[scope]', v => !v.previousElementSibling);
        expect(customAnimateOut).toBeCalledTimes(1);
        expect(elm.children[0]).not.toHaveClassName('tweening-in');
        expect(elm.children[1]).not.toHaveClassName('tweening-in');
        expect(elm.querySelector('[scope]>*')).not.toHaveClassName('tweening-in');
    });

    it('should reset elements without outro animation', async () => {
        const elm = await mount(`<div custom-anim animate-in animate-on="custom"></div>`);
        await animateIn(elm, 'custom');
        expect(customAnimateIn).toBeCalledTimes(1);
        expect(elm).toHaveClassName('tweening-in');

        await animateOut(elm, 'custom');
        expect(customAnimateOut).not.toBeCalled();
        expect(elm).not.toHaveClassName('tweening-in');
    });

    it('should exclude supplied element when excludeSelf is true', async () => {
        const elm = await mount(`
            <div custom-anim animate-in animate-out>
                <div custom-anim animate-in animate-out></div>
                <div custom-anim animate-in animate-out></div>
            </div>
        `);
        await animateIn(elm, 'show');
        expect(customAnimateIn).toBeCalledTimes(3);

        await animateOut(elm, 'show', '', undefined, true);
        expect(customAnimateOut).toBeCalledTimes(2);
        expect(elm).toHaveClassName('tweening-in');
    });

    it('should cancel listening for new elements', async () => {
        const elm = await mount(`<div animate-in></div>`);
        await animateIn(elm, 'show', '', undefined, true);
        await animateOut(elm, 'show');

        await after(() => {
            elm.innerHTML = '<div custom-anim animate-in></div>';
        });
        expect(customAnimateIn).not.toBeCalled();
    });
});

describe('animate-sequence directive', () => {
    it('should start intro animation for matched element in order each after a time lapse', async () => {
        const elm = await mount(`
            <div animate-sequence=".item" animate-sequence-type="custom-anim">
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="not-item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];

        await animateIn(elm, 'show');
        verifyCalls(customAnimateIn, [
            [items[0], ''],
            [items[1], ''],
            [items[2], ''],
        ]);
        await animateOut(elm, 'show');
        expect(customAnimateOut).not.toBeCalled();
    });

    it('should start outro animation for matched element in order each after a time lapse when animate-out is present', async () => {
        const elm = await mount(`
            <div animate-out animate-sequence=".item" animate-sequence-type="custom-anim">
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="not-item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];

        await animateIn(elm, 'show');
        await animateOut(elm, 'show');
        verifyCalls(customAnimateOut, [
            [items[0], ''],
            [items[1], ''],
            [items[2], ''],
        ]);
    });

    it('should start animation for matched element in reversed order each after a time lapse', async () => {
        const elm = await mount(`
            <div animate-out animate-sequence=".item" animate-sequence-type="custom-anim" animate-sequence-reverse>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="not-item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];

        await animateIn(elm, 'show');
        verifyCalls(customAnimateIn, [
            [items[2], ''],
            [items[1], ''],
            [items[0], ''],
        ]);
        await animateOut(elm, 'show');
        verifyCalls(customAnimateOut, [
            [items[2], ''],
            [items[1], ''],
            [items[0], ''],
        ]);
    });

    it('should start animation for matched element in reversed order each after a time lapse - in', async () => {
        const elm = await mount(`
            <div animate-out animate-sequence=".item" animate-sequence-type="custom-anim" animate-sequence-reverse="in">
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="not-item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];

        await animateIn(elm, 'show');
        verifyCalls(customAnimateIn, [
            [items[2], ''],
            [items[1], ''],
            [items[0], ''],
        ]);
        await animateOut(elm, 'show');
        verifyCalls(customAnimateOut, [
            [items[0], ''],
            [items[1], ''],
            [items[2], ''],
        ]);
    });

    it('should start animation for matched element in reversed order each after a time lapse - out', async () => {
        const elm = await mount(`
            <div animate-out animate-sequence=".item" animate-sequence-type="custom-anim" animate-sequence-reverse="out">
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="item"></div>
                <div custom-anim class="not-item"></div>
            </div>
        `);
        const items = [...elm.querySelectorAll('.item')];

        await animateIn(elm, 'show');
        verifyCalls(customAnimateIn, [
            [items[0], ''],
            [items[1], ''],
            [items[2], ''],
        ]);
        await animateOut(elm, 'show');
        verifyCalls(customAnimateOut, [
            [items[2], ''],
            [items[1], ''],
            [items[0], ''],
        ]);
    });
});
