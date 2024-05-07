import { _, initApp, mockFn } from "../testUtil";
import router from "src/extension/router";
import { createObjectStorage } from "src/util/storage";
import { randomId } from "zeta-dom/util";
import { jest } from "@jest/globals";

const stateId1 = randomId();
const stateId2 = randomId();
const sessionId = randomId();

beforeAll(async () => {
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('g', { baz: 'baz' });
    store.set('c', stateId1);
    store.set('s', [
        [stateId1, '/foo', 0, false, { a: 1 }, sessionId],
        [stateId2, '/bar', 1, false, null, sessionId],
    ]);
    store.set(stateId1, { foo: 'foo' });
    store.set(sessionId, { bar: 'bar' });
});

describe('router', () => {
    it('should initialize with path and data saved with history state', async () => {
        var cb = mockFn();
        var app = await new Promise(resolve => {
            initApp(router, app => {
                app.useRouter({
                    routes: [
                        '/*'
                    ]
                });
                app.on('navigate', cb);
                app.on('beforepageload', () => resolve(app));
            });
        });

        expect(app.path).toBe('/');
        expect(app.canNavigateForward).toBe(false);
        expect(app.canNavigateBack).toBe(false);
        expect(app.previousPath).toBeNull();
        expect(history.state).not.toBe(stateId1);
        expect(cb).toBeCalledWith(expect.objectContaining({
            navigationType: 'navigate',
            pathname: '/',
            data: undefined
        }), _);
        expect(app.historyStorage.current.has('foo')).toBe(false);
        expect(app.sessionId).not.toBe(sessionId);
        expect(app.sessionStorage.has('bar')).toBe(false);
        expect(app.cache.get('baz')).toBe('baz');
    });
});
