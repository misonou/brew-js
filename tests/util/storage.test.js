import { createObjectStorage } from "src/util/storage";
import { delay, mockFn } from "../testUtil";

const TEST_KEY = '__test__';

beforeEach(() => {
    sessionStorage.clear();
});

describe('ObjectStorage', () => {
    it('should clear all data if entry dictionary is corrupted', async () => {
        sessionStorage.setItem(TEST_KEY, '{a}\n{}\n{}');
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store.keys()).toEqual([]);
    });

    it('should return undefined for corrupted entry', async () => {
        sessionStorage.setItem(TEST_KEY, [
            '{"foo":1,"bar":2}',
            '{a}',
            '{}'
        ].join('\n'));

        const store = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store.get('foo')).toBeUndefined();
    });
});

describe('ObjectStorage.has', () => {
    it('should return boolean indicating presence of specified key', async () => {
        const data = { foo: 'bar' };
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', data);
        expect(store.has('test')).toBe(true);
        expect(store.has('foo')).toBe(false);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.has('test')).toBe(true);
        expect(store2.has('foo')).toBe(false);
    });
});

describe('ObjectStorage.set', () => {
    it('should serialize object to backing storage', async () => {
        const data = { foo: 'bar' };
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', data);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        const restored = store2.get('test');
        expect(restored).toEqual(data);
        expect(restored).not.toBe(data);
        expect(sessionStorage.key(0)).toBe(TEST_KEY);
    });

    it('should serialize object with circular reference', async () => {
        const a = {};
        const b = {};
        a.b = b;
        b.a = a;

        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', { a });
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        const data = store2.get('test');
        expect(data.a).toBe(data.a.b.a);
    });

    it('should serialize primitive value except symbol', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('string', '#foo\nbar');
        store.set('number', 1);
        store.set('boolean', true);
        store.set('null', null);
        store.set('undefined', undefined);
        expect(store.keys().length).toBe(5);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.get('string')).toBe('#foo\nbar');
        expect(store2.get('number')).toBe(1);
        expect(store2.get('boolean')).toBe(true);
        expect(store2.get('null')).toBe(null);
        expect(store2.get('undefined')).toBe(undefined);
        expect(store.keys().length).toBe(5);
    });

    it('should not serialize certain non-trival objects', async () => {
        // require in jsdom as stringify(document.body) always gives '{}'
        document.body[TEST_KEY] = 1;

        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('data', {
            blob: new Blob([new Uint8Array(100)]),
            node: document.body,
            window: window
        });
        store.set('blob', new Blob());
        store.set('node', document.body);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.get('data')).toEqual({});
        expect(store2.get('blob')).toEqual({});
        expect(store2.get('node')).toEqual({});
    });

    it('should call toJSON on object', async () => {
        const toJSON = mockFn().mockReturnValue({ a: 1 });
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', { toJSON });
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.get('test')).toEqual({ a: 1 });
        expect(toJSON).toBeCalledTimes(1);
    });
});

describe('ObjectStorage.revive', () => {
    it('should invoke callback and cache the returned value', async () => {
        const data = { foo: 'bar' };
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', data);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        const cb = mockFn(v => ({ ...v }));
        const restored = store2.revive('test', cb);
        expect(cb).toBeCalledTimes(1);
        expect(restored).toBe(cb.mock.results[0].value);
        expect(restored).toEqual(data);
        expect(store2.get('test')).toBe(restored);
    });

    it('should persist object returned by the callback', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', { foo: 'bar' });
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        const cb = mockFn(v => ({ ...v }));
        const restored = store2.revive('test', cb);

        restored.foo = '__this_should_still_exist_';
        store2.persist(restored);
        await delay();

        expect(sessionStorage[TEST_KEY]).toMatch(/__this_should_still_exist_/);
    });
});

describe('ObjectStorage.persist', () => {
    it('should persist updated state', async () => {
        const data = { foo: 'bar' };
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', data);
        await delay();

        data.foo = 'baz';
        store.persist(data);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.get('test')).toEqual({ foo: 'baz' });
    });
});

describe('ObjectStorage.delete', () => {
    it('should remove object from backing storage', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', {});
        await delay();

        store.delete('test');
        expect(store.get('test')).toBeUndefined();
        expect(store.keys()).toEqual([]);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.get('test')).toBeUndefined();
        expect(store2.keys()).toEqual([]);
    });

    it('should remove all unreachable objects from backing storage', async () => {
        const data1 = { a: '__this_should_still_exist_' };
        const data2 = { a: '__this_should_not_exist_' };
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test1', { a: data1, b: data2 });
        store.set('test2', { a: data1 });
        await delay();

        store.delete('test1');
        await delay();
        expect(sessionStorage[TEST_KEY]).toMatchSnapshot();
    });

    it('should be no-op if key does not exist', async () => {
        const data = {};
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('data', data);
        await delay();

        store.delete('data');
        await delay();

        sessionStorage.clear();
        store.delete('data');
        await delay();
        expect(sessionStorage.length).toBe(0);
    });

    it('should mark line slot as empty', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('data1', {});
        store.set('data2', {});
        await delay();
        expect(sessionStorage[TEST_KEY].split('\n').length).toBe(3);

        store.delete('data1');
        await delay();
        expect(sessionStorage[TEST_KEY].split('\n').length).toBe(3);

        store.set('data3', {});
        await delay();
        expect(sessionStorage[TEST_KEY].split('\n').length).toBe(3);
    });

    it('should not double free empty line', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('data', [{}, {}]);
        await delay();

        const obj = {};
        store.set('obj', obj);
        store.delete('data');
        await delay();

        store.persist(obj);
        await delay();

        store.set('data', [
            { a: '__item_1__' },
            { a: '__item_2__' },
            { a: '__item_3__' },
            { a: '__item_4__' }
        ]);
        await delay();
        expect(sessionStorage[TEST_KEY]).toMatchSnapshot();
    });
});

describe('ObjectStorage.clear', () => {
    it('should clear all data', async () => {
        const store = createObjectStorage(sessionStorage, TEST_KEY);
        store.set('test', {});
        await delay();

        store.clear();
        expect(store.get('test')).toBeUndefined();
        expect(store.keys()).toEqual([]);
        await delay();

        const store2 = createObjectStorage(sessionStorage, TEST_KEY);
        expect(store2.keys()).toEqual([]);
    });
});
