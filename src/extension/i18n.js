import { always, combineFn, defineObservableProperty, each, pipe, resolve, single } from "zeta-dom/util";
import { addExtension, appReady } from "../app.js";
import { cookie as _cookie } from "../util/common.js";

function toDictionary(languages) {
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

function getBrowserLanguages() {
    return navigator.languages || [navigator.language || ''];
}

function detectLanguage(languages) {
    return single(toDictionary(getBrowserLanguages()), function (v, i) {
        return languages[i];
    });
}

export default addExtension('i18n', function (app, options) {
    var languages = toDictionary(options.languages);
    var routeParam = app.route && options.routeParam;
    var cookie = options.cookie && _cookie(options.cookie, 86400000);
    var getCanonicalValue = function (v) {
        return v && languages[v.toLowerCase()];
    };
    var language = getCanonicalValue(routeParam && app.route[routeParam]) || getCanonicalValue(cookie && cookie.get()) || (options.detectLanguage !== false && detectLanguage(languages)) || getCanonicalValue(options.defaultLanguage) || single(languages, pipe) || '';
    var beforepageload = [];

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
        newLangauge = getCanonicalValue(newLangauge) || language;
        if (routeParam && appReady) {
            return new Promise(function (resolve) {
                always(app.route[replace ? 'replace' : 'set'](routeParam, newLangauge.toLowerCase(), true), resolve);
                beforepageload.push(resolve);
            });
        } else {
            commitLanguage(newLangauge);
            return resolve(true);
        }
    }

    defineObservableProperty(app, 'language', language, function (newLangauge) {
        if (newLangauge !== language) {
            setLanguage(newLangauge);
        }
        return language;
    });
    app.define({
        setLanguage: function (newLangauge) {
            return setLanguage(newLangauge).then(function (resolved) {
                return resolved && language === getCanonicalValue(newLangauge);
            });
        },
        detectLanguage: function (languages, defaultLanguage) {
            return languages ? detectLanguage(toDictionary(languages)) || defaultLanguage || languages[0] || '' : getBrowserLanguages()[0];
        }
    });
    if (routeParam) {
        app.route.watch(routeParam, function (newLangauge) {
            setLanguage(newLangauge, true);
        });
        app.on('ready', function () {
            setLanguage(language, true);
        });
        app.on('beforepageload', function (e) {
            commitLanguage(getCanonicalValue(e.route[routeParam]) || language);
            combineFn(beforepageload.splice(0))(true);
        });
    }
});
