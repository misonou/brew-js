import $ from "jquery";
import { jest } from "@jest/globals";
import { uniqueName, root, after, mount, initApp, mockFn, verifyCalls } from "../testUtil";
import { getVar, setVar } from "src/var";
import template from "src/extension/template";
import { setBaseUrl } from "src/util/path";
import { notifyAsync } from "zeta-dom/domLock";
import { errorWithCode } from "zeta-dom/util";
import { fireEvent, screen } from "@testing-library/dom";
import dom from "zeta-dom/dom";

const isElementActive = mockFn();

/** @type {Brew.AppInstance<{}>} */
var app;

beforeAll(async () => {
    $(`
        <div brew-template="template-1" class="template-1"></div>
        <div brew-template="template-2" class="template-2"></div>
        <div brew-template="template-3">
            <div><content for=".foo"></content></div>
            <div><content></content></div>
        </div>
    `).appendTo(document.body);
    app = await initApp(template);
    app.testMethod = mockFn();
    app.isElementActive = isElementActive;
});

beforeEach(() => {
    setBaseUrl('/');
    isElementActive.mockReset().mockImplementation(() => true);
});

describe('apply-template directive', () => {
    it('should replace <content> slot with matched elements', async () => {
        const div = await mount(`
            <div apply-template="template-3">
                <p class="foo">foo</p>
                <p class="bar">bar</p>
            </div>
        `);
        expect(div).toMatchSnapshot();
    });

    it("should re-apply template when value of parent variable has changed", async () => {
        // fix @ 86c464d
        const varname = uniqueName();
        setVar(root, varname, 'template-1');

        const div = await mount(`
            <div apply-template="${varname}"></div>
        `);
        expect(div.getAttribute('class')).toBe('template-1');

        await after(() => {
            setVar(root, varname, 'template-2');
        });
        expect(div.getAttribute('class')).toBe('template-2');
    });
});

describe('auto-var directive', () => {
    it('should set computed variables on mounted', async () => {
        await mount(`
            <div var="{ foo: 1 bar: 0 }" auto-var="{ bar: [ foo + 1 ] }"></div>
        `, (elm) => {
            expect(getVar(elm, 'bar')).toBe(2);
        });
        expect.assertions(1);
    });

    it('should set computed variables on before statechange event', async () => {
        const cb = mockFn();
        const elm = await mount(`
            <div var="{ foo: 1 bar: 0 }" auto-var="{ bar: [ foo + 1 ] }"></div>
        `);
        app.on(elm, 'statechange', cb);

        await after(() => setVar(elm, 'foo', 2));
        expect(getVar(elm, 'bar')).toBe(3);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0]).toEqual(expect.objectContaining({
            newValues: { foo: 2, bar: 3 },
            oldValues: { foo: 1, bar: 2 },
        }))
    });
});

describe('foreach directive', () => {
    it("should handle identical items correctly", async () => {
        // fix @ 5276e38
        const varname = uniqueName();
        const div = await mount(`
            <div foreach="${varname}">
                <p template>{{$foreach}}</p>
            </div>
        `);

        await after(() => {
            setVar(div, varname, [1, 1]);
        });
        expect($('p', div).get().map(v => v.textContent)).toEqual(['1', '1']);

        await after(() => {
            setVar(div, varname, [1, 1, 1]);
        });
        expect($('p', div).get().map(v => v.textContent)).toEqual(['1', '1', '1']);
    });

    it("should handle nested foreach correctly", async () => {
        // fix @ 5684287, f1819f5
        const varname = uniqueName();
        const div = await mount(`
            <div foreach="${varname}">
                <div foreach="$foreach.items">
                    <p template>{{$foreach}}</p>
                </div>
            </div>
        `);

        await after(() => {
            setVar(root, varname, [
                { items: [1, 2, 3] }
            ]);
        });
        expect($('p', div).get().map(v => v.textContent)).toEqual(['1', '2', '3']);
    });
});

describe('template directive', () => {
    it('should update normal attribute', async () => {
        const div = await mount(`
            <div var="{ foo: bar }" template title="{{foo}}"></div>
        `);
        expect(div.getAttribute('title')).toBe('bar');
    });

    it('should handle boolean mapped attribute', async () => {
        // fix @ 48f8a0b, 073730e, 144b820
        const varname = uniqueName();
        const div = await mount(`
            <div>
                <button template disabled="{{${varname}.trueValue}}"></button>
                <button template disabled="{{${varname}.falseValue}}"></button>
                <button template disabled="{{${varname}.undefinedValue}}"></button>
            </div>
        `);

        await after(() => {
            setVar(root, varname, {
                trueValue: true,
                falseValue: false
            });
        });
        // @ts-ignore
        expect($('button', div).get().map(v => v.disabled)).toEqual([true, false, false]);
    });

    it('should support rich-text child content', async () => {
        const div = await mount(`
            <div var="{ html: null }" template>{{&html}}&lt;b&gt;</div>
        `);
        await after(() => {
            setVar(div, 'html', '<b>test</b>');
        });
        expect(div.innerHTML).toBe('<b>test</b>&lt;b&gt;');
    });
});

describe('switch directive', () => {
    it('should update active class to matchable element', async () => {
        const elm = await mount(`
            <div var="{ foo: baz }" switch="foo">
                <div data-testid="bar" match-foo="bar">bar</div>
                <div data-testid="baz" match-foo="baz">baz</div>
            </div>
        `);
        expect(screen.getByTestId('baz')).toHaveClassName('active');
        expect(screen.getByTestId('bar')).not.toHaveClassName('active');
    });

    it('should default to first matchable element', async () => {
        const elm = await mount(`
            <div var="{ foo: null }" switch="foo">
                <div match-foo="bar">bar</div>
                <div match-foo="baz" default>baz</div>
            </div>
        `);
        expect(getVar(elm, 'foo')).toBe('baz');
    });

    it('should default to first matchable element if there is no element marked with default', async () => {
        const elm = await mount(`
            <div var="{ foo: null }" switch="foo">
                <div match-foo="bar">bar</div>
                <div match-foo="baz">baz</div>
            </div>
        `);
        expect(getVar(elm, 'foo')).toBe('bar');
    });

    it('should handle nested switch', async () => {
        const elm = await mount(`
            <div var="{ foo: baz }" switch="foo">
                <div default match-foo="bar">bar</div>
                <div switch="foo">
                    <div match-foo="bar">bar</div>
                    <div match-foo="baz">baz</div>
                </div>
            </div>
        `);
        expect(getVar(elm, 'foo')).toBe('bar');
    });

    it("should not throw exception when there is no matching children", () => {
        // fix @ 5c7fc17
        expect(async () => {
            await mount(`
                <div switch="${uniqueName()}"></div>
            `);
        }).not.toThrow();
    });
});

describe('set-class directive', () => {
    it('should update class names of an element', async () => {
        const elm = await mount(`<div var="{ boolValue: false strValue: null }" set-class="{ bool: boolValue str: strValue }"></div>`);

        await after(() => setVar(elm, { boolValue: true, strValue: 'foo' }));
        expect(elm).toHaveClassName('bool');
        expect(elm).toHaveClassName('str');
        expect(elm).toHaveClassName('str-foo');

        await after(() => setVar(elm, { boolValue: false, strValue: null }));
        expect(elm).not.toHaveClassName('bool');
        expect(elm).not.toHaveClassName('str');
        expect(elm).not.toHaveClassName('str-foo');
    });
});

describe('set-style directive', () => {
    it('should update styles of an element', async () => {
        const elm = await mount(`<div var="{ color: null }" set-style="color: {{color}}"></div>`);
        expect(elm.style.color).toBe('');

        await after(() => setVar(elm, { color: 'red' }));
        expect(elm.style.color).toBe('red');
    });

    it('should prepend baseUrl to background image', async () => {
        const elm = await mount(`<div var="{ image: null }" set-style="background-image: url('{{image}}')"></div>`);
        expect(elm.style.backgroundImage).toBe('url()');

        setBaseUrl('/foo')
        await after(() => setVar(elm, { image: '/bar.png' }));
        expect(elm.style.backgroundImage).toBe('url(/foo/bar.png)');
    });
});

describe('loading-scope directive', () => {
    it('should update loading variable', async () => {
        const elm = await mount(`<div loading-scope></div>`);
        let resolve;

        await after(() => notifyAsync(elm, new Promise(res => resolve = res)));
        expect(getVar(elm, 'loading')).toBe(true);

        await after(() => resolve());
        expect(getVar(elm, 'loading')).toBe(false);
    });
});

describe('error-scope directive', () => {
    it('should update error variable to error code', async () => {
        const elm = await mount(`<div error-scope></div>`);
        await after(() => notifyAsync(elm, Promise.reject(errorWithCode('test'))));
        expect(getVar(elm, 'error')).toBe('test');
    });

    it('should update error variable to error message', async () => {
        const elm = await mount(`<div error-scope></div>`);
        await after(() => notifyAsync(elm, Promise.reject(new Error('test'))));
        expect(getVar(elm, 'error')).toBe('test');
    });

    it('should update error variable to true for error with empty message', async () => {
        const elm = await mount(`<div error-scope></div>`);
        await after(() => notifyAsync(elm, Promise.reject(new Error())));
        expect(getVar(elm, 'error')).toBe(true);
    });

    it('should clear error variable on asyncStart event', async () => {
        const elm = await mount(`<div error-scope></div>`);
        setVar(elm, 'error', 'test');
        notifyAsync(elm, Promise.reject(errorWithCode('test')));
        expect(getVar(elm, 'error')).toBe(null);
    });
});

describe('form-var directive', () => {
    it('should update variable when input value was changed', async () => {
        const varname = uniqueName();
        const form = await mount(`
            <form form-var>
                <input type="text" name="${varname}" value="1">
            </form>
        `);
        expect(getVar(form, varname)).toBe('1');

        await after(() => {
            form.children[0].setAttribute('value', '2');
        });
        expect(getVar(form, varname)).toBe('2');
    });

    it('should update value object when input value was changed through attribute', async () => {
        // fix @ 6a3ef92
        const varname = uniqueName();
        const form = await mount(`
            <form form-var="${varname}">
                <input type="text" name="field" value="1">
            </form>
        `);
        const values1 = getVar(form, varname);
        expect(values1).toEqual({ field: '1' });

        await after(() => {
            form.children[0].setAttribute('value', '2');
        });
        const values2 = getVar(form, varname);
        expect(values2).toEqual({ field: '2' });
        expect(values1).not.toBe(values2);
    });

    it('should keep custom properties on value object', async () => {
        // fix @ 3f818d1
        const varname = uniqueName();
        const form = await mount(`
            <form form-var="${varname}">
                <input type="text" name="field" value="1">
            </form>
        `);

        await after(() => {
            setVar(form, varname, { ...getVar(form, varname), customData: '3' });
        });
        expect(getVar(form, varname)).toEqual({ field: '1', customData: '3' });

        await after(() => {
            form.children[0].setAttribute('value', '2');
        });
        expect(getVar(form, varname)).toEqual({ field: '2', customData: '3' });
    });

    it('should add entry to data object when input is added', async () => {
        const varname = uniqueName();
        const form = await mount(`
            <form form-var="${varname}">
                <input type="text" name="field1" value="1">
            </form>
        `);
        const values1 = getVar(form, varname);

        await after(() => {
            $(form).append('<input type="text" name="field2" value="1">');
        });
        const values2 = getVar(form, varname);
        expect(values1).toHaveProperty('field1');
        expect(values1).not.toHaveProperty('field2');
        expect(values2).toHaveProperty('field1');
        expect(values2).toHaveProperty('field2');
    });

    it('should reset form only when variable scope is inactive', async () => {
        const { parent, form, input } = await mount(`
            <div id="parent" var="{ data: null }">
                <form id="form" form-var="data">
                    <input id="input" type="text" name="field1">
                </form>
            </div>
        `);
        input.value = '1';

        dom.emit('reset', form);
        expect(input.value).toBe('1');
        verifyCalls(isElementActive, [
            [parent]
        ]);

        isElementActive.mockImplementationOnce(() => false);
        dom.emit('reset', form);
        expect(input.value).toBe('');
    });

    it('should reset individual input in non-aggregating mode', async () => {
        const { parent, form, input1, input2 } = await mount(`
            <div id="parent" var="{ field1: null }">
                <form id="form" form-var var="{ field2: null }">
                    <input id="input1" type="text" name="field1">
                    <input id="input2" type="text" name="field2">
                </form>
            </div>
        `);
        input1.value = '1';
        input2.value = '2';

        dom.emit('reset', form);
        expect(input1.value).toBe('1');
        expect(input2.value).toBe('2');
        verifyCalls(isElementActive, [
            [parent],
            [form]
        ]);

        isElementActive.mockImplementation((elm) => elm === form ? false : true);
        dom.emit('reset', form);
        expect(input1.value).toBe('1');
        expect(input2.value).toBe('');
    });
});

describe('validate directive', () => {
    it('should validate form by native method', async () => {
        const { form, button } = await mount(`
            <form id="form">
                <input name="foo" required />
                <button id="button" validate="#form"></button>
            </form>
        `);
        const checkValidity = jest.spyOn(form, 'checkValidity');

        await after(() => fireEvent.click(button));
        expect(checkValidity).toBeCalledTimes(1);
        expect(checkValidity.mock.results[0].value).toBe(false);
    });

    it('should validate form by validate event', async () => {
        const { form, button } = await mount(`
            <form id="form">
                <input name="foo" />
                <button id="button" validate="#form"></button>
            </form>
        `);
        const cb = mockFn().mockResolvedValue(false);
        const checkValidity = jest.spyOn(form, 'checkValidity');
        dom.on(form, 'validate', cb);

        await after(() => fireEvent.click(button));
        expect(cb).toBeCalledTimes(1);
        expect(checkValidity).not.toBeCalled();
    });
});

describe('context-method directive', () => {
    it('should convert method name to camel case', async () => {
        const elm = await mount(
            `<div context-method="test-method"></div>
        `);
        await after(() => fireEvent.click(elm));
        expect(app.testMethod).toBeCalledTimes(1);
    });

    it('should call method with argument', async () => {
        const elm = await mount(`
            <div var="{ foo: test }" context-method="test-method" method-args="foo"></div>
        `);
        await after(() => fireEvent.click(elm));
        verifyCalls(app.testMethod, [['test']]);
    });

    it('should call method with multiple arguments', async () => {
        const elm = await mount(`
            <div var="{ foo: test }" context-method="test-method" method-args="foo | 1"></div>
        `);
        await after(() => fireEvent.click(elm));
        verifyCalls(app.testMethod, [['test', 1]]);
    });

    it('should call method with form data', async () => {
        const { button } = await mount(`
            <form>
                <input name="foo" value="test"/>
                <button id="button" context-method="test-method"></button>
            </form>
        `);
        await after(() => fireEvent.click(button));
        verifyCalls(app.testMethod, [[{ foo: 'test' }]]);
    });

    it('should call method with form data specified by context-form', async () => {
        const { button } = await mount(`
            <div>
                <form id="form">
                    <input name="foo" value="test"/>
                </form>
                <button id="button" context-method="test-method" context-form="#form"></button>
            </div>
        `);
        await after(() => fireEvent.click(button));
        verifyCalls(app.testMethod, [[{ foo: 'test' }]]);
    });

    it('should validate form by native method', async () => {
        const { form, button } = await mount(`
            <form id="form">
                <input name="foo" required />
                <button id="button" context-method="test-method"></button>
            </form>
        `);
        const checkValidity = jest.spyOn(form, 'checkValidity');

        await after(() => fireEvent.click(button));
        expect(checkValidity).toBeCalledTimes(1);
        expect(checkValidity.mock.results[0].value).toBe(false);
        expect(app.testMethod).not.toBeCalled();
    });

    it('should validate form by validate event', async () => {
        const { form, button } = await mount(`
            <form id="form">
                <input name="foo" />
                <button id="button" context-method="test-method"></button>
            </form>
        `);
        const cb = mockFn().mockResolvedValue(false);
        const checkValidity = jest.spyOn(form, 'checkValidity');
        dom.on(form, 'validate', cb);

        await after(() => fireEvent.click(button));
        expect(cb).toBeCalledTimes(1);
        expect(checkValidity).not.toBeCalled();
        expect(app.testMethod).not.toBeCalled();
    });

    it('should not throw for inexist method', async () => {
        const elm = await mount(
            `<div context-method="unknown-method"></div>
        `);
        expect(() => fireEvent.click(elm)).not.toThrow();
    });
});
