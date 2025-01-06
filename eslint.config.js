import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

const pedanticWarn = process.env.PEDANTIC ? 'warn' : 'off';

const extraFileExtensions = ['.svelte'];
export function createConfig(withSvelte = false) {
  return [
    {
      ignores: [
        '**/build/',
        '**/.svelte-kit/',
        '**/dist/',
        '**/playwright-report/',
        '**/e2e-tests/',
        '**/drizzle.config.ts',
        '**/eslint.config.js',
        'lint-staged.config.js',
        'postcss.config.js',
        'run-git-hooks.js',
        'src/db/migrate.js',
        'src/hooks_loader.mjs',
        'src/scripts/*',
        'playwright.config.ts',
        '**/svelte.config.js',
        'tailwind.config.ts',
        'vite.config.ts.*'
      ]
    },
    js.configs.recommended,
    {
      languageOptions: {
        parser: ts.parser,
        parserOptions: {
          projectService: true,
          extraFileExtensions
        }
      }
    },
    ...ts.configs.recommendedTypeChecked,
    ...(withSvelte ? svelte.configs['flat/recommended'] : []),
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node
        }
      },
      rules: {
        'no-unexpected-multiline': 'off',
        'prefer-const': 'off',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unsafe-return': pedanticWarn,
        '@typescript-eslint/no-unsafe-call': pedanticWarn,
        '@typescript-eslint/no-unsafe-member-access': pedanticWarn,
        '@typescript-eslint/no-unsafe-assignment': pedanticWarn,
        '@typescript-eslint/no-unsafe-argument': pedanticWarn,
        '@typescript-eslint/no-unsafe-return': pedanticWarn,
        '@typescript-eslint/no-explicit-any': pedanticWarn,
        '@typescript-eslint/require-await': pedanticWarn,
        // Doesn't work properly with zod's z.infer
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        // Too many false positives with Sveltekit `depends` destructuring
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-floating-promises': [
          'error',
          {
            allowForKnownSafeCalls: ['goto', 'invalidate', 'invalidateAll']
          }
        ]
      }
    },

    withSvelte
      ? {
          files: ['**/*.svelte'],
          languageOptions: {
            parserOptions: {
              parser: ts.parser,
              projectService: true,
              extraFileExtensions,
              svelteFeatures: {
                experimentalGenerics: true
              }
            }
          },
          rules: {
            // This ends up duplicating the svelte warnings in the editor
            'svelte/valid-compile': 'off'
          }
        }
      : null
  ].filter((x) => x != null);
}

export default ts.config(...createConfig(true));
