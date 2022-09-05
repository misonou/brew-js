window.waterpipe = require('waterpipe');
window.jQuery = require('jquery');

expect.extend({
    toBeErrorWithCode(received, code, message) {
        if (!(received instanceof Error)) {
            return { pass: false, message: () => `Expected to be instance of Error` };
        }
        if (received.code !== code) {
            return { pass: false, message: () => `Expected code property to be ${code} but it was ${received.code}` };
        }
        if (message !== undefined && received.message !== message) {
            return { pass: false, message: () => `Expected code property to be ${message} but it was ${received.message}` };
        }
        return { pass: true, message: () => '' };
    },
    toHaveClassName(received, className) {
        var isNot = this.isNot;
        if (!(received instanceof Element)) {
            return { pass: false, message: () => `Expected to be instance of Element` };
        }
        if (!received.classList.contains(className)) {
            return { pass: false, message: () => `Expected element to have class "${className}" but it has "${received.className}"` };
        }
        return { pass: true, message: () => isNot ? `Expected element not to have class "${className}" but it has "${received.className}"` : '' };
    }
});
