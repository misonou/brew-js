declare namespace Brew {
    /* ------------------------------------------------------------- 
     * useI18n
     * ------------------------------------------------------------- */
    interface WithI18n {
        /**
         * Gets or sets the language.
         * @see WithI18n.setLanguage
         */
        language: string;

        /**
         * Sets the language.
         * If the language is not on the specified list, the language will not be changed.
         * @param language 
         */
        setLanguage(language: string): void;

        detectLanguage(languages: string[], defaultLanguage?: string): string;
        /**
         * Enables the i18n (internationalization) module.
         * @param options Options to be passed to the module.
         */
        useI18n(options: I18nOptions): void;
    }

    interface I18nOptions {
        /**
         * Specifies the allowed list of languages.
         */
        languages: string[];
        /**
         * Specifies the default language if there is no cookie or route parameter
         * that can infer the current language.
         */
        defaultLanguage?: string;
        /**
         * Specifies the route parameter that is to define the current language.
         * If given, changing the route parameter will result in change of language, and vice versa.
         */
        routeParam?: string;
        /**
         * Specifies the cookie name to which current language is saved.
         */
        cookie?: string;
        /**
         * Specifies whether to reload the page when language is changed.
         * This is used when content on the page cannot reflect the new language by an ad hoc way.
         */
        reloadOnChange?: boolean;
    }
}
