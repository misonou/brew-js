// @ts-nocheck

/** @type {Waterpipe} */
const waterpipe = window.waterpipe || require('waterpipe');
module.exports = waterpipe;

// assign to a new variable to avoid incompatble declaration issue by typescript compiler
const waterpipe_ = waterpipe;
waterpipe_.pipes['{'] = function (_, varargs) {
    var globals = varargs.globals;
    var prev = globals.new;
    var o = {};
    globals.new = o;
    while (varargs.hasArgs()) {
        var key = varargs.raw();
        if (key === '}') {
            break;
        }
        o[String(key).replace(/:$/, '')] = varargs.next();
    }
    globals.new = prev;
    return o;
};
// @ts-ignore: add member to function
waterpipe_.pipes['{'].varargs = true;
