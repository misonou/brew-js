import { addAnimateIn, addAnimateOut, animateIn } from "src/anim";
import { delay, mockFn, mount, verifyCalls } from "./testUtil";

const customAnimateIn = mockFn(() => delay(10));
const customAnimateOut = mockFn(() => delay(10));
addAnimateIn('custom-anim', customAnimateIn)
addAnimateOut('custom-anim', customAnimateOut)

describe('animate-sequence directive', () => {
    it('should start animation for matched element in order each after a time lapse', async () => {
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
    });

    it('should start animation for matched element in reversed order each after a time lapse', async () => {
        const elm = await mount(`
            <div animate-sequence=".item" animate-sequence-type="custom-anim" animate-sequence-reverse>
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
    });
});
