import { _, initApp, mockFn, cleanupAfterTest, delay } from "../testUtil";
import router from "src/extension/router";
import i18n from "src/extension/i18n";
import { jest } from "@jest/globals";

const getLanguage = jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
const getLanguages = jest.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['en-US', 'en', 'es', 'ja']);

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
var app;

beforeAll(async () => {
    app = await initApp(router, i18n, app => {
        app.useRouter({
            initialPath: '/',
            baseUrl: '/',
            routes: [
                '/*'
            ]
        });
        app.useI18n({
            languages: ['en', 'de', 'es-ES']
        });
    });
});

beforeEach(async () => {
    app.language = 'en';
});

describe('i18n extension', () => {
    it('should not trigger in-app navigation when routeParam is not specified', async () => {
        const cb = mockFn();
        cleanupAfterTest(app.on('navigate', cb));

        app.language = 'de';
        await delay();
        expect(cb).not.toBeCalled();
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
        getLanguage.mockReturnValueOnce('ja');
        getLanguages.mockReturnValueOnce(undefined);
        expect(app.detectLanguage(['ja', 'en'])).toBe('ja');
    });

    it('should return first language when none of the languages match', () => {
        expect(app.detectLanguage(['pt-PT', 'fr'])).toBe('pt-PT');
    });

    it('should return default language when none of the languages match', () => {
        expect(app.detectLanguage(['fr'], 'pt')).toBe('pt');
    });

    it('should return browser\'s primary language when no languages is given', () => {
        expect(app.detectLanguage()).toBe('en-US');
    });
});
