import { any, defineObservableProperty, each, iequal, single } from "../include/zeta-dom/util.js";
import { install } from "../app.js";
import { cookie as _cookie } from "../util/common.js";

function getCanonicalValue(languages, value) {
    if (languages && value) {
        return any(languages, function (v) {
            return iequal(v, value);
        });
    }
    return value;
}

function detectLanguage(languages, defaultLanguage) {
    var userLanguages = navigator.languages ? [].slice.apply(navigator.languages) : [navigator.language || ''];
    if (!languages) {
        return userLanguages[0];
    }
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
    return single(userLanguages, function (v) {
        return getCanonicalValue(languages, v);
    }) || defaultLanguage || languages[0];
}

install('i18n', function (app, options) {
    var languages = options.languages;
    var routeParam = app.route && options.routeParam;
    var cookie = options.cookie && _cookie(options.cookie, 86400000);
    var language = getCanonicalValue(languages, routeParam && app.route[routeParam]) || getCanonicalValue(languages, cookie && cookie.get()) || detectLanguage(languages, options.defaultLanguage);
    var setLanguage = function (newLangauge) {
        app.language = newLangauge;
    };

    defineObservableProperty(app, 'language', language, function (newLangauge) {
        newLangauge = getCanonicalValue(languages, newLangauge) || language;
        if (cookie) {
            cookie.set(newLangauge);
        }
        if (language !== newLangauge) {
            language = newLangauge;
            if (routeParam) {
                app.route.replace(routeParam, newLangauge.toLowerCase());
            }
            if (options.reloadOnChange) {
                location.reload();
            }
        }
        return language;
    });
    app.define({
        setLanguage,
        detectLanguage
    });
    if (routeParam) {
        app.route.watch(routeParam, setLanguage);
        app.on('ready', function () {
            app.route.replace(routeParam, language.toLowerCase());
        });
    }
});

export default null;
