import { getDirectiveComponent, registerDirective, registerSimpleDirective } from "src/directive";
import { after, initApp, initBody, mockFn, verifyCalls } from "./testUtil";

const cbDestroy = mockFn();
const cbInit = mockFn((_, context) => {
    context.on('destroy', cbDestroy);
    return {};
});
const cbInitFoo = mockFn(() => cbDestoryFoo);
const cbInitBar = mockFn();
const cbDestoryFoo = mockFn();
const cbDestoryBar = mockFn();

beforeAll(() => {
    return initApp(() => {
        registerDirective('test', '.test', {
            component: cbInit,
            directives: {
                strValue: { attribute: 'str-value' },
                numValue: { attribute: 'num-value', type: 'number' },
                boolValue: { attribute: 'bool-value', type: 'boolean' },
            }
        });
        registerSimpleDirective('testFoo', 'test-foo', cbInitFoo);
        registerSimpleDirective('testBar', 'test-bar', cbInitBar, cbDestoryBar);
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

    it('should map attribute value to properties', async () => {
        const { div } = initBody(`<div id="div" class="test" str-value="foo" num-value="1" bool-value></div>`);
        getDirectiveComponent(div).test;

        const context = cbInit.mock.calls[0][1];
        expect(context).toHaveProperty('strValue', 'foo');
        expect(context).toHaveProperty('numValue', 1);
        expect(context).toHaveProperty('boolValue', true);

        await after(() => {
            div.removeAttribute('str-value');
            div.removeAttribute('num-value');
            div.removeAttribute('bool-value');
        });
        expect(context).toHaveProperty('strValue', null);
        expect(context).toHaveProperty('numValue', null);
        expect(context).toHaveProperty('boolValue', false);
    });

    it('should update attribute if mapped properties are updated', async () => {
        const { div } = initBody(`<div id="div" class="test" str-value="foo" num-value="1" bool-value></div>`);
        getDirectiveComponent(div).test;

        const context = cbInit.mock.calls[0][1];
        await after(() => {
            context.strValue = '';
            context.numValue = 0;
        });
        expect(div).toHaveAttribute('str-value', '');
        expect(div).toHaveAttribute('num-value', '0');

        await after(() => {
            context.strValue = null;
            context.numValue = null;
            context.boolValue = false;
        });
        expect(div).not.toHaveAttribute('str-value');
        expect(div).not.toHaveAttribute('num-value');
        expect(div).not.toHaveAttribute('bool-value');
    });

    it('should normalize value when setting mapped properties', async () => {
        const { div } = initBody(`<div id="div" class="test"></div>`);
        getDirectiveComponent(div).test;

        const context = cbInit.mock.calls[0][1];

        context.strValue = 1;
        expect(context.strValue).toBe('1');
        context.strValue = 0;
        expect(context.strValue).toBe('0');

        context.numValue = true;
        expect(context.numValue).toBe(1);
        context.numValue = false;
        expect(context.numValue).toBe(0);

        context.boolValue = 1;
        expect(context.boolValue).toBe(true);
        context.boolValue = 0;
        expect(context.boolValue).toBe(false);
    });
});

describe('registerSimpleDirective', () => {
    it('should expose boolean property', () => {
        const { div } = initBody(`<div id="div"></div>`);
        expect(getDirectiveComponent(div).testFoo).toBe(false);
        div.setAttribute('test-foo', '');
        expect(getDirectiveComponent(div).testFoo).toBe(true);
        div.removeAttribute('test-foo');
        expect(getDirectiveComponent(div).testFoo).toBe(false);
    });

    it('should set and delete attibute when property is set', () => {
        const { div } = initBody(`<div id="div"></div>`);
        getDirectiveComponent(div).testFoo = true;
        expect(div).toHaveAttribute('test-foo', '');
        getDirectiveComponent(div).testFoo = false;
        expect(div).not.toHaveAttribute('test-foo');
    });

    it('should invoke init and dispose callback', () => {
        const { div } = initBody(`<div id="div"></div>`);
        getDirectiveComponent(div).testFoo = true;
        getDirectiveComponent(div).testBar = true;
        verifyCalls(cbInitFoo, [[div]]);
        verifyCalls(cbInitBar, [[div]]);

        getDirectiveComponent(div).testFoo = false;
        getDirectiveComponent(div).testBar = false;
        verifyCalls(cbDestoryFoo, [[]]);
        verifyCalls(cbDestoryBar, [[div]]);
        expect(cbInitFoo).toBeCalledTimes(1);
        expect(cbInitBar).toBeCalledTimes(1);
    });
});
