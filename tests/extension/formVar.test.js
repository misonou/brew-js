import $ from "jquery";
import { after, uniqueName, mount, initApp } from "../testUtil";
import { getVar, setVar } from "src/var";
import formVar from "src/extension/formVar";

beforeAll(() => initApp(formVar));

describe('formVar', () => {
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
