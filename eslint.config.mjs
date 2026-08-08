import js from '@eslint/js';
import globals from 'globals';

const languageOptions = {
    sourceType: 'script',
    globals: {
        ...globals.node,
        ...globals.mocha
    }
};

export default [
    {
        ignores: [
            'lib',
            'coverage'
        ]
    },
    js.configs.recommended,
    {
        languageOptions
    },
    {
        files: ['**/*.mjs'],
        languageOptions: {
            ...languageOptions,
            sourceType: 'module'
        }
    },
    {
        rules: {
            strict: ['error', 'global'],
            indent: ['error', 4, {'SwitchCase': 1}],
            'linebreak-style': [
                'error',
                'unix'
            ],
            quotes: [
                'error',
                'single'
            ],
            semi: [
                'error',
                'always'
            ]
        }
    }
];
