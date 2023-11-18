import $ from "./include/external/jquery.js";
import { selectIncludeSelf, isVisible, matchSelector, containsOrEquals, getClass } from "./include/zeta-dom/domUtil.js";
import { each, throwNotFunction, setPromiseTimeout, noop, mapGet, delay, deferrable, executeOnce, isFunction } from "./include/zeta-dom/util.js";
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import { createAutoCleanupMap, watchElements } from "./include/zeta-dom/observe.js";
import dom from "./include/zeta-dom/dom.js";
import { getAttr, setAttr } from "./util/common.js";

const customAnimateIn = {};
const customAnimateOut = {};
const animateScopes = createAutoCleanupMap(noop);
const collectChanges = watchElements(dom.root, '[animate-in],[animate-sequence],[is-animate-sequence]', handleMutations);

function getShouldAnimate(element, trigger, scope, filterCallback) {
    var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
    return function (v) {
        return matchSelector(v, filter) && (!scope || containsOrEquals($(v).closest(scope)[0] || dom.root, element)) && (!filterCallback || filterCallback(v)) && isVisible(v);
    };
}

function handleMutations(addNodes) {
    if (addNodes[0]) {
        each(animateScopes, function (i, v) {
            each(v, function (j, v) {
                v.start();
            });
        });
    }
}

function handleAnimation(element, animationType, animationTrigger, customAnimation, callback) {
    var sequences = new WeakMap();
    var deferred = deferrable();
    var promise = setPromiseTimeout(deferred, 1500).catch(function () {
        console.warn('Animation might take longer than expected', { element, animationType, animationTrigger });
    });
    var fireEvent = executeOnce(function () {
        dom.emit('animationstart', element, { animationType, animationTrigger }, true);
        promise.then(function () {
            dom.emit('animationcomplete', element, { animationType, animationTrigger }, true);
        });
    });
    var animate = function (element) {
        // transform cannot apply on inline elements
        if ($(element).css('display') === 'inline') {
            $(element).css('display', 'inline-block');
        }
        var ms = parseFloat($(element).css('transition-delay')) * 1000 || 0;
        fireEvent();
        deferred.waitFor(runCSSTransition(element, 'tweening-' + animationType), dom.emit('animate' + animationType, element));
        each(customAnimation, function (i, v) {
            if (element.attributes[i]) {
                var fn = v.bind(undefined, element, getAttr(element, i));
                deferred.waitFor(ms ? delay(ms, fn) : fn());
            }
        });
    };
    return {
        promise: promise.then(callback),
        animate: animate,
        sequence: function (element, filter, attr) {
            var queue = mapGet(sequences, element, Array);
            var reverse = getAttr(element, 'animate-sequence-reverse');
            var selector = getAttr(element, 'animate-sequence') || '';
            var elements = $(element).find(selector[0] === '>' ? selector : $(selector)).filter(filter).attr(attr || {}).get();
            if (reverse === '' || reverse === animationType) {
                elements.reverse();
            }
            each(elements, function (i, v) {
                if (queue.indexOf(v) < 0 && queue.push(v) === 1) {
                    fireEvent();
                    deferred.waitFor(delay(50, function next() {
                        animate(queue.shift());
                        return queue[0] && delay(50, next);
                    }));
                }
            });
        }
    };
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean) | boolean=} filterCallback
 */
export function animateIn(element, trigger, scope, filterCallback) {
    var dict = mapGet(animateScopes, element, Object);
    var scopeObject = dict[trigger] || (dict[trigger] = {
        start: filterCallback === true ? animateIn.bind(0, element, trigger, scope) : noop
    });
    var shouldAnimate = getShouldAnimate(element, trigger, scope, isFunction(filterCallback));
    var anim = scopeObject.anim || (scopeObject.anim = handleAnimation(element, 'in', trigger, customAnimateIn, function () {
        scopeObject.anim = null;
    }));
    selectIncludeSelf('[animate-in]:not([is-animate-sequence],.tweening-in)', element).filter(shouldAnimate).forEach(function (v) {
        anim.animate(v);
    });
    selectIncludeSelf('[animate-sequence]', element).filter(shouldAnimate).forEach(function (v) {
        if (!getClass(v, 'tweening-in')) {
            setAttr(v, 'animate-in', '');
            anim.animate(v);
        }
        anim.sequence(v, ':not(.tweening-in)', {
            'animate-in': getAttr(v, 'animate-sequence-type') || '',
            'animate-on': trigger,
            'is-animate-sequence': ''
        });
    });
    collectChanges(true);
    return anim.promise;
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback
 * @param {boolean=} excludeSelf
 */
export function animateOut(element, trigger, scope, filterCallback, excludeSelf) {
    var shouldAnimate = getShouldAnimate(element, trigger, scope, filterCallback);
    var elements = selectIncludeSelf('.tweening-in,[animate-out]', element);
    if (excludeSelf && elements[0] === element) {
        elements.splice(0, 1);
    }
    var filtered = elements.filter(shouldAnimate);
    var anim = handleAnimation(element, 'out', trigger, customAnimateOut, function () {
        $(trigger === 'show' ? elements : filtered).removeClass('tweening-in tweening-out');
    });
    $(filtered).filter('[animate-out]:not([is-animate-sequence],.tweening-out)').each(function (i, v) {
        anim.animate(v);
    })
    $(filtered).filter('[animate-out][animate-sequence]').each(function (i, v) {
        anim.sequence(v, '.tweening-in');
    });
    delete mapGet(animateScopes, element, Object)[trigger];
    return anim.promise;
}

/**
 * @param {string} name
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback
 */
export function addAnimateIn(name, callback) {
    customAnimateIn[name] = throwNotFunction(callback);
}

/**
 * @param {string} name
 * @param {(elm: Element, attrValue: string) => Promise<any>} callback
 */
export function addAnimateOut(name, callback) {
    customAnimateOut[name] = throwNotFunction(callback);
}
