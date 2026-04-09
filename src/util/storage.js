import { compressToUTF16, decompressFromUTF16 } from "../include/lz-string.js";
import { each, extend, hasOwnProperty, is, isArray, keys, map, noop, setImmediateOnce, throws } from "zeta-dom/util";

const UNDEFINED = 'undefined';

const specialValues = {
    '': undefined,
    'u': undefined,
    '-0': -0,
    'NaN': NaN,
    'Infinity': Infinity,
    '-Infinity': -Infinity
};

function isObject(value) {
    return value && typeof value === 'object';
}

function normalizeValue(value, nested, skipToJSON) {
    switch (typeof value) {
        case 'undefined':
            return nested ? '#' : undefined;
        case 'bigint':
            return '#n' + value;
        case 'string':
            return value[0] === '#' ? '#' + value : value;
        case 'number':
            return value !== value || value === Infinity || value === -Infinity ? '#' + value : value === 0 && 1 / value < 0 ? '#-0' : value;
        case 'function':
            return;
        case 'object':
            if (value) {
                if (!skipToJSON && typeof value.toJSON === 'function') {
                    return normalizeValue(value.toJSON(), nested, true);
                }
                if (is(value, Number) || is(value, Boolean) || is(value, String)) {
                    return normalizeValue(value.valueOf(), nested, true);
                }
                if (value === window || is(value, RegExp) || is(value, Blob) || is(value, Node)) {
                    return nested ? undefined : {};
                }
            }
    }
    return value;
}

export function createObjectStorage(storage, key) {
    var types = new Map([
        [Date, '#Date '],
        ['Date', [Date, noop]]
    ]);
    var objectCache = {};
    var objectMap = new WeakMap();
    var dirty = new Set();
    var entries = Object.create(null);
    var serialized = initFromStorage(entries) || ['{}'];
    var emptyIds = map(serialized, function (v, i) {
        return v ? null : i;
    });

    function initFromStorage(entries) {
        try {
            var serialized = decompressFromUTF16(storage.getItem(key)).split('\n');
            extend(entries, JSON.parse(serialized[0]));
            return serialized;
        } catch (e) { }
    }

    function getNextId() {
        return emptyIds.length ? emptyIds.shift() : serialized.push('') - 1;
    }

    function getNextIdForKey(key) {
        var id = entries[key];
        if (id && !(id in objectCache ? isObject(objectCache[id]) : /^[#\[\{]/.test(serialized[id]))) {
            // reuse existing index only if target is not an object as it may still be referenced
            return id;
        }
        return getNextId();
    }

    function getPrefix(obj) {
        return (isObject(obj) && types.get(obj.constructor)) || '';
    }

    function cacheObject(id, obj) {
        objectCache[id] = obj;
        if (isObject(obj)) {
            objectMap.set(obj, +id);
        }
    }

    function uncacheObject(id) {
        objectMap.delete(objectCache[id]);
        delete objectCache[id];
    }

    function serialize(obj, visited, prefix) {
        if (prefix === undefined) {
            prefix = getPrefix(obj);
            obj = normalizeValue(obj);
        }
        var callback = function (v) {
            var id = objectMap.get(v);
            if (!visited[id]) {
                var prefix = getPrefix(v);
                var data = normalizeValue(v, !prefix);
                if (!prefix && !isObject(data)) {
                    return data;
                }
                id = id || getNextId();
                cacheObject(id, v);
                visited[id] = true;
                serialized[id] = serialize(data, visited, prefix);
                dirty.delete(v);
            }
            return '#' + id;
        };
        if (isArray(obj)) {
            obj = Array.prototype.slice.call(obj);
            for (var i = 0, len = obj.length; i < len; i++) {
                obj[i] = obj[i] !== undefined || i in obj ? callback(obj[i]) : '#u';
            }
        } else if (isObject(obj)) {
            var clone = {};
            for (var i in obj) {
                clone[i] = callback(obj[i]);
            }
            obj = clone;
        }
        return prefix + JSON.stringify(obj);
    }

    function deserialize(str, refs) {
        if (!str || str === UNDEFINED) {
            return;
        }
        if (str[0] === '#') {
            var pos = str.indexOf(' ');
            var type = types.get(str.slice(1, pos));
            str = str.slice(pos + 1);
            if (type) {
                var len = refs.length;
                var data = deserialize(str, refs);
                if (refs.length === len) {
                    return new type[0](data);
                } else {
                    var target = new type[0]();
                    refs.push({ t: type[1].bind(undefined, target, data) });
                    return target;
                }
            }
        }
        return JSON.parse(str, function (k, v) {
            if (typeof v === 'string' && v[0] === '#') {
                v = v.slice(1);
                if (v[0] !== '#') {
                    if (hasOwnProperty(specialValues, v)) {
                        if (!v) {
                            refs.push({ o: this, k, v });
                        }
                        return specialValues[v];
                    }
                    if (v[0] === 'n') {
                        return BigInt(v.slice(1));
                    }
                    if (!(v in objectCache)) {
                        objectCache[v] = undefined;
                        cacheObject(v, deserialize(serialized[v], refs));
                    } else if (objectCache[v] === undefined) {
                        refs.push({ o: this, k, v });
                    }
                    return objectCache[v];
                }
            }
            return v;
        });
    }

    function revive(id) {
        if (id && serialized[id] && !(id in objectCache)) {
            try {
                var refs = [];
                deserialize('{"": "#' + id + '"}', refs);
                each(refs, function (i, v) {
                    if (v.t) {
                        v.t();
                    } else {
                        v.o[v.k] = objectCache[v.v];
                    }
                });
            } catch (e) {
                serialized[id] = UNDEFINED;
            }
        }
        return objectCache[id];
    }

    function persist() {
        var visited = {};
        each(dirty, function (i, v) {
            var id = objectMap.get(v);
            if (id) {
                serialized[id] = serialize(v, visited);
            }
        });
        visited = { 0: true };
        each(entries, function visit(_, id) {
            if (!visited[id]) {
                visited[id] = true;
                serialized[id].replace(/[\[:,]"#(\d+)"/g, visit);
            }
        });
        each(serialized, function (i) {
            if (!visited[i] && serialized[i]) {
                serialized[i] = '';
                emptyIds.push(i);
                uncacheObject(i);
            }
        });
        dirty.clear();
        serialized[0] = JSON.stringify(entries);
        storage.setItem(key, compressToUTF16(serialized.join('\n').trim()));
    }

    return {
        registerType: function (key, fn, setter) {
            if (types.has(key) || types.has(fn)) {
                throws('Key or constructor already registered');
            }
            types.set(fn, '#' + key + ' ');
            types.set(key, [fn, setter]);
        },
        keys: function () {
            return keys(entries);
        },
        has: function (key) {
            return !!entries[key];
        },
        get: function (key) {
            return revive(entries[key]);
        },
        revive: function (key, callback) {
            var id = entries[key];
            if (id) {
                var value = revive(id);
                var isConstructor = hasOwnProperty(callback, 'prototype');
                if (!isConstructor || !(value instanceof callback)) {
                    uncacheObject(id);
                    cacheObject(id, isConstructor ? new callback(value) : callback(value));
                }
                return objectCache[id];
            }
        },
        set: function (key, value) {
            var id = objectMap.get(value) || getNextIdForKey(key);
            entries[key] = id;
            if (!isObject(value)) {
                serialized[id] = serialize(value) || UNDEFINED;
            } else {
                cacheObject(id, value);
                dirty.add(value);
            }
            setImmediateOnce(persist);
        },
        persist: function (obj) {
            dirty.add(obj);
            setImmediateOnce(persist);
        },
        persistAll: function () {
            each(entries, function (i, v) {
                if (isObject(objectCache[v])) {
                    dirty.add(objectCache[v]);
                }
            });
            setImmediateOnce(persist);
        },
        delete: function (key) {
            if (entries[key]) {
                delete entries[key];
                setImmediateOnce(persist);
            }
        },
        clear: function () {
            serialized.splice(0, serialized.length, '{}');
            emptyIds.splice(0);
            dirty.clear();
            objectMap = new WeakMap();
            objectCache = {};
            entries = Object.create(null);
            setImmediateOnce(persist);
        }
    };
}
