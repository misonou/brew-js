import { $ } from "../include/zeta/shim.js";
import { each, equal, extend, kv, setImmediateOnce } from "../include/zeta/util.js";
import { bindUntil, selectIncludeSelf } from "../include/zeta/domUtil.js";
import dom from "../include/zeta/dom.js";
import { getVar, getVarScope, setVar } from "../var.js";
import { isElementActive } from "./router.js";
import { install } from "../app.js";
import { getFormValues } from "../util/common.js";
import defaults from "../defaults.js";

defaults.formVar = true;

install('formVar', function (app) {
    app.matchElement('form[form-var]', function (form) {
        var varname = form.getAttribute('form-var');
        var values = {};
        var update = function (updateField) {
            if (updateField) {
                // @ts-ignore: form must be HTMLFormElement
                values = getFormValues(form);
            }
            if (!varname || !equal(values, getVar(form)[varname])) {
                setVar(form, varname ? kv(varname, extend({}, values)) : values);
            }
        };
        dom.watchAttributes(form, 'value', function () {
            setImmediateOnce(update);
        });
        dom.watchElements(form, ':input', function (addedInputs) {
            each(addedInputs, function (i, v) {
                var afterDetached = dom.afterDetached(v, form);
                bindUntil(afterDetached, v, 'change', function () {
                    setImmediateOnce(update);
                });
                afterDetached.then(update.bind(null, true));
            });
            update(true);
        }, true);

        app.on(form, 'reset', function () {
            if (varname) {
                if (!isElementActive(getVarScope(varname, form))) {
                    // @ts-ignore: form must be HTMLFormElement
                    form.reset();
                }
            } else {
                // @ts-ignore: form must be HTMLFormElement
                each(form.elements, function (i, v) {
                    if (!isElementActive(getVarScope(v.name, form))) {
                        v.value = null;
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
