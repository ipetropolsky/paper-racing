module.exports = {
    '*.{js,jsx,ts,tsx}': "bash -c 'yarn eslint --fix'",
    '*.{ts,tsx,d.ts}': () => "bash -c 'yarn ts-check'",
    'package.json': "bash -c 'yarn install --immutable --immutable-cache '",
};
