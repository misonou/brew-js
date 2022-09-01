import $ from "jquery";
import { uniqueName, root, after, mount, initApp } from "../testUtil";
import { getVar, setVar } from "src/var";
import template from "src/extension/template";

beforeAll(() => {
    $(`
        <div brew-template="template-1" class="template-1"></div>
        <div brew-template="template-2" class="template-2"></div>
    `).appendTo(document.body);
    return initApp(template);
});

describe('apply-template directive', () => {
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
    it("should not throw exception when there is no matching children", () => {
        // fix @ 5c7fc17
        expect(async () => {
            await mount(`
                <div switch="${uniqueName()}"></div>
            `);
        }).not.toThrow();
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
});
