import { defineObservableProperty, each, isArray, keys, single } from "zeta-dom/util";
import { addExtension, appReady } from "../app.js";
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
    }) || defaultLanguage || keys(languages)[0];
}

export default addExtension('i18n', function (app, options) {
    var languages = toDictionary(options.languages);
    var routeParam = app.route && options.routeParam;
    var cookie = options.cookie && _cookie(options.cookie, 86400000);
    var language = getCanonicalValue(languages, routeParam && app.route[routeParam]) || getCanonicalValue(languages, cookie && cookie.get()) || (options.detectLanguage !== false ? detectLanguage : getCanonicalValue)(languages, options.defaultLanguage);

    function commitLanguage(newLangauge) {
        if (cookie) {
            cookie.set(newLangauge);
        }
        if (language !== newLangauge) {
            language = newLangauge;
            app.language = language;
            if (options.reloadOnChange) {
                location.reload();
            }
        }
    }

    function setLanguage(newLangauge, replace) {
        newLangauge = getCanonicalValue(languages, newLangauge) || language;
        if (routeParam && appReady) {
            app.route[replace ? 'replace' : 'set'](routeParam, newLangauge.toLowerCase(), true);
        } else {
            commitLanguage(newLangauge);
        }
    }

    defineObservableProperty(app, 'language', language, function (newLangauge) {
        if (newLangauge !== language) {
            setLanguage(newLangauge);
        }
        return language;
    });
    app.define({
        setLanguage,
        detectLanguage
    });
    if (routeParam) {
        app.route.watch(routeParam, function (newLangauge) {
            setLanguage(newLangauge, true);
        });
        app.on('ready', function () {
            setLanguage(language, true);
        });
        app.on('beforepageload', function (e) {
            commitLanguage(getCanonicalValue(languages, e.route[routeParam]) || language);
        });
    }
});
