// https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/react-scripts/config/jest/cssTransform.js

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
    process() {
        return 'module.exports = {};';
    },
    getCacheKey() {
        // The output is always the same.
        return 'cssTransform';
    },
};
