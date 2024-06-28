import { compressToUTF16, decompressFromUTF16 } from "../include/lz-string.js";
import { each, extend, is, keys, map, setImmediateOnce } from "zeta-dom/util";

const UNDEFINED = 'undefined';

function isObject(value) {
    return value && typeof value === 'object';
}

function shouldIgnore(obj) {
    return obj === window || is(obj, RegExp) || is(obj, Blob) || is(obj, Node);
}

export function createObjectStorage(storage, key) {
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
        if (id && !(id in objectCache ? isObject(objectCache[id]) : /^[\[\{]/.test(serialized[id]))) {
            // reuse existing index only if target is not an object as it may still be referenced
            return id;
        }
        return getNextId();
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

    function serialize(obj, visited) {
        var counter = 0;
        return JSON.stringify(obj, function (k, v) {
            if (!isObject(v)) {
                return typeof v === 'string' && v[0] === '#' ? '#' + v : v;
            }
            if (shouldIgnore(v)) {
                return counter ? undefined : {};
            }
            if (!counter++) {
                return v;
            }
            var id = objectMap.get(v) || getNextId();
            cacheObject(id, v);
            if (!visited[id]) {
                visited[id] = true;
                serialized[id] = serialize(v, visited);
                dirty.delete(v);
            }
            return '#' + id;
        });
    }

    function deserialize(str, refs) {
        if (!str || str === UNDEFINED) {
            return;
        }
        return JSON.parse(str, function (k, v) {
            if (typeof v === 'string' && v[0] === '#') {
                v = v.slice(1);
                if (v[0] !== '#') {
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

    function revive(key, callback) {
        var id = entries[key];
        if (id && serialized[id] && !(id in objectCache)) {
            try {
                var refs = [];
                var value = deserialize('{"": "#' + id + '"}', refs)[""];
                each(refs, function (i, v) {
                    v.o[v.k] = objectCache[v.v];
                });
                if (callback) {
                    uncacheObject(id);
                    cacheObject(id, callback(value));
                }
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
        keys: function () {
            return keys(entries);
        },
        has: function (key) {
            return !!entries[key];
        },
        get: function (key) {
            return revive(key);
        },
        revive: function (key, callback) {
            uncacheObject(entries[key]);
            return revive(key, callback);
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
