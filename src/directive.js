import { each, defineGetterProperty, defineOwnProperty, definePrototype, mapRemove, isUndefinedOrNull, mapObject, defineObservableProperty, map, watchable, pipe, isFunction, noop } from "./include/zeta-dom/util.js";
import { matchSelector } from "./include/zeta-dom/domUtil.js";
import { watchElements, watchOwnAttributes } from "./include/zeta-dom/observe.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import dom from "./include/zeta-dom/dom.js";
import { getAttr, setAttr } from "./util/common.js";

const root = dom.root;
const emitter = new ZetaEventContainer();
const toString = function (v) {
    return isUndefinedOrNull(v) ? null : String(v);
};
const toNumber = function (v) {
    return isUndefinedOrNull(v) || isNaN(v) ? null : +v;
};
const converters = {
    string: [pipe, toString],
    number: [
        toNumber,
        function (v) { return toString(toNumber(v)); }
    ],
    boolean: [
        function (v) { return !isUndefinedOrNull(v); },
        function (v) { return v ? '' : null; }
    ]
};

function Component(element) {
    defineOwnProperty(this, 'element', element, true);
}

function ComponentContext() { }

definePrototype(ComponentContext, {
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    }
});
watchable(ComponentContext.prototype);

function createContextClass(options) {
    var attributes = map(options.directives, function (v) {
        return v.attribute;
    });
    var directives = mapObject(options.directives, function (v) {
        var name = v.attribute;
        var converter = converters[v.type] || converters.string;
        return {
            get: function (element) {
                return converter[0](getAttr(element, name));
            },
            set: function (element, value) {
                value = converter[1](value);
                setAttr(element, name, value);
                return converter[0](value);
            }
        };
    });
    var Context = function (element) {
        var self = this;
        defineOwnProperty(self, 'element', element, true);
        if (attributes[0]) {
            var update = function () {
                each(directives, function (i, v) {
                    self[i] = v.get(element);
                });
            };
            update();
            var collectChange = watchOwnAttributes(element, attributes, update);
            self.on('destroy', collectChange.dispose);
        }
    };
    definePrototype(Context, ComponentContext);
    each(directives, function (i) {
        defineObservableProperty(Context.prototype, i, null, function (v) {
            return directives[i].set(this.element, v);
        });
    });
    return Context;
}

export function getDirectiveComponent(element) {
    return new Component(element);
}

export function registerSimpleDirective(key, attr, init, dispose) {
    var map = new WeakMap();
    var set = function (enabled, element) {
        setAttr(element, attr, enabled ? '' : null);
        if (!enabled) {
            (mapRemove(map, element) || noop)();
        } else if (!map.has(element)) {
            map.set(element, isFunction(init(element)) || (dispose && dispose.bind(undefined, element)));
        }
    };
    watchElements(root, '[' + attr + ']', function (added, removed) {
        removed.forEach(set.bind(0, false));
        added.forEach(set.bind(0, true));
    });
    defineGetterProperty(Component.prototype, key, function () {
        return getAttr(this.element, attr) !== null;
    }, function (v) {
        return set(v, this.element);
    });
}

export function registerDirective(key, selector, options) {
    var Context = createContextClass(options);
    var map = new WeakMap();
    var collect = watchElements(root, selector, function (added, removed) {
        each(removed, function (i, v) {
            emitter.emit('destroy', mapRemove(map, v).context);
        });
        each(added, function (i, v) {
            var context = new Context(v);
            map.set(v, {
                component: options.component(v, context),
                context: context
            });
        });
    }, true);
    defineGetterProperty(Component.prototype, key, function () {
        var element = this.element;
        if (!map.has(element) && matchSelector(element, selector)) {
            collect();
        }
        return (map.get(element) || '').component || null;
    });
}
