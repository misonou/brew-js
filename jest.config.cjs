const config = {
    "testEnvironment": "./tests/environment",
    "transform": {},
    "clearMocks": true,
    "setupFilesAfterEnv": [
        "geometry-polyfill",
        "@misonou/test-utils/mock/console",
        "@misonou/test-utils/mock/performance",
        "@misonou/test-utils/mock/boxModel",
        "<rootDir>/tests/setup.cjs"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/build/"
    ],
    "collectCoverageFrom": [
        "src/**/*.js",
        "!src/include/**",
        "!src/{entry,entry-slim,errorCode,libCheck}.js"
    ],
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/src/$1"
    }
}

if (process.env.CI !== 'true' && require('fs').existsSync('../zeta-dom')) {
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "^zeta-dom/(.*)$": "<rootDir>/../zeta-dom/src/$1"
    };
}

module.exports = config;
