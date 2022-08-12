// @ts-nocheck

/** @type {PromiseConstructor} */
const Promise = window.Promise || require.resolveWeak('promise-polyfill').default;
module.exports = Promise;
