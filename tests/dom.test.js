import $ from "jquery";
import { uniqueName, root, after, mount, initApp } from "./testUtil";
import { addTemplate } from "src/dom";
import { setVar } from "src/var";

beforeAll(() => initApp());

describe('apply-template directive', () => {
    it("should re-apply template when value of parent variable has changed", async () => {
        // fix @ 86c464d
        const varname = uniqueName();
        const templateName1 = uniqueName();
        const templateName2 = uniqueName();
        addTemplate(templateName1, '<div class="template-1"></div>');
        addTemplate(templateName2, '<div class="template-2"></div>');
        setVar(root, varname, templateName1);

        const div = await mount(`
            <div apply-template="${varname}"></div>
        `);
        expect(div.getAttribute('class')).toBe('template-1');

        await after(() => {
            setVar(root, varname, templateName2);
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
