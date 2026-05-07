import { addDetect, addExtension, app, install } from "src/app";
import router from "src/extension/htmlRouter";
import template from "src/extension/template";
import { defineObservableProperty, resolve } from "zeta-dom/util";
import { after, bindEvent, delay, initApp, initBody, mockFn, mount, root, uniqueName, verifyCalls, _ } from "./testUtil";
import brew from "src/disposable";

const { objectContaining } = expect;

const initAutoCb = [];
const initDepCb = [];
const ext0 = addExtension(true, 'ext0', (app, options) => initAutoCb.push(['ext0', options]) && app.define({ ext0Inited: true }));
const ext1 = addExtension('ext1', ['ext2'], (app, options) => initDepCb.push(['ext1', options]) && app.define({ ext1Inited: true }));
const ext2 = addExtension('ext2', ['?ext3'], (app, options) => initDepCb.push(['ext2', options]) && app.define({ ext2Inited: true }));

beforeAll(() => initApp(router, template, ext0, ext1, ext2, function (app) {
    app.useHtmlRouter({
        baseUrl: '/',
        routes: ['/*']
    });
    app.useExt1({ key1: true });
    app.useExt2({ key2: true });
    defineObservableProperty(app, 'testProp', 1, (value) => (value * 2) || 1);
}));

beforeEach(async () => {
    app.testProp = 0;
    await delay();
});

describe('brew', () => {
    it('should throw when called second time', () => {
        const cb = mockFn();
        expect(() => brew(cb)).toThrow();
        expect(cb).not.toBeCalled();
    });
});

describe('app.emit', () => {
    it('should emit event to app if element is root', async () => {
        const cb = mockFn();
        bindEvent(app, 'testEvent', cb);
        app.emit('testEvent', root);
        expect(cb).toBeCalledWith(objectContaining({ type: 'testEvent', target: root }), _);
    });

    it('should emit event to app if bubbles is true', async () => {
        const cb = mockFn();
        bindEvent(app, 'testEvent', cb);
        app.emit('testEvent', document.body, null, true);
        expect(cb).toBeCalledWith(objectContaining({ type: 'testEvent', target: document.body }), _);

        cb.mockClear();
        app.emit('testEvent', document.body, null, { bubbles: true });
        expect(cb).toBeCalledWith(objectContaining({ type: 'testEvent', target: document.body }), _);
    });

    it('should emit event to element if element is supplied', async () => {
        const cb = mockFn();
        bindEvent(root, 'testEvent', cb);
        app.emit('testEvent', root);
        expect(cb).toBeCalledWith(objectContaining({ type: 'testEvent', target: root }), _);
    });

    it('should not emit event to root element if element is not supplied', async () => {
        const cb = mockFn();
        bindEvent(root, 'testEvent', cb);
        app.emit('testEvent');
        expect(cb).not.toBeCalled();
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

describe('addExtension', () => {
    it('should init extension automatically when autoInit is true', () => {
        expect(initAutoCb).toEqual([['ext0', {}]]);
    });

    it('should init dependent extensions in correct order', () => {
        expect(initDepCb).toEqual([
            ['ext2', { key2: true }],
            ['ext1', { key1: true }],
        ]);
    });

    it('should throw when use callback is called in second time', () => {
        expect(() => app.useExt2()).toThrow();
        expect(initDepCb).toEqual([
            ['ext2', { key2: true }],
            ['ext1', { key1: true }],
        ]);
    });
});

describe('addDetect', () => {
    it('should throw if callback is not callable', () => {
        expect(() => addDetect(uniqueName(), 1)).toThrow();
    });
});

describe('brew.disposableWith', () => {
    it('should create a disposable app instance', async () => {
        const childApp = brew.disposableWith(app)(() => { });
        expect(childApp).not.toBe(app);
        expect(childApp).toBeInstanceOf(app.constructor);
        expect(childApp.readyState).toBe('init');

        await childApp.ready;
        expect(childApp.readyState).toBe('ready');

        const isolatedApp = brew.disposableWith()(() => { });
        expect(isolatedApp).not.toBe(app);
        expect(isolatedApp).not.toBe(childApp);
        expect(isolatedApp).toBeInstanceOf(app.constructor);
        expect(isolatedApp.readyState).toBe('init');

        await isolatedApp.ready;
        expect(isolatedApp.readyState).toBe('ready');
    });

    it('should not inflict with global app instance when does not extend from it', async () => {
        const isolatedApp = brew.disposableWith(ext2)((app) => {
            app.useExt2();
        });
        await isolatedApp.ready;
        expect(isolatedApp.ext2Inited).toBe(true);

        expect(isolatedApp).not.toHaveProperty('useExt0');
        expect(isolatedApp).not.toHaveProperty('useExt1');
        expect(isolatedApp).not.toHaveProperty('ext0Inited');
        expect(isolatedApp).not.toHaveProperty('ext1Inited');

        const cb = mockFn();
        isolatedApp.on('testEvent', cb);
        app.emit('testEvent');
        expect(cb).not.toBeCalled();
    });

    it('should throw if extension is already initialized on global app instance', () => {
        brew.disposableWith(app, ext1)((app) => {
            expect(() => app.useExt1()).toThrow();
        });
        expect.assertions(1);
    });

    it('should invoke dispose handler on disposal', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.onDispose(cb);
        childApp.dispose();
        expect(cb).toHaveBeenCalledTimes(1);
        cb.mockClear();

        childApp.dispose();
        expect(cb).not.toBeCalled();
    });

    it('should access properties defined on global app instance', () => {
        const childApp = brew.disposableWith(app)(() => { });
        expect(childApp.ext0Inited).toBe(true);
        expect(childApp.ext1Inited).toBe(true);
        expect(childApp.ext2Inited).toBe(true);
    });

    it('should delete own properties', () => {
        const childApp = brew.disposableWith(app, { childProp: 2 })(() => { });
        expect(childApp.childProp).toBe(2);

        delete childApp.childProp;
        expect(childApp).not.toHaveProperty('childProp');

        delete childApp.ext0Inited;
        expect(childApp).toHaveProperty('ext0Inited', true);
        expect(app).toHaveProperty('ext0Inited', true);
    });

    it('should emit event to self app instance', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.on('testEvent', cb);

        childApp.emit('testEvent');
        expect(cb).toBeCalled();
    });

    it('shoult not emit event to global app instance', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        app.on('testEvent', cb);

        childApp.emit('testEvent');
        expect(cb).not.toBeCalled();
    });

    it('should receive event from global app instance', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.on('testEvent', cb);

        app.emit('testEvent');
        expect(cb).toBeCalled();
        cb.mockClear();

        childApp.dispose();
        app.emit('testEvent');
        expect(cb).not.toBeCalled();
    });

    it('should not receive event from global app instance after disposal', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.on('testEvent', cb);
        childApp.dispose();

        app.emit('testEvent');
        expect(cb).not.toBeCalled();
    });

    it('should not add event listener to global app instance after disposal', () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.dispose();
        childApp.on('testEvent', cb);

        app.emit('testEvent');
        expect(cb).not.toBeCalled();
    });

    it('should observe own properties', async () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app, { childProp: 1 })(() => { });
        defineObservableProperty(childApp, 'childProp', 1);
        childApp.watch('childProp', cb);

        expect(childApp.childProp).toBe(1);
        await after(() => {
            childApp.childProp = 2;
        });
        expect(childApp.childProp).toBe(2);
        verifyCalls(cb, [
            [2, 1, 'childProp', expect.sameObject(childApp)]
        ]);
    });

    it('should observe properties defined on global app instance', async () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        childApp.watch('testProp', cb);

        expect(childApp.testProp).toBe(1);
        await after(() => {
            childApp.testProp = 2;
        });
        expect(childApp.testProp).toBe(4);
        verifyCalls(cb, [
            [4, 1, 'testProp', expect.sameObject(childApp)]
        ]);
        cb.mockClear();

        await after(() => {
            app.testProp = 3;
        });
        expect(childApp.testProp).toBe(6);
        verifyCalls(cb, [
            [6, 4, 'testProp', expect.sameObject(childApp)]
        ]);
    });

    it('should not observe properties defined on global app instance after disposal', async () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        const currentTestProp = childApp.testProp;
        childApp.watch('testProp', cb);
        childApp.dispose();

        await after(() => {
            app.testProp = 4;
        });
        expect(childApp.testProp).toBe(currentTestProp);
        expect(app.testProp).toBe(8);
        expect(cb).not.toBeCalled();
    });

    it('should not update properties defined on global app instance after disposal', async () => {
        const childApp = brew.disposableWith(app)(() => { });
        const currentTestProp = childApp.testProp;
        childApp.dispose();

        childApp.testProp = 4;
        expect(childApp.testProp).toBe(currentTestProp);
        expect(app.testProp).toBe(currentTestProp);
    });

    it('should not update observed properties defined on global app instance after disposal', async () => {
        const cb = mockFn();
        const childApp = brew.disposableWith(app)(() => { });
        const currentTestProp = childApp.testProp;
        childApp.watch('testProp', cb);
        childApp.dispose();

        childApp.testProp = 4;
        expect(childApp.testProp).toBe(currentTestProp);
        expect(app.testProp).toBe(currentTestProp);
    });
});
