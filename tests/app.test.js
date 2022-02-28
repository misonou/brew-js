import { addDetect, app, install } from "src/app";
import router from "src/extension/router";
import { setBaseUrl } from "src/util/path";
import { resolve } from "zeta-dom/util";
import { after, bindEvent, delay, initApp, initBody, mockFn, mount, root, uniqueName, verifyCalls, _ } from "./testUtil";

const { objectContaining } = expect;

beforeAll(() => initApp(router));

describe('app', () => {
    it('should prepend baseUrl to hyperlinks and resources', async () => {
        setBaseUrl('/foo');
        const div = await mount(`
            <div>
                <img src="/bar.png" />
                <img data-src="/bar.png" />
                <video src="/bar.mp4"></video>
                <a href="/bar"></a>
                <div data-bg-src="/bar.png"></div>
            </div>
        `);
        expect(div.children[0].src).toEqual('http://localhost/foo/bar.png');
        expect(div.children[1].src).toEqual('http://localhost/foo/bar.png');
        expect(div.children[2].src).toEqual('http://localhost/foo/bar.mp4');
        expect(div.children[3].href).toEqual('http://localhost/foo/bar');
        expect(div.children[4].style.backgroundImage).toEqual('url(/foo/bar.png)');
    });

    it('should prevent default action of form submission', async () => {
        const form = await mount('<form></form>');
        form.addEventListener('submit', (e) => {
            expect(e.defaultPrevented).toBeTruthy();
        });
        await after(() => {
            form.submit();
        });
        expect.assertions(1);
    });
});

describe('app.emit', () => {
    it('should emit event to root element if element is not supplied', async () => {
        const cb = mockFn();
        bindEvent('testEvent', cb);
        await after(() => {
            app.emit('testEvent');
        });
        expect(cb).toBeCalledWith(objectContaining({ type: 'testEvent', target: app.element }), _);
    });
});

describe('app.define', () => {
    it('should copy property descriptors from supplied object', () => {
        const obj = {
            testValue: 1,
            get testAccessor() {
                return 1;
            },
            set testAccessor(value) {
            }
        };
        Object.defineProperty(obj, 'freezedValue', { value: 2 });
        app.define(obj);

        expect(Object.getOwnPropertyDescriptor(app, 'testValue')).toEqual(Object.getOwnPropertyDescriptor(obj, 'testValue'));
        expect(Object.getOwnPropertyDescriptor(app, 'testAccessor')).toEqual(Object.getOwnPropertyDescriptor(obj, 'testAccessor'));
        expect(Object.getOwnPropertyDescriptor(app, 'freezedValue')).toEqual(objectContaining({ writable: false, configurable: false }));
    });

    it('should set function-valued property to non-enumerable', () => {
        const obj = {
            testMethod: () => { }
        };
        app.define(obj);

        const testMethodDescriptor = Object.getOwnPropertyDescriptor(obj, 'testMethod');
        expect(Object.getOwnPropertyDescriptor(app, 'testMethod')).toEqual({ ...testMethodDescriptor, enumerable: false });
    });
});

describe('app.detect', () => {
    it('should execute feature detection callback and resolves with the result', async () => {
        const id = uniqueName();
        const cb = mockFn().mockResolvedValue(42);
        addDetect(id, cb);

        await after(() => {
            app.detect([id], (result) => {
                expect(result).toEqual(objectContaining({ [id]: 42 }));
            });
        });
        expect(cb).toBeCalledTimes(1);
        expect.assertions(2);
    });

    it('should resolves as false when feature detection callback rejects', async () => {
        const id = uniqueName();
        const cb = mockFn().mockRejectedValue(42);
        addDetect(id, cb);

        await after(() => {
            app.detect([id], (result) => {
                expect(result).toEqual(objectContaining({ [id]: false }));
            });
        });
        expect(cb).toBeCalledTimes(1);
        expect.assertions(2);
    });

    it('should expose detection result via app.supports property', async () => {
        const id = uniqueName();
        const cb = mockFn().mockResolvedValue(42);
        addDetect(id, cb);

        await after(() => {
            app.detect(id);
        });
        expect(app.supports[id]).toEqual(42);
    });

    it('should ignore unsupported detection', async () => {
        const id = uniqueName();
        await after(() => {
            app.detect([id], (result) => {
                expect(result).not.toHaveProperty(id);
            });
        });
        expect.assertions(1);
    });
});

describe('app.when', () => {
    it('should fire callback if resolved value is truthy', async () => {
        const cb = mockFn();
        app.when(true, cb);
        app.when(resolve(true), cb);
        app.when(false, cb);
        app.when(resolve(false), cb);

        await delay();
        expect(cb).toBeCalledTimes(2);
    });
});

describe('app.on', () => {
    it('should only fire callback when target is not descendents if noChildren is true', async () => {
        const cb = mockFn();
        const div = await mount(`<div></div>`);

        app.on(root, 'testEvent1', cb, true);
        app.emit('testEvent1', div, null, true);
        app.emit('testEvent1', root, null, true);

        app.on(root, { testEvent2: cb }, true);
        app.emit('testEvent2', div, null, true);
        app.emit('testEvent2', root, null, true);

        app.on(root, 'testEvent3 testEvent4', cb, true);
        app.emit('testEvent3', div, null, true);
        app.emit('testEvent3', root, null, true);
        app.emit('testEvent4', div, null, true);
        app.emit('testEvent4', root, null, true);

        verifyCalls(cb, [
            [objectContaining({ type: 'testEvent1', target: root }), _],
            [objectContaining({ type: 'testEvent2', target: root }), _],
            [objectContaining({ type: 'testEvent3', target: root }), _],
            [objectContaining({ type: 'testEvent4', target: root }), _],
        ]);
    });
});

describe('app.matchPath', () => {
    it('should fire callback if path of mounted element matches given route', async () => {
        const { test1, test2 } = initBody(`
            <div switch>
                <div id="test1" match-path="/test-1"></div>
                <div id="test2" match-path="/test-nested/default"></div>
            </div>
        `);
        app.useRouter({
            baseUrl: '/',
            routes: ['/*']
        });
        const cb1 = mockFn();
        const cb2 = mockFn();
        const cb3 = mockFn();
        const cb4 = mockFn();
        app.matchPath('/test-1', cb1);
        app.matchPath('/test-2', cb2);
        app.matchPath('/test-nested/*', cb3);
        app.matchPath('/test-nested/{id?}', cb3);
        app.matchPath('/test-nested/*', 'section', cb4);

        await app.navigate('/test-1');
        expect(cb1).toBeCalledWith(test1);
        expect(cb2).not.toBeCalled();

        await app.navigate('/test-nested/default');
        verifyCalls(cb3, [[test2], [test2]]);
        expect(cb4).not.toBeCalled();
    });
});

describe('install', () => {
    it('should throw if callback is not callable', () => {
        expect(() => install(uniqueName(), 1)).toThrow();
    });

    it('should create a method on app instance to initiate extension', () => {
        const cb = mockFn();
        install('dummy', cb);

        expect(app.useDummy).toBeInstanceOf(Function);
        app.useDummy({ foo: 'bar' });
        expect(cb).toBeCalledWith(app, { foo: 'bar' });
    });
});

describe('addDetect', () => {
    it('should throw if callback is not callable', () => {
        expect(() => addDetect(uniqueName(), 1)).toThrow();
    });
});
