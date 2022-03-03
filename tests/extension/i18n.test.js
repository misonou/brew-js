import { _, initApp, waitForEvent } from "../testUtil";
import router from "src/extension/router";
import i18n from "src/extension/i18n";
import { jest } from "@jest/globals";

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
            const unbind = app.on('navigate', () => {
                initialPath = app.path;
                unbind();
            });
        });
    });
});

beforeEach(() => {
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    jest.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['en-US', 'en', 'es', 'ja']);
});

beforeEach(async () => {
    await app.navigate('/en');
});

describe('i18n extension', () => {
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
});

describe('app.language', () => {
    it('should match language case insensitively', () => {
        app.language = 'es-es';
        expect(app.language).toBe('es-ES');
    });

    it('should not be changed if assigned invalid language', async () => {
        const language = app.language;
        app.language = 'fr';
        expect(app.language).toBe(language);
    });

    it('should navigate to path with specified language', async () => {
        await app.navigate('/en/foo');
        const promise = waitForEvent(app, 'navigate');
        app.language = 'de';

        const event = await promise;
        expect(event.pathname).toBe('/de/foo');
    });

    it('should set route parameter in lowercase', () => {
        app.language = 'es-ES';
        expect(app.route.language).toBe('es-es');
    });

    it('should be changed by route parameter', async () => {
        const promise = waitForEvent(app, 'navigate');
        app.route.language = 'de';

        await promise;
        expect(app.language).toEqual('de');
    });

    it('should be changed by route parameter and be set to canonical casing', async () => {
        const promise = waitForEvent(app, 'navigate');
        app.route.language = 'es-es';

        await promise;
        expect(app.language).toEqual('es-ES');
    });
});

describe('app.setLanguage', () => {
    it('should match language case insensitively', () => {
        app.setLanguage('es-es');
        expect(app.language).toBe('es-ES');
    });

    it('should not be changed if assigned invalid language', async () => {
        const language = app.language;
        app.setLanguage('fr');
        expect(app.language).toBe(language);
    });

    it('should navigate to path with specified language', async () => {
        await app.navigate('/en/foo');
        const promise = waitForEvent(app, 'navigate');
        app.setLanguage('de');

        const event = await promise;
        expect(event.pathname).toBe('/de/foo');
    });
});

describe('app.detectLanguage', () => {
    it('should match language case insensitively', () => {
        expect(app.detectLanguage(['en-us'])).toBe('en-us');
    });

    it('should match language with same variant preferentially', () => {
        expect(app.detectLanguage(['en', 'en-US'])).toBe('en-US');
    });

    it('should match invariant language when no variant matches', () => {
        expect(app.detectLanguage(['en-UK', 'en'])).toBe('en');
    });

    it('should match variant language when no invariant matches', () => {
        expect(app.detectLanguage(['es-ES', 'de'])).toBe('es-ES');
    });

    it('should match language in order of navigator.languages', () => {
        expect(app.detectLanguage(['ja', 'en'])).toBe('en');
    });

    it('should match language of navigator.language when languages is unavailable', () => {
        jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('ja');
        jest.spyOn(window.navigator, 'languages', 'get').mockReturnValue(undefined);
        expect(app.detectLanguage(['ja', 'en'])).toBe('ja');
    });

    it('should return first language when none of the languages match', () => {
        expect(app.detectLanguage(['fr'])).toBe('fr');
    });

    it('should return default language when none of the languages match', () => {
        expect(app.detectLanguage(['fr'], 'pt')).toBe('pt');
    });
});
