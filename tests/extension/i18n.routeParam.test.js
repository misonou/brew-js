import { _, initApp, waitForEvent, delay, mockFn, cleanupAfterTest } from "../testUtil";
import router from "src/extension/router";
import i18n from "src/extension/i18n";
import dom from "zeta-dom/dom";
import { noop } from "zeta-dom/util";
import { waitFor } from "@testing-library/dom";

var initialPath;
/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
var app;

beforeAll(async () => {
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
            routeParam: 'language'
        });
        app.on('ready', () => {
            const unbind = app.on('navigate', (e) => {
                initialPath = e.pathname;
                unbind();
            });
        });
    });
});

beforeEach(async () => {
    await app.navigate('/en');
});

describe('i18n extension', () => {
    it('should set language from route parameter', async () => {
        await app.navigate('/en/foo');
        await expect(app.route.set('language', 'de')).resolves.toMatchObject({
            path: '/de/foo',
            redirected: false
        });
        expect(app.language).toBe('de');
        expect(app.previousPath).toBe('/en/foo');
    });

    it('should set language from route parameter to its canonical casing', async () => {
        await expect(app.route.set('language', 'es-es')).resolves.toMatchObject({
            path: '/es-es',
            redirected: false
        });
        expect(app.language).toBe('es-ES');
    });

    it('should not set language before new path is committed', async () => {
        const promise2 = app.navigate('/de');
        cleanupAfterTest(app.on('navigate', () => {
            expect(app.language).toBe('en');
        }));
        cleanupAfterTest(app.on('beforepageload', () => {
            expect(app.language).toBe('de');
        }));
        await promise2;
        expect.assertions(2);
    });

    it('should not set language when navigation is cancelled', async () => {
        const cb = mockFn();
        cleanupAfterTest(app.watch('language', cb));
        cleanupAfterTest(app.on('navigate', () => app.navigate('/en')));

        await expect(app.navigate('/de')).rejects.toBeErrorWithCode('brew/navigation-cancelled');
        expect(cb).not.toBeCalled();
    });

    it('should redirect to path with lowercased route parameter', async () => {
        await expect(app.route.set('language', 'es-ES')).resolves.toMatchObject({
            path: '/es-es',
            redirected: true,
            originalPath: '/es-ES',
        });
        expect(app.language).toBe('es-ES');
    });

    it('should redirect to default language if initial language is not in option', () => {
        expect(app.initialPath).toBe('/fr');
        expect(initialPath).toBe('/en');
    });

    it('should redirect to path of current language if route paramter is invalid', async () => {
        await app.navigate('/');
        expect(app.path).toBe('/en');

        await app.navigate('/fr/foo');
        expect(app.path).toBe('/en/foo');
    });

    it('should not navigate and set language for invalid language value', async () => {
        const language = app.language;
        await expect(app.route.set('language', 'fr')).resolves.toMatchObject({
            navigated: false
        });
        expect(app.language).toBe(language);
    });
});

describe('app.language', () => {
    it('should match language case insensitively', async () => {
        app.language = 'es-es';
        await delay();
        expect(app.language).toBe('es-ES');
    });

    it('should not be changed if assigned invalid language', async () => {
        const language = app.language;
        app.language = 'fr';
        await delay();
        expect(app.language).toBe(language);
    });

    it('should navigate to path with specified language', async () => {
        await app.navigate('/en/foo');
        const promise = waitForEvent(app, 'navigate');
        app.language = 'de';

        const event = await promise;
        expect(event.pathname).toBe('/de/foo');
        expect(app.previousPath).toBe('/en/foo');

        await delay();
        await app.back();
        expect(app.path).toBe('/en/foo');
    });

    it('should set route parameter in lowercase', () => {
        app.language = 'es-ES';
        expect(app.route.language).toBe('es-es');
    });

    it('should keep current query and hash', async () => {
        await app.navigate('/en?foo=bar#baz');
        app.language = 'de';
        await expect(app.watchOnce('path')).resolves.toBe('/de?foo=bar#baz');
    });

    it('should request lock cancellation', async () => {
        const onCancel = mockFn();
        dom.lock(dom.root, new Promise(noop), onCancel);
        onCancel.mockImplementationOnce(() => Promise.reject());

        app.language = 'de';
        await waitFor(() => expect(onCancel).toBeCalled());
        expect(app.path).toBe('/en');
        expect(app.route.language).toBe('en');
        onCancel.mockClear();

        app.language = 'de';
        await waitForEvent(app, 'beforepageload');
        expect(onCancel).toBeCalled();
        expect(app.path).toBe('/de');
        expect(app.route.language).toBe('de');
    });
});

describe('app.setLanguage', () => {
    it('should match language case insensitively', async () => {
        await expect(app.setLanguage('es-es')).resolves.toBe(true);
        expect(app.language).toBe('es-ES');
    });

    it('should not be changed if assigned invalid language', async () => {
        const language = app.language;
        await expect(app.setLanguage('fr')).resolves.toBe(false);
        expect(app.language).toBe(language);
    });

    it('should navigate to path with specified language', async () => {
        await app.navigate('/en/foo');
        const promise = waitForEvent(app, 'navigate');
        app.setLanguage('de');

        const event = await promise;
        expect(event.pathname).toBe('/de/foo');
        expect(app.previousPath).toBe('/en/foo');

        await delay();
        await app.back();
        expect(app.path).toBe('/en/foo');
    });

    it('should set route parameter in lowercase', () => {
        app.setLanguage('es-ES');
        expect(app.route.language).toBe('es-es');
    });

    it('should keep current query and hash', async () => {
        await app.navigate('/en?foo=bar#baz');
        app.setLanguage('de');
        await expect(app.watchOnce('path')).resolves.toBe('/de?foo=bar#baz');
    });

    it('should request lock cancellation', async () => {
        const onCancel = mockFn();
        dom.lock(dom.root, new Promise(noop), onCancel);
        onCancel.mockImplementationOnce(() => Promise.reject());

        await expect(app.setLanguage('de')).resolves.toBe(false);
        expect(onCancel).toBeCalled();
        expect(app.path).toBe('/en');
        expect(app.route.language).toBe('en');
        onCancel.mockClear();

        await expect(app.setLanguage('de')).resolves.toBe(true);
        expect(onCancel).toBeCalled();
        expect(app.path).toBe('/de');
        expect(app.route.language).toBe('de');
    });

    it('should cancel previous request', async () => {
        const promise1 = app.setLanguage('de');
        const promise2 = app.setLanguage('es-ES');
        await expect(promise1).resolves.toBe(false);
        await expect(promise2).resolves.toBe(true);
        expect(app.language).toBe('es-ES');
    });
});
