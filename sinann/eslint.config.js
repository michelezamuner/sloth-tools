import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    'languageOptions': {
      'ecmaVersion': 2022,
			'sourceType': "module",
      'globals': {
				...globals.browser,
				...globals.node,
        'describe': 'readonly',
        'it': 'readonly',
        'expect': 'readonly',
        'jest': 'readonly',
			},
    },
    'extends': ['js/recommended'],
    'plugins': { js },
    'rules': {
      'comma-dangle': ['error', { 'arrays': 'always-multiline', 'objects': 'always-multiline' }],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'space-infix-ops': ['error'],
    },
  },
]);
