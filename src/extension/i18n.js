import { any, each } from "../include/zeta-dom/util.js";
import { install } from "../app.js";

function detectLanguage(languages, defaultLanguage) {
    var userLanguages = navigator.languages ? [].slice.apply(navigator.languages) : [navigator.language || ''];
    each(userLanguages, function (i, v) {
        if (v.indexOf('-') > 0) {
            var invariant = v.split('-')[0];
            if (userLanguages.indexOf(invariant) < 0) {
                for (var j = userLanguages.length - 1; j >= 0; j--) {
                    if (userLanguages[j].split('-')[0] === invariant) {
                        userLanguages.splice(j + 1, 0, invariant);
                    }
                }
            }
        }
    });
    languages = languages || userLanguages;
    return any(userLanguages, function (v) {
        return languages.indexOf(v) >= 0;
    }) || defaultLanguage || languages[0];
}

install('i18n', function (app, options) {
    var routeParam = app.route && options.routeParam;
    var cookie = options.cookie && cookie(options.cookie, 86400000);
    var language = (routeParam && app.route[routeParam]) || (cookie && cookie.get()) || detectLanguage(options.languages, options.defaultLanguage);
    var setLanguage = function (newLangauge) {
        if (options.languages.indexOf(newLangauge) < 0) {
            newLangauge = language;
        }
        app.language = newLangauge;
        if (cookie) {
            cookie.set(newLangauge);
        }
        if (routeParam) {
            app.route[routeParam] = newLangauge;
        }
        if (language !== newLangauge) {
            language = newLangauge;
            if (options.reloadOnChange) {
                location.reload();
            }
        }
    };

    app.define({
        language,
        setLanguage,
        detectLanguage
    });
    app.watch('language', setLanguage);
    if (routeParam) {
        app.route.watch(routeParam, setLanguage);
        app.on('ready', function () {
            app.route[routeParam] = language;
        });
    }
});

export default null;
