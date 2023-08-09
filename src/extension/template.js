import waterpipe from "../include/external/waterpipe.js"
import $ from "../include/external/jquery.js";
import { parseCSS, isCssUrlValue } from "../include/zeta-dom/cssUtil.js";
import { bind, selectClosestRelative, selectIncludeSelf, setClass } from "../include/zeta-dom/domUtil.js";
import { camel, combineFn, each, either, equal, errorWithCode, extend, isFunction, isThenable, keys, makeArray, map, matchWord, pick, resolve, resolveAll, setImmediateOnce } from "../include/zeta-dom/util.js";
import { registerCleanup, watchAttributes, watchElements } from "../include/zeta-dom/observe.js";
import dom from "../include/zeta-dom/dom.js";
import { preventLeave } from "../include/zeta-dom/domLock.js";
import { addExtension, isElementActive } from "../app.js";
import { addRenderer, addSelectHandlers, addTransformer, hookBeforeUpdate, matchElement, mountElement } from "../dom.js";
import { addAsyncAction, closeFlyout, toggleFlyout } from "../domAction.js";
import { copyAttr, getAttr, getAttrValues, getFormValues, hasAttr, isBoolAttr, setAttr } from "../util/common.js";
import { groupLog, writeLog } from "../util/console.js";
import { toRelativeUrl, withBaseUrl } from "../util/path.js";
import { getVar, evalAttr, setVar, evaluate, declareVar, resetVar, getVarScope } from "../var.js";
import * as ErrorCode from "../errorCode.js";

const IMAGE_STYLE_PROPS = 'background-image';
const templates = {};
const root = dom.root;

export default addExtension(true, 'template', function (app) {
    var addListener = app.on.bind(app);
    app.define({
        getVar: getVar,
        setVar: setVar,
        matchElement: matchElement,
        beforeUpdate: hookBeforeUpdate,
        on: function (target, event, handler, noChildren) {
            var unbind = addListener(target, event, handler, noChildren);
            if (isFunction(event) || typeof target !== 'string') {
                return unbind;
            }
            return combineFn(unbind, addSelectHandlers(target, event, handler, noChildren));
        }
    });

    app.watch('readyState', function (state) {
        if (state === 'ready') {
            mountElement(root);
        }
    });

    addTransformer('apply-template', function (element, getState) {
        var state = getState(element);
        var templateName = getAttr(element, 'apply-template');
        var template = templates[templateName] || templates[evalAttr(element, 'apply-template')];
        var currentTemplate = state.template;

        if (!state.attributes) {
            extend(state, {
                attributes: getAttrValues(element),
                childNodes: makeArray(element.childNodes)
            });
        }
        if (template && template !== currentTemplate) {
            state.template = template;
            template = template.cloneNode(true);

            // reset attributes on the apply-template element
            // before applying new attributes
            if (currentTemplate) {
                each(currentTemplate.attributes, function (i, v) {
                    element.removeAttribute(v.name);
                });
            }
            setAttr(element, state.attributes);
            copyAttr(template, element);

            var $contents = $(state.childNodes).detach();
            $(selectIncludeSelf('content:not([for])', template)).replaceWith($contents);
            $(selectIncludeSelf('content[for]', template)).each(function (i, v) {
                $(v).replaceWith($contents.filter(getAttr(v, 'for') || ''));
            });
            $(element).empty().append(template.childNodes);
        }
    });

    addTransformer('auto-var', function (element) {
        setVar(element, evalAttr(element, 'auto-var'));
    });

    addTransformer('foreach', function (element, getState) {
        var state = getState(element);
        var templateNodes = state.template || (state.template = $(element).contents().detach().filter(function (i, v) { return v.nodeType === 1 || /\S/.test(v.data || ''); }).get());
        var currentNodes = state.nodes || [];
        var oldItems = state.data || [];
        var newItems = makeArray(evalAttr(element, 'foreach'));

        if (newItems.length !== oldItems.length || newItems.some(function (v, i) { return oldItems[i] !== v; })) {
            var newChildren = map(newItems, function (v) {
                var currentIndex = oldItems.indexOf(v);
                if (currentIndex >= 0) {
                    oldItems.splice(currentIndex, 1);
                    return currentNodes.splice(currentIndex * templateNodes.length, (currentIndex + 1) * templateNodes.length);
                }
                var parts = $(templateNodes).clone().get();
                var nested = $(selectIncludeSelf('[foreach]', parts));
                if (nested[0]) {
                    $(selectIncludeSelf('[foreach]', templateNodes)).each(function (i, v) {
                        getState(nested[i]).template = getState(v).template;
                    });
                }
                each(parts, function (i, w) {
                    if (w.nodeType === 1) {
                        $(element).append(w);
                        declareVar(w, { foreach: v });
                        mountElement(w);
                    }
                });
                return parts;
            });
            extend(state, {
                nodes: newChildren,
                data: newItems.slice()
            });
            $(currentNodes).detach();
            $(element).append(newChildren);
        }
    });

    addTransformer('switch', function (element, getState, applyDOMUpdates) {
        var varname = getAttr(element, 'switch') || '';
        if (!isElementActive(element) || !varname) {
            return;
        }
        var state = getState(element);
        if (state.matched === undefined) {
            declareVar(element, 'matched', function () {
                return state.matched && getVar(state.matched, true);
            });
        }
        var context = getVar(element);
        var matchValue = waterpipe.eval(varname, context);
        var $target = $('[match-' + varname + ']', element).filter(function (i, w) {
            return $(w).parents('[switch]')[0] === element;
        });
        var resetOnChange = !matchWord('switch', getAttr(element, 'keep-child-state') || '');
        var previous = state.matched;
        var matched;
        var itemValues = new Map();
        $target.each(function (i, v) {
            var thisValue = waterpipe.eval('"null" ?? ' + getAttr(v, 'match-' + varname), getVar(v));
            itemValues.set(v, thisValue);
            if (waterpipe.eval('$0 == $1', [matchValue, thisValue])) {
                matched = v;
                return false;
            }
        });
        matched = matched || $target.filter('[default]')[0] || $target[0] || null;
        if (previous !== matched) {
            groupLog('switch', [element, varname, '→', matchValue], function (console) {
                console.log('Matched: ', matched || '(none)');
                if (matched) {
                    if (resetOnChange) {
                        resetVar(matched);
                    }
                    setVar(matched);
                }
                if (previous && resetOnChange) {
                    resetVar(previous, true);
                }
                $target.each(function (i, v) {
                    applyDOMUpdates(v, { $$class: { active: v === matched } });
                });
            });
        } else {
            writeLog('switch', [element, varname, '→', matchValue, '(unchanged)']);
            if (varname in context && itemValues.get(matched) !== undefined) {
                setVar(element, varname, itemValues.get(matched));
            }
        }
        state.matched = matched;
    });

    addRenderer('template', function (element, getState, applyDOMUpdates) {
        var state = getState(element);
        var templates = state.templates;
        if (!templates) {
            templates = {};
            each(element.attributes, function (i, w) {
                if (w.value.indexOf('{{') >= 0) {
                    templates[w.name] = isBoolAttr(element, w.name) ? w.value.replace(/^{{|}}$/g, '') : w.value;
                }
            });
            if (!element.childElementCount && (element.textContent || '').indexOf('{{') >= 0) {
                templates.$$html = element.textContent.replace(/(\{\{(?:\}(?!\})|[^}])*\}*\}\})|</g, function (v, a) {
                    return a || '&lt;';
                });
            }
            state.templates = templates;
        }
        var context = getVar(element);
        var props = {};
        each(templates, function (i, w) {
            var value = evaluate(w, context, element, i, !isBoolAttr(element, i));
            if ((i === '$$html' ? element.innerHTML : (getAttr(element, i) || '').replace(/["']/g, '')) !== value) {
                props[i] = value;
            }
        });
        applyDOMUpdates(element, props);
    });

    addRenderer('set-style', function (element, getState, applyDOMUpdates) {
        var style = parseCSS(evalAttr(element, 'set-style', true));
        each(IMAGE_STYLE_PROPS, function (i, v) {
            var imageUrl = isCssUrlValue(style[v]);
            if (imageUrl) {
                style[v] = 'url("' + withBaseUrl(toRelativeUrl(imageUrl)) + '")';
            }
        });
        applyDOMUpdates(element, { style });
    });

    addRenderer('set-class', function (element, getState, applyDOMUpdates) {
        applyDOMUpdates(element, { $$class: evalAttr(element, 'set-class') });
    });

    addRenderer('prevent-leave', function (element, getState) {
        var state = getState(element);
        var value = evalAttr(element, 'prevent-leave');
        if (either(value, state.value)) {
            state.value = value;
            if (value) {
                var promise = new Promise(function (resolve) {
                    state.resolve = resolve;
                });
                preventLeave(element, promise, function () {
                    return resolve(app.emit('preventLeave', element, null, true)).then(function (result) {
                        if (!result) {
                            throw errorWithCode(ErrorCode.navigationRejected);
                        }
                    });
                });
            } else {
                state.resolve();
            }
        }
    });

    addAsyncAction('validate', function (e) {
        var target = selectClosestRelative(getAttr(this, 'validate') || '', e.target);
        if (target) {
            // @ts-ignore: type inference issue
            var valid = dom.emit('validate', target) || !target.checkValidity || target.checkValidity();
            if (!valid) {
                e.stopImmediatePropagation();
                e.preventDefault();
            } else if (isThenable(valid)) {
                return valid.then(function (valid) {
                    if (!valid) {
                        throw errorWithCode(ErrorCode.validationFailed);
                    }
                });
            }
        }
    });

    addAsyncAction('context-method', function (e) {
        var self = e.currentTarget;
        var method = camel(getAttr(self, 'context-method') || '');
        if (isFunction(app[method])) {
            var formSelector = getAttr(self, 'context-form');
            // @ts-ignore: acceptable if self.form is undefined
            var form = formSelector ? selectClosestRelative(formSelector, self) : self.form;
            var params;
            var valid = true;
            if (form) {
                valid = dom.emit('validate', form) || form.checkValidity();
                params = [getFormValues(form)];
            } else {
                params = makeArray(evalAttr(self, 'method-args'));
            }
            return resolveAll(valid, function (valid) {
                if (!valid) {
                    throw errorWithCode(ErrorCode.validationFailed);
                }
                return app[method].apply(app, params);
            });
        }
    });

    matchElement('form[form-var]', function (form) {
        var varname = getAttr(form, 'form-var');
        var values = {};
        var update = function (updateField) {
            if (updateField) {
                values = getFormValues(form);
            }
            if (!varname) {
                setVar(form, values);
            } else {
                var currentValues = getVar(form, varname) || {};
                if (!equal(values, pick(currentValues, keys(values)))) {
                    setVar(form, varname, extend({}, currentValues, values));
                }
            }
        };
        watchAttributes(form, 'value', function () {
            setImmediateOnce(update);
        });
        watchElements(form, ':input', function (addedInputs) {
            each(addedInputs, function (i, v) {
                registerCleanup(v, bind(v, 'change input', function () {
                    setImmediateOnce(update);
                }));
            });
            update(true);
        }, true);
        dom.on(form, 'reset', function () {
            if (varname) {
                if (!isElementActive(getVarScope(varname, form))) {
                    form.reset();
                }
            } else {
                each(form.elements, function (i, v) {
                    if (!isElementActive(getVarScope(v.name, form))) {
                        v.value = null;
                    }
                });
            }
            return true;
        });
    });

    matchElement('[loading-scope]', function (element) {
        dom.subscribeAsync(element, function (loading) {
            setVar(element, 'loading', loading);
        });
    });

    matchElement('[error-scope]', function (element) {
        dom.subscribeAsync(element);
        dom.on(element, {
            asyncStart: function () {
                setVar(element, 'error', null);
            },
            error: function (e) {
                var error = e.error || {};
                setVar(element, 'error', error.code || error.message || true);
            }
        });
    });

    app.on('pageenter', function (e) {
        $(selectIncludeSelf('form[form-var]', e.target)).each(function (i, v) {
            $(':input:eq(0)', v).trigger('change');
        });
    });

    dom.ready.then(function () {
        $('[brew-template]').each(function (i, v) {
            var clone = v.cloneNode(true);
            clone.removeAttribute('brew-template');
            templates[getAttr(v, 'brew-template')] = clone;
        });

        $('apply-attributes').each(function (i, v) {
            var $target = $(getAttr(v, 'elements') || '', v.parentNode || root);
            each(v.attributes, function (i, v) {
                if (v.name !== 'elements') {
                    $target.each(function (i, w) {
                        w.setAttribute(v.name, v.value);
                    });
                }
            });
        }).remove();

        $('body').on('click', '[set-var]:not([match-path])', function (e) {
            var self = e.currentTarget;
            if (self === $(e.target).closest('[set-var]')[0]) {
                setVar(self);
                closeFlyout();
            }
        });

        $('body').on('click', '[toggle]', function (e) {
            var self = e.currentTarget;
            var selector = self.getAttribute('toggle');
            var target = selector ? selectClosestRelative(selector, self) : $(self).closest('[is-flyout]')[0];
            e.stopPropagation();
            if (target && (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if'))) {
                toggleFlyout(target, self);
            }
        });

        $('body').on('click', '[toggle-class]', function (e) {
            var self = e.currentTarget;
            e.stopPropagation();
            if (!self.attributes['toggle-if'] || evalAttr(self, 'toggle-if')) {
                var selector = self.getAttribute('toggle-class-for');
                var target = selector ? selectClosestRelative(selector, self) : e.currentTarget;
                each(self.getAttribute('toggle-class'), function (i, v) {
                    setClass(target, v.slice(1), v[0] === '+');
                });
            }
        });

        if (hasAttr(root, 'loading-scope')) {
            setVar(root, 'loading', 'initial');
        }
    });
});
