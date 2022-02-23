import { defineObservableProperty, each, isArray, single } from "../include/zeta-dom/util.js";
import { install } from "../app.js";
import { cookie as _cookie } from "../util/common.js";

function toDictionary(languages) {
    if (languages) {
        var dict = {};
        each(languages, function (i, v) {
            var key = v.toLowerCase();
            dict[key] = v;
            if (key.indexOf('-') > 0) {
                dict[key.split('-')[0]] = v;
            }
        });
        return dict;
    }
}

function getCanonicalValue(languages, value) {
    if (languages && value) {
        return languages[value.toLowerCase()];
    }
    return value;
}

function detectLanguage(languages, defaultLanguage) {
    var userLanguages = navigator.languages || [navigator.language || ''];
    if (!languages) {
        return userLanguages[0];
    }
    userLanguages = toDictionary(userLanguages);
    if (isArray(languages)) {
        languages = toDictionary(languages);
    }
    return single(userLanguages, function (v, i) {
        return languages[i];
    }) || defaultLanguage || languages[0];
}

install('i18n', function (app, options) {
    var languages = toDictionary(options.languages);
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
