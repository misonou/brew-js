import { uniqueName, root, mount, body, initApp } from "./testUtil";
import { declareVar, getVar, getVarScope, resetVar, setVar } from "src/var";
import template from "src/extension/template";

beforeAll(async () => {
    await initApp(template);
});

describe('getVar', () => {
    it('should throw during initialization', () => {
        expect(() => getVar(root)).not.toThrow();
    });

    it('should return new object every time', () => {
        const a = getVar(root);
        const b = getVar(root);
        expect(a).not.toBe(b);
    });

    it('should return same values if none have changed', () => {
        const a = getVar(root);
        const b = getVar(root);
        expect(a).toEqual(b);
    });

    it('should handle detached element', () => {
        var elm = document.createElement('div');
        expect(() => getVar(elm)).not.toThrow();
    });

    it('should return own variables and second argument is true', async () => {
        const { child1, child2 } = await mount(`
            <div var="{ foo: 1 }">
                <div id="child1">
                    <div id="child2" var="{ bar: 1 }"></div>
                </div>
            </div>
        `);
        expect(getVar(child1, true)).toEqual({});
        expect(getVar(child2, true)).toEqual({ bar: 1 });
    });
});

describe('declareVar', () => {
    it('should declare variable on the supplied element', () => {
        // fix @ c94339c
        const varname = uniqueName();
        declareVar(root, { [varname]: 1 });
        declareVar(body, { [varname]: 2 });

        expect(getVar(root, varname)).toBe(1);
        expect(getVar(body, varname)).toBe(2);
        expect(getVarScope(varname, body)).toBe(body);
    });
});

describe('getDeclaredVar', () => {
    it('should not throw if attribute evaluates to non-object', async () => {
        const div = await mount(`
            <div var="1"></div>
        `);
        expect(getVar(div, true)).toEqual({});
    });
});

describe('setVar', () => {
    it('should evaluate set-var attribute as input if second parameter is falsy', async () => {
        const varname = uniqueName();
        const div = await mount(`
            <div set-var="{ ${varname}: 1 }"></div>
        `);
        expect(getVar(div, varname)).toBeUndefined();

        setVar(div);
        expect(getVar(div, varname)).toBe(1);
    });

    it('should update existing variable declared on parent elements', () => {
        // fix @ ffa0970
        const varname = uniqueName();
        setVar(root, varname, 1);
        setVar(body, varname, 2);

        expect(getVar(root, varname)).toBe(2);
    });

    it('should declare variable on the supplied element if it has not been declared on parent elements', () => {
        const varname = uniqueName();
        setVar(body, varname, 3);

        expect(getVar(body, varname)).toBe(3);
        expect(getVar(root, varname)).toBeUndefined();
        expect(console.warn).toBeCalledTimes(1);
    });

    it('should handle detached element', () => {
        var elm = document.createElement('div');
        expect(() => setVar(elm, { [uniqueName()]: 1 })).not.toThrow();
    });
});

describe('resetVar', () => {
    it('should reset variables declared on var attribute', async () => {
        const varname = uniqueName();
        const div = await mount(`
            <div var="{ ${varname}: 1 }"></div>
        `);
        setVar(div, varname, 2);
        expect(getVar(div, varname)).toBe(2);

        resetVar(div);
        expect(getVar(div, varname)).toBe(1);
    });

    it('should reset variables declared on var attribute to null', async () => {
        const varname = uniqueName();
        const div = await mount(`
            <div var="{ ${varname}: 1 }"></div>
        `);
        resetVar(div, true);
        expect(getVar(div, varname)).toBeNull();
    });

    it('should reset variables on descendant elements', async () => {
        const varname1 = uniqueName();
        const varname2 = uniqueName();
        const div = await mount(`
            <div var="{ ${varname1}: 1 }">
                <div var="{ ${varname2}: 1 }"></div>
            </div>
        `);
        setVar(div, varname1, 2);
        setVar(div.children[0], varname2, 2);
        expect(getVar(div, varname1)).toBe(2);
        expect(getVar(div.children[0], varname2)).toBe(2);

        resetVar(div);
        expect(getVar(div, varname1)).toBe(1);
        expect(getVar(div.children[0], varname2)).toBe(1);
    });
});
