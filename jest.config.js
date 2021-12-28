module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ['<rootDir>/src'],

    // A map from regular expressions to paths to transformers.
    // A transformer is a module that provides a synchronous function
    // for transforming source files.
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
        '^.+\\.(css|less)$': ['<rootDir>/tools/jestCssTransform.js'],
        '^(?!.+\\.(js|jsx|ts|tsx|css|less|json)$)': '<rootDir>/tools/jestFileTransform.js',
    },

    // Runs special logic, such as cleaning up components
    // when using React Testing Library and adds special
    // extended assertions to Jest
    setupFilesAfterEnv: ['<rootDir>/tools/setupTests.ts'],

    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    testRegex: '\\.test\\.(js|jsx|ts|tsx)$',

    // Module file extensions for importing
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // The test environment that will be used for testing.
    // The default environment in Jest is a Node.js environment.
    // If you are building a web app, you can use a browser-like
    // environment through jsdom instead.
    testEnvironment: 'jest-environment-jsdom',
};
