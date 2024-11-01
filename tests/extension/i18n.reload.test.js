import { _, initApp, mockFn } from "../testUtil";
import router from "src/extension/router";
import i18n from "src/extension/i18n";
import { jest } from "@jest/globals";
import dom from "zeta-dom/dom";
import { noop } from "zeta-dom/util";

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
var app;

beforeAll(async () => {
    const location = window.location;
    delete window.location;
    window.location = {
        ...location,
        reload: jest.fn()
    };

    app = await initApp(router, i18n, app => {
        app.useRouter({
            initialPath: '/fr',
            baseUrl: '/',
            routes: [
                '/{language}/*',
                '/*'
            ]
        });
        app.useI18n({
            languages: ['en', 'de', 'es-ES'],
            routeParam: 'language',
            reloadOnChange: true
        });
    });
});

beforeEach(async () => {
    await app.navigate('/en');
});

describe('app.setLanguage', () => {
    it('should request lock cancellation', async () => {
        const onCancel = mockFn();
        dom.lock(dom.root, new Promise(noop), onCancel);
        onCancel.mockImplementationOnce(() => Promise.reject());

        await expect(app.setLanguage('de')).resolves.toBe(false);
        expect(onCancel).toBeCalled();
        expect(app.path).toBe('/en');
        expect(app.route.language).toBe('en');
        expect(location.reload).not.toBeCalled();
        onCancel.mockClear();

        await expect(app.setLanguage('de')).resolves.toBe(true);
        expect(onCancel).toBeCalled();
        expect(app.path).toBe('/de');
        expect(app.route.language).toBe('de');
        expect(location.reload).toBeCalled();
    });
});
