// @ts-nocheck

/** @type {PromiseConstructor} */
const Promise = window.Promise || require.cache[require.resolveWeak('promise-polyfill')].default;
module.exports = Promise;
