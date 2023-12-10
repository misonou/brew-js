import { _, bindEvent, initApp, mockFn, verifyCalls } from "../testUtil";
import { setViewportSize } from "../harness/visualViewport";
import viewport from "src/extension/viewport";

/** @type {Brew.AppInstance<Brew.WithViewport>} */
var app;

beforeAll(async () => {
    app = await initApp(viewport);
});

describe('Viewport extension', () => {
    it('should return current viewport size', () => {
        expect(app.viewportWidth).toBe(visualViewport.width);
        expect(app.viewportHeight).toBe(visualViewport.height);
        expect(app.aspectRatio).toBe(visualViewport.width / visualViewport.height);
        expect(app.orientation).toBe('landscape');

        setViewportSize(768, 1080);
        expect(app.viewportWidth).toBe(visualViewport.width);
        expect(app.viewportHeight).toBe(visualViewport.height);
        expect(app.aspectRatio).toBe(visualViewport.width / visualViewport.height);
        expect(app.orientation).toBe('portrait');
    });

    it('should fire resize event when viewport is resized', () => {
        const cb = mockFn();
        bindEvent(app, 'resize', cb);
        setViewportSize(1920, 1080);
        verifyCalls(cb, [
            [expect.objectContaining({ aspectRatio: 1920 / 1080, viewportWidth: 1920, viewportHeight: 1080 }), _]
        ]);
    });

    it('should fire orientationchange when viewport changes from portrait to lanscape or vice versa', () => {
        const cb = mockFn();
        bindEvent(app, 'orientationchange', cb);
        setViewportSize(768, 1024);
        expect(app.orientation).toBe('portrait');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'portrait' }), _]
        ]);

        cb.mockClear();
        setViewportSize(768, 1920);
        expect(app.orientation).toBe('portrait');
        expect(cb).not.toBeCalled();

        setViewportSize(1024, 768);
        expect(app.orientation).toBe('landscape');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'landscape' }), _]
        ]);
    });
});
