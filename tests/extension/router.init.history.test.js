import { _, initApp, mockFn } from "../testUtil";
import router from "src/extension/router";
import { randomId } from "zeta-dom/util";

const stateId1 = randomId();
const stateId2 = randomId();

beforeAll(async () => {
    sessionStorage.setItem('brew.history./', JSON.stringify([
        [stateId1, '/foo', 0],
        [stateId2, '/bar', 1],
    ]));
    history.replaceState(stateId1, '');
});

describe('router', () => {
    it('should initialize with path and data saved with history state', async () => {
        var cb = mockFn();
        var app = await new Promise(resolve => {
            initApp(router, app => {
                app.useRouter({
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
            newStateId: stateId1
        }), _);
    });
});
