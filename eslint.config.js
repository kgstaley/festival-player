const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        // Node.js globals
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'writable',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',  // Warn instead of error
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'client/**',
      'tools/**',
      'eslint.config.js',  // Don't lint the config file itself
      'jest.config.js',  // Jest config uses CommonJS
      '**/*.test.ts',  // Test files need different config
      '**/*.spec.ts',
    ],
  },
];
