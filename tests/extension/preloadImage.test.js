import { jest } from "@jest/globals";
import { _, after, bindEvent, delay, initApp, initBody, mockFn, verifyCalls } from "../testUtil";
import htmlRouter from "src/extension/htmlRouter";
import preloadImage from "src/extension/preloadImage";
import template from "src/extension/template";
import { setVar } from "src/var";

const setAttribute = jest.spyOn(HTMLImageElement.prototype, 'setAttribute');

/** @type {Brew.AppInstance<Brew.WithHtmlRouter>} */
var app;
/** @type {Zeta.Dictionary<HTMLElement>} */
var elements;

beforeAll(async () => {
    elements = initBody(`
        <div switch>
            <div id="root" default match-path="/" var="{ src: null bg: null }">
                <img id="img" template src="{{src}}" />
                <div id="div" template set-style="background-image: url('{{bg}}')"></div>
            </div>
            <div default match-path="/foo">
                <img src="/src2.png" />
                <div style="background-image: url('/bg2.png')"></div>
            </div>
        </div>
    `);
    app = await initApp(preloadImage, template, htmlRouter, app => {
        app.useHtmlRouter({
            routes: ['/*']
        });
    });
});

describe('PreloadImage extension', () => {
    it('should preload image before state change', async () => {
        const cb = mockFn();
        bindEvent(elements.root, 'statechange', cb);

        await app.navigate('/');
        await after(() => {
            setVar(elements.root, {
                src: '/src.png',
                bg: '/bg.png'
            });
        });
        expect(cb).not.toBeCalled();
        expect(setAttribute.mock.instances[0].isConnected).toBe(false);
        expect(setAttribute.mock.calls[0][1]).toContain('/src.png');
        expect(setAttribute.mock.instances[1].isConnected).toBe(false);
        expect(setAttribute.mock.calls[1][1]).toContain('/bg.png');

        // wait for timeout
        await delay(200);
        expect(cb).toBeCalledTimes(1);
    });

    it('should preload image before page enter', async () => {
        const cb = mockFn();
        bindEvent(app, 'beforepageload', cb);
        bindEvent(app, 'pageenter', cb);

        app.navigate('/foo');
        await delay(0);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'beforepageload' }), _]
        ]);
        expect(setAttribute.mock.instances[0].isConnected).toBe(false);
        expect(setAttribute.mock.calls[0][1]).toContain('/src2.png');
        expect(setAttribute.mock.instances[1].isConnected).toBe(false);
        expect(setAttribute.mock.calls[1][1]).toContain('/bg2.png');

        // wait for timeout
        await delay(1000);
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'beforepageload' }), _],
            [expect.objectContaining({ type: 'pageenter' }), _],
        ]);
    });
});
