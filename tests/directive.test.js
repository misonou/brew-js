import { getDirectiveComponent, registerDirective } from "src/directive";
import { after, delay, initApp, initBody, mockFn, uniqueName } from "./testUtil";

const cbDestroy = mockFn();
const cbInit = mockFn((_, context) => {
    context.on('destroy', cbDestroy);
    return {};
});

beforeAll(() => {
    return initApp(() => {
        registerDirective('test', '.test', {
            component: cbInit
        });
    });
});

describe('registerDirective', () => {
    it('should expose plugin with specified key', async () => {
        const { div } = initBody(`<div id="div" class="test"></div>`);
        const obj = getDirectiveComponent(div).test;
        expect(cbInit).toBeCalledTimes(1);
        expect(obj).toBe(cbInit.mock.results[0].value);
    });

    it('should emit destroy event when element is detached', async () => {
        const { div } = initBody(`<div id="div" class="test"></div>`);
        getDirectiveComponent(div).test;

        await after(() => div.remove());
        expect(cbDestroy).toBeCalledTimes(1);
    });

    it('should emit destroy event when element no longer matches selector', async () => {
        const { div } = initBody(`<div id="div" class="test"></div>`);
        getDirectiveComponent(div).test;

        await after(() => div.classList.remove('test'));
        expect(cbDestroy).toBeCalledTimes(1);
    });

    it('should initialize component again after previous instance is destroyed', async () => {
        const { div } = initBody(`<div id="div" class="test"></div>`);
        getDirectiveComponent(div).test;

        await after(() => div.classList.remove('test'));
        div.classList.add('test');
        getDirectiveComponent(div).test;
        expect(cbInit).toBeCalledTimes(2);
    });
});
