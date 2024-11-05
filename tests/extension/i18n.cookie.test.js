import { _, initApp } from "../testUtil";
import i18n from "src/extension/i18n";
import { jest } from "@jest/globals";

const setCookieSpy = jest.spyOn(document, 'cookie', 'set');

describe('i18n extension', () => {
    it('should set cookie with correct attributes', async () => {
        const app = await initApp(i18n, app => {
            app.useI18n({
                languages: ['en', 'de', 'es-ES'],
                cookie: 'lang',
                cookieOptions: { maxAge: 1000000, path: '/sub', secure: true, sameSite: 'strict' }
            });
        });
        jest.useFakeTimers("modern");
        jest.setSystemTime(1728381461381);

        app.language = 'de';
        expect(setCookieSpy).toBeCalledWith('lang=de;path=/sub;samesite=strict;expires=Tue, 08 Oct 2024 10:14:21 GMT;secure');
    });
});
