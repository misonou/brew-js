import Promise from "./include/external/promise-polyfill.js";
import $ from "./include/external/jquery.js";
import { selectIncludeSelf, isVisible } from "./include/zeta-dom/domUtil.js";
import { catchAsync, resolve, resolveAll, each, throwNotFunction, errorWithCode } from "./include/zeta-dom/util.js";
import { runCSSTransition } from "./include/zeta-dom/cssUtil.js";
import * as ErrorCode from "./errorCode.js";
import dom from "./include/zeta-dom/dom.js";

const customAnimateIn = {};
const customAnimateOut = {};
const animatingElements = new Map();

var nextId = 0;

function handleAnimation(element, elements, promises, trigger) {
    if (!promises.length) {
        return resolve();
    }
    var id = ++nextId;
    var timeout, timeoutReject, timeoutResolve;
    promises = promises.map(function (v) {
        return v instanceof Promise ? catchAsync(v) : new Promise(function (resolve) {
            v.then(resolve, resolve);
        });
    });
    catchAsync(resolveAll(promises, function () {
        clearTimeout(timeout);
        timeoutResolve();
        animatingElements.delete(element);
    }));
    promises.push(new Promise(function (resolve, reject) {
        timeoutResolve = resolve;
        timeoutReject = reject;
    }));
    timeout = setTimeout(function () {
        timeoutReject(errorWithCode(ErrorCode.timeout, 'Animation timed out'));
        console.warn('Animation #%i might take longer than expected', id, promises);
        animatingElements.delete(element);
    }, 1500);

    var promise = catchAsync(resolveAll(promises));
    animatingElements.set(element, promise);
    return promise;
}

function animateElement(element, cssClass, eventName, customAnimation) {
    var promises = [runCSSTransition(element, cssClass), dom.emit(eventName, element)];
    var delay = parseFloat($(element).css('transition-delay'));
    each(customAnimation, function (i, v) {
        if (element.attributes[i]) {
            var attrValue = element.getAttribute(i);
            promises.push(new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolveAll(v(element, attrValue)).then(resolve, reject);
                }, delay * 1000);
            }));
        }
    });
    return resolveAll(promises, function () {
        return element;
    });
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback
 */
export function animateIn(element, trigger, scope, filterCallback) {
    if (animatingElements.has(element)) {
        return animatingElements.get(element).then(function () {
            return animateIn(element, trigger, scope, filterCallback);
        });
    }
    filterCallback = filterCallback || function () { return true; };
    dom.emit('animationstart', element, { animationType: 'in', animationTrigger: trigger }, true);

    var $innerScope = scope ? $(scope, element) : $();
    var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
    var elements = [];
    var promises = [];

    $(selectIncludeSelf('[animate-in]', element)).filter(filter).each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v) && isVisible(v)) {
            elements.push(v);
            promises.push(animateElement(v, 'tweening-in', 'animatein', customAnimateIn));
        }
    });
    $(selectIncludeSelf('[animate-sequence]', element)).filter(filter).each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v) && isVisible(v)) {
            var selector = v.getAttribute('animate-sequence') || '';
            var type = v.getAttribute('animate-sequence-type') || '';
            var $elements = $(v).find(selector[0] === '>' ? selector : $(selector));
            if ($(v).attr('animate-sequence-reverse') !== undefined) {
                [].reverse.apply($elements);
            }
            $elements.css('transition-duration', '0s');
            $elements.attr('animate-in', type).attr('is-animate-sequence', '');
            $elements.each(function (i, v) {
                if ($(v).css('display') === 'inline') {
                    // transform cannot apply on inline elements
                    $(v).css('display', 'inline-block');
                }
                elements.push(v);
                promises.push(new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        $(v).css('transition-duration', '');
                        animateElement(v, 'tweening-in', 'animatein', customAnimateIn).then(resolve, reject);
                    }, i * 50);
                }));
            });
            if (!v.attributes['animate-in']) {
                $(v).attr('animate-in', '').addClass('tweening-in');
            }
        }
    });
    return handleAnimation(element, elements, promises, trigger).then(function () {
        dom.emit('animationcomplete', element, { animationType: 'in', animationTrigger: trigger }, true);
    });
}

/**
 * @param {Element} element
 * @param {string} trigger
 * @param {string=} scope
 * @param {((elm: Element) => boolean)=} filterCallback
 * @param {boolean=} excludeSelf
 */
export function animateOut(element, trigger, scope, filterCallback, excludeSelf) {
    filterCallback = filterCallback || function () { return true; };
    dom.emit('animationstart', element, { animationType: 'out', animationTrigger: trigger }, true);

    var $innerScope = scope ? $(scope, element) : $();
    var filter = trigger === 'show' ? ':not([animate-on]), [animate-on~="' + trigger + '"]' : '[animate-on~="' + trigger + '"]';
    var elements = [];
    var promises = [];

    // @ts-ignore: type inference issue
    var $target = $((excludeSelf ? $ : selectIncludeSelf)('[animate-out]', element)).filter(filter);
    $target.each(function (i, v) {
        // @ts-ignore: filterCallback must be function
        if (!$innerScope.find(v)[0] && filterCallback(v)) {
            elements.push(v);
            promises.push(animateElement(v, 'tweening-out', 'animateout', customAnimateOut));
        }
    });
    return handleAnimation(element, elements, promises, trigger).then(function () {
        // reset animation state after outro animation has finished
        // @ts-ignore: type inference issue
        var $target = $((excludeSelf ? $ : selectIncludeSelf)('[animate-out], .tweening-in, .tweening-out', element));
        if (trigger !== 'show') {
            $target = $target.filter(filter);
        }
        $target = $target.filter(function (i, v) {
            // @ts-ignore: filterCallback must be function
            return filterCallback(v);
        });
        $target.removeClass('tweening-in tweening-out');
        $target.find('[is-animate-sequence]').removeAttr('animate-in').removeClass('tweening-in tweening-out');
        dom.emit('animationcomplete', element, { animationType: 'out', animationTrigger: trigger }, true);
    });
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
