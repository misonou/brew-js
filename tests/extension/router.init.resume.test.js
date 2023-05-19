import { _, initApp, mockFn } from "../testUtil";
import router from "src/extension/router";
import { createObjectStorage } from "src/util/storage";
import { randomId } from "zeta-dom/util";

const stateId1 = randomId();
const stateId2 = randomId();

beforeAll(async () => {
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('c', stateId1);
    store.set('s', [
        [stateId1, '/foo', 0, false, { a: 1 }],
        [stateId2, '/bar', 1, false, null],
    ]);
});

describe('router', () => {
    it('should initialize with path and data saved with history state', async () => {
        var cb = mockFn();
        var app = await new Promise(resolve => {
            initApp(router, app => {
                app.useRouter({
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

        expect(app.path).toBe('/foo')
        expect(history.state).toBe(stateId1);
        expect(cb).toBeCalledWith(expect.objectContaining({
            pathname: '/foo',
            newStateId: stateId1,
            data: { a: 1 }
        }), _);
    });
});
