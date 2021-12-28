const configs = ['prettier', 'plugin:react/recommended', 'plugin:jest/recommended'];
const rules = {
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': ['error', { allowShortCircuit: true }],
    'prettier/prettier': ['error'],
    'no-restricted-imports': 'off',
    'import/extensions': ['error', 'never', { svg: 'always', css: 'always', less: 'always' }],
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
};

module.exports = {
    root: true,
    extends: [...configs, '@hh.ru/eslint-config'],
    plugins: ['import', 'prettier', 'babel', 'jest', 'react'],
    rules,
    settings: {
        // Для импорта ts-файлов из js
        'import/resolver': 'typescript',
        react: {
            version: 'detect',
        },
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [...configs, '@hh.ru/eslint-config/typescript'],
            rules,
        },
    ],
};
