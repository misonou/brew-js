const JSDOMEnvironment = require('jest-environment-jsdom');
const { ResourceLoader } = require('jsdom');
const { skipTestByVersion } = require('@misonou/test-utils/setup');

class CustomResourceLoader extends ResourceLoader {
    fetch(url, options) {
        if (options.element) {
            const fetchSpy = options.element.ownerDocument.defaultView.__fetchSpy__;
            if (typeof fetchSpy === 'function') {
                fetchSpy('fetch', url);
            }
        }
        if (url.startsWith('http://localhost/js/')) {
            return Promise.resolve(Buffer.from(`window.__fetchSpy__ && window.__fetchSpy__('jsonp', ${JSON.stringify(url)});`));
        }
        return super.fetch(url, options);
    }
}

module.exports = class extends JSDOMEnvironment {
    constructor(config, options) {
        config = {
            ...config,
            testEnvironmentOptions: {
                ...config.testEnvironmentOptions,
                resources: new CustomResourceLoader()
            }
        };
        super(config, options);
    }

    async setup() {
        await super.setup();
        this.global.fetch = fetch;
        this.global.Request = Request;
        this.global.Response = Response;
        this.global.__hostRealm__ = { FormData, Blob, ArrayBuffer, DOMException, SyntaxError };
    }

    async handleTestEvent(event) {
        if (event.name === 'test_start') {
            skipTestByVersion(event);
        }
    }
};
