// @ts-nocheck

/** @type {JQueryStatic} */
const jQuery = window.jQuery || require('jquery');
module.exports = jQuery;

try {
    require('jq-scrollable');
} catch (e) {}
