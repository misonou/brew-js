import { defineHiddenProperty } from "./include/zeta-dom/util.js";

const BREW_KEY = '__BREW__';
if (window[BREW_KEY]) {
    throw new Error('Another copy of brew-js is instantiated. Please check your dependencies.');
}
defineHiddenProperty(window, BREW_KEY, true, true);

export default null;
