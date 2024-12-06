import { jest } from "@jest/globals";
import { _, delay, initApp, initBody } from "../testUtil";
import { getDirectiveComponent } from "src/directive";
import router from "src/extension/router";
import scrollable from "src/extension/scrollable";
import { createObjectStorage } from "src/util/storage";
import { randomId } from "zeta-dom/util";

const stateId1 = randomId();
const sessionId = randomId();

const navigationType = jest.spyOn(Object.getPrototypeOf(performance.navigation), 'type', 'get');
navigationType.mockReturnValue(performance.navigation.TYPE_RELOAD);

beforeAll(async () => {
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('g', {
        'brew.scrollable': { x: 50, y: 50 },
        'brew.scrollable.another': { x: 75, y: 75 }
    });
    store.set('c', stateId1);
    store.set('s', [
        [stateId1, '/foo', 0, false, null, sessionId]
    ]);
    history.replaceState(stateId1, '');
});

describe('Scrollable extension', () => {
    it('should restore scroll position on reload', async () => {
        const { root1, root2 } = initBody(`
            <div scrollable persist-scroll id="root1" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
            <div scrollable persist-scroll="another" id="root2" x-rect="0 0 100 100">
                <div scrollable-target x-rect="0 0 200 200"></div>
            </div>
        `);
        await initApp(scrollable, router, app => {
            app.useRouter({
                routes: ['/*']
            });
            app.useScrollable();
        });
        await delay();
        expect(getDirectiveComponent(root1).scrollable).toMatchObject({ scrollX: 50, scrollY: 50 });
        expect(getDirectiveComponent(root2).scrollable).toMatchObject({ scrollX: 75, scrollY: 75 });
    });
});
