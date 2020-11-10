import { $ } from "../include/zeta/shim.js";
import { each, extend, kv, setImmediateOnce } from "../include/zeta/util.js";
import { bindUntil, selectIncludeSelf } from "../include/zeta/domUtil.js";
import dom from "../include/zeta/dom.js";
import { getVar, getVarObjWithProperty, setVar } from "../var.js";
import { isElementActive } from "./router.js";
import { install } from "../app.js";
import { compareObject, getFormValues } from "../util/common.js";
import defaults from "../defaults.js";

defaults.formVar = true;

install('formVar', function (app) {
    app.matchElement('form[form-var]', function (form) {
        var varname = form.getAttribute('form-var');
        var values = {};
        var update = function () {
            if (!varname || !compareObject(values, getVar(form)[varname])) {
                setVar(form, varname ? kv(varname, extend({}, values)) : values);
            }
        };
        dom.watchAttributes(form, 'value', function () {
            setImmediateOnce(update);
        });
        dom.watchElements(form, ':input', function (addedInputs) {
            each(addedInputs, function (i, v) {
                bindUntil(dom.elementDetached(v), v, 'change', function () {
                    setImmediateOnce(update);
                });
            });
            // @ts-ignore: form must be HTMLFormElement
            values = getFormValues(form);
            update();
        }, true);

        app.on(form, 'reset', function () {
            var state = getVar(form);
            if (varname) {
                if (!isElementActive(getVarObjWithProperty(state, varname).element)) {
                    // @ts-ignore: form must be HTMLFormElement
                    form.reset();
                }
            } else {
                // @ts-ignore: form must be HTMLFormElement
                each(form.elements, function (i, v) {
                    if (!isElementActive(getVarObjWithProperty(state, v.name).element)) {
                        v.reset();
                    }
                });
            }
            return true;
        });
    });

    app.on('pageenter', function (e) {
        $(selectIncludeSelf('form[form-var]', e.target)).each(function (i, v) {
            $(':input:eq(0)', v).trigger('change');
        });
    });
});

export default null;
