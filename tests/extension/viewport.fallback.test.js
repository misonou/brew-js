import { jest } from "@jest/globals";
import { _, bindEvent, delay, initApp, mockFn, verifyCalls } from "../testUtil";
import viewport from "src/extension/viewport";

/** @type {Brew.AppInstance<Brew.WithViewport>} */
var app;

var screenWidth = 1024;
var screenHeight = 768;
jest.spyOn(document.body, 'offsetWidth', 'get').mockImplementation(() => screenWidth);
jest.spyOn(document.body, 'offsetHeight', 'get').mockImplementation(() => screenHeight);

function setViewportSize(w, h) {
    screenWidth = w;
    screenHeight = h;
    window.dispatchEvent(new CustomEvent('resize'));
}

beforeAll(async () => {
    app = await initApp(viewport);
});

beforeEach(() => {
    setViewportSize(1024, 768);
});

describe('Viewport extension', () => {
    it('should return current viewport size', async () => {
        expect(app.viewportWidth).toBe(screenWidth);
        expect(app.viewportHeight).toBe(screenHeight);
        expect(app.aspectRatio).toBe(screenWidth / screenHeight);
        expect(app.orientation).toBe('landscape');

        setViewportSize(768, 1080);
        await delay(0);
        expect(app.viewportWidth).toBe(screenWidth);
        expect(app.viewportHeight).toBe(screenHeight);
        expect(app.aspectRatio).toBe(screenWidth / screenHeight);
        expect(app.orientation).toBe('portrait');
    });

    it('should fire resize event when viewport is resized', async () => {
        const cb = mockFn();
        bindEvent(app, 'resize', cb);
        setViewportSize(1920, 1080);
        await delay(0);
        verifyCalls(cb, [
            [expect.objectContaining({ aspectRatio: 1920 / 1080, viewportWidth: 1920, viewportHeight: 1080 }), _]
        ]);
    });

    it('should fire orientationchange when viewport changes from portrait to lanscape or vice versa', async () => {
        const cb = mockFn();
        bindEvent(app, 'orientationchange', cb);
        setViewportSize(768, 1024);
        await delay(0);
        expect(app.orientation).toBe('portrait');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'portrait' }), _]
        ]);

        cb.mockClear();
        setViewportSize(768, 1920);
        await delay(0);
        expect(app.orientation).toBe('portrait');
        expect(cb).not.toBeCalled();

        setViewportSize(1024, 768);
        await delay(0);
        expect(app.orientation).toBe('landscape');
        verifyCalls(cb, [
            [expect.objectContaining({ orientation: 'landscape' }), _]
        ]);
    });
});
