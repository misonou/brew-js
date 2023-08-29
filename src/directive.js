import { each, defineGetterProperty, defineOwnProperty, definePrototype, mapRemove } from "./include/zeta-dom/util.js";
import { matchSelector } from "./include/zeta-dom/domUtil.js";
import { watchElements } from "./include/zeta-dom/observe.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import dom from "./include/zeta-dom/dom.js";

const emitter = new ZetaEventContainer();

function Component(element) {
    defineOwnProperty(this, 'element', element, true);
}

function ComponentContext() { }

definePrototype(ComponentContext, {
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    }
});

export function getDirectiveComponent(element) {
    return new Component(element);
}

export function registerDirective(key, selector, options) {
    var map = new WeakMap();
    var collect = watchElements(dom.root, selector, function (added, removed) {
        each(removed, function (i, v) {
            emitter.emit('destroy', mapRemove(map, v).context);
        });
        each(added, function (i, v) {
            var context = new ComponentContext();
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
