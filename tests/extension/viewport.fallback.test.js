import { setScreenSize } from "@misonou/test-utils/mock/boxModel";
import { _, bindEvent, delay, initApp, mockFn, root, verifyCalls } from "../testUtil";
import viewport from "src/extension/viewport";

/** @type {Brew.AppInstance<Brew.WithViewport>} */
var app;

beforeAll(async () => {
    app = await initApp(viewport);
});

beforeEach(() => {
    setScreenSize(1024, 768);
});

describe('Viewport extension', () => {
    it('should return current viewport size', async () => {
        expect(app.viewportWidth).toBe(root.clientWidth);
        expect(app.viewportHeight).toBe(root.clientHeight);
        expect(app.aspectRatio).toBe(root.clientWidth / root.clientHeight);
        expect(app.orientation).toBe('landscape');

        setScreenSize(768, 1080);
        await delay(0);
        expect(app.viewportWidth).toBe(root.clientWidth);
        expect(app.viewportHeight).toBe(root.clientHeight);
        expect(app.aspectRatio).toBe(root.clientWidth / root.clientHeight);
        expect(app.orientation).toBe('portrait');
    });

    it('should fire resize event when viewport is resized', async () => {
        const cb = mockFn();
        bindEvent(app, 'resize', cb);
        setScreenSize(1920, 1080);
        await delay(0);
        verifyCalls(cb, [
            [expect.objectContaining({ aspectRatio: 1920 / 1080, viewportWidth: 1920, viewportHeight: 1080 }), _]
        ]);
    });

    it('should fire orientationchange when viewport changes from portrait to lanscape or vice versa', async () => {
        const cb = mockFn();
        bindEvent(app, 'orientationchange', cb);
        setScreenSize(768, 1024);
        await delay(0);
        expect(app.orientation).toBe('portrait');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'portrait' }), _]
        ]);

        cb.mockClear();
        setScreenSize(768, 1920);
        await delay(0);
        expect(app.orientation).toBe('portrait');
        expect(cb).not.toBeCalled();

        setScreenSize(1024, 768);
        await delay(0);
        expect(app.orientation).toBe('landscape');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'landscape' }), _]
        ]);
    });
});
