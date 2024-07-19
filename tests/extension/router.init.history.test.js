import { _, initApp, mockFn } from "../testUtil";
import router from "src/extension/router";
import { createObjectStorage } from "src/util/storage";
import { randomId } from "zeta-dom/util";
import { jest } from "@jest/globals";

const stateId0 = randomId();
const stateId1 = randomId();
const stateId2 = randomId();
const sessionId = randomId();

const navigationType = jest.spyOn(Object.getPrototypeOf(performance.navigation), 'type', 'get');
navigationType.mockReturnValue(performance.navigation.TYPE_BACK_FORWARD);

beforeAll(async () => {
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('g', { baz: 'baz' });
    store.set('c', stateId2);
    store.set('s', [
        [stateId0, '/xxx', 0, false, null, randomId()],
        [stateId1, '/foo', 1, false, { a: 1 }, sessionId],
        [stateId2, '/bar', 2, false, null, sessionId],
    ]);
    store.set(stateId1, { foo: 'foo' });
    store.set(sessionId, { bar: 'bar' });
    history.replaceState(stateId1, '');
});

describe('router', () => {
    it('should initialize with path and data saved with history state', async () => {
        var cb = mockFn();
        var app = await new Promise(resolve => {
            initApp(router, app => {
                app.useRouter({
                    // resume option should be ignore when navigation type is not TYPE_NAVIGATE
                    resume: true,
                    urlMode: 'none',
                    routes: [
                        '/*'
                    ]
                });
                app.on('navigate', cb);
                app.on('beforepageload', () => resolve(app));
            });
        });

        expect(app.path).toBe('/foo');
        expect(app.canNavigateForward).toBe(true);
        expect(app.canNavigateBack).toBe(false);
        expect(app.previousPath).toBeNull();
        expect(history.state).toBe(stateId1);
        expect(cb).toBeCalledWith(expect.objectContaining({
            navigationType: 'back_forward',
            pathname: '/foo',
            newStateId: stateId1,
            data: { a: 1 }
        }), _);
        expect(app.page.getSavedStates()).toEqual({ foo: 'foo' });
        expect(app.historyStorage.current.get('foo')).toBe('foo');
        expect(app.sessionId).toBe(sessionId);
        expect(app.sessionStorage.get('bar')).toBe('bar');
        expect(app.cache.get('baz')).toBe('baz');
    });
});
